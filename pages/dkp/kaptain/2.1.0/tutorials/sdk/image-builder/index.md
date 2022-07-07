---
layout: layout.pug
navigationTitle: Build Docker Images with Kaptain SDK
title: Build Docker Images with Kaptain SDK
menuWeight: 14
excerpt: Tutorial for Build Docker Images with Kaptain SDK
beta: false
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

[//]: # "WARNING: This page is auto-generated from Jupyter notebooks and should not be modified directly."

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0-dev.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run the following command
from a Jupyter Notebook Terminal running in your Kaptain installation:

```bash
curl -L https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0-dev.tar.gz | tar xz
```

</p>
<p class="message--note"><strong>NOTE: </strong>These notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebooks
will likely not work.</p>


# Kaptain SDK: Build Docker Images from within Jupyter Notebooks

## Introduction
Although you can build Docker images by downloading files to your local machine and subsequently pushing the images to a container registry, it is much faster to do so without leaving Jupyter!

### What You Will Learn
In this notebook you will go through the steps involved in building a Docker image from a base image (e.g. TensorFlow or PyTorch) and a custom trainer file that defines your machine learning model.
This image can be used as a part of a machine learning workflow, such as distributed training, [hyperparameter tuning](../../katib), Kubeflow Pipelines and other.
You can use the model code you generated with `%%writefile` in [MNIST with TensorFlow tutorial](../../training/tensorflow) or [MNIST with PyTorch tutorial](../../training/pytorch) or a file of your own choosing.

The Docker image builder process stores (temporary) files in MinIO.
[MinIO](https://min.io/), an open-source S3-compliant object storage tool, is already included with your Kubeflow installation.

### What You Need

- An executable Python file (e.g. an `mnist.py` trainer - you can extract it from [Tensorflow tutorial](../../training/tensorflow) in case you do not have one handy);
- A container registry to which you have push access.

Please note that this notebook is interactive!

## Prerequisites
Kaptain SDK 1.0.0 or later:


```sh
%%sh
pip show d2iq-kaptain
```

    Name: d2iq-kaptain
    Version: 1.0.0
    Summary: A pack-and-ship SDK for Kaptain
    Home-page: UNKNOWN
    Author: The Kaptain Team
    Author-email: kaptain-sdk@d2iq.com
    License: Apache
    Location: /opt/conda/lib/python3.7/site-packages
    Requires: python-dxf, retrying, botocore, kubernetes, types-requests, object-mapper, boto3, torch-model-archiver, kfserving, kubeflow-katib, kubeflow-training, tqdm, humanize, tenacity, typing
    Required-by: 


### Prepare the training code and datasets
The examples in this tutorial require a trainer code file `mnist.py` and a dataset to be present in the current folder.
The code and datasets are already available in [MNIST with TensorFlow](../../training/tensorflow)
or [MNIST with PyTorch](../../training/pytorch) tutorials and can be reused here.


```python
%%writefile mnist.py

import argparse
import logging
import os
import datetime
import tensorflow as tf
import tensorflow_datasets as tfds

logging.getLogger().setLevel(logging.INFO)


def get_datasets(buffer_size):
    datasets, ds_info = tfds.load(name="mnist", data_dir="datasets", download=False, with_info=True, as_supervised=True)
    mnist_train, mnist_test = datasets["train"], datasets["test"]

    def scale(image, label):
        image = tf.cast(image, tf.float32) / 255
        return image, label

    train_dataset = mnist_train.map(scale).cache().shuffle(buffer_size).repeat()
    test_dataset = mnist_test.map(scale)

    return train_dataset, test_dataset


def compile_model(args):
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Conv2D(32, 3, activation="relu", input_shape=(28, 28, 1)),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dense(10),
        ]
    )
    model.compile(
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=tf.keras.optimizers.SGD(
            learning_rate=args.learning_rate, momentum=args.momentum
        ),
        metrics=["accuracy"],
    )
    return model


def main():
    parser = argparse.ArgumentParser(description="TensorFlow MNIST Training Job")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=64,
        metavar="N",
        help="Batch size for training (default: 64)",
    )
    parser.add_argument(
        "--buffer-size",
        type=int,
        default=10000,
        metavar="N",
        help="Number of training examples to buffer before shuffling" "default: 10000)",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=5,
        metavar="N",
        help="Number of epochs to train (default: 5)",
    )
    parser.add_argument(
        "--steps",
        type=int,
        default=10,
        metavar="N",
        help="Number of batches to train the model on in each epoch (default: 10)",
    )
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=0.5,
        metavar="N",
        help="Learning rate (default: 0.5)",
    )
    parser.add_argument(
        "--momentum",
        type=float,
        default=0.1,
        metavar="N",
        help="Accelerates SGD in the relevant direction and dampens oscillations (default: 0.1)",
    )
    
    args, _ = parser.parse_known_args()

    strategy = tf.distribute.experimental.MultiWorkerMirroredStrategy()
    logging.debug(f"num_replicas_in_sync: {strategy.num_replicas_in_sync}")
    global_batch_size = args.batch_size * strategy.num_replicas_in_sync

    # Datasets need to be created after instantiation of `MultiWorkerMirroredStrategy`
    train_dataset, test_dataset = get_datasets(buffer_size=args.buffer_size)
    train_dataset = train_dataset.batch(batch_size=global_batch_size)
    test_dataset = test_dataset.batch(batch_size=global_batch_size)

    # See: https://www.tensorflow.org/api_docs/python/tf/data/experimental/DistributeOptions
    dataset_options = tf.data.Options()
    dataset_options.experimental_distribute.auto_shard_policy = (
        tf.data.experimental.AutoShardPolicy.DATA
    )
    train_datasets_sharded = train_dataset.with_options(dataset_options)
    test_dataset_sharded = test_dataset.with_options(dataset_options)

    # Model compilation must be within `strategy.scope()`
    # See: https://www.tensorflow.org/tutorials/distribute/multi_worker_with_keras
    with strategy.scope():
        model = compile_model(args=args)

    # You cannot set `steps_per_epoch = None` with MirroredStrategy
    # See: https://github.com/tensorflow/tensorflow/issues/25254
    model.fit(train_datasets_sharded, epochs=args.epochs, steps_per_epoch=args.steps)
    eval_loss, eval_acc = model.evaluate(test_dataset_sharded, verbose=0, steps=args.steps)

    logging.info("loss={:.4f}".format(eval_loss))
    logging.info("accuracy={:.4f}".format(eval_acc))


if __name__ == "__main__":
    main()
```

    Writing mnist.py


## How to Create a Docker Credentials File

For the tutorial you will need `getpass` to provide a password interactively without it being immediately visible.
It is a standard Python library, so there is no need to install it.
A simple `import` will suffice.

To learn more about mounting credentials to notebooks via <code>PodDefault</code> resources, visit the [Kaptain SDK documentation page](../../sdk/).

<p class="message--warning"><strong>WARNING: </strong>Please do not store passwords directly in notebooks.
    Ideally, credentials are stored safely inside secrets management solutions or provided with service accounts.
    This notebook should be used for demonstration purposes only!</p>


```python
import json
import getpass
```

Please type in the container registry username by running the next cell:


```python
docker_user = input()
```

Please enter the password for the container registry by executing the following cell:


```python
docker_password = getpass.getpass()
```

With these details, base-64-encode the username and password and create a Kubernetes configmap with a name expected by the builder's context source.


```python
import json
import getpass
import pathlib
from base64 import b64encode

# Create a folder to store the Docker configuration file
docker_config_folder = pathlib.Path.joinpath(pathlib.Path.home(), ".docker")
docker_config_folder.mkdir(exist_ok=True)

# Write the base64-encoded credentials to the configuration file
docker_credentials = b64encode(f"{docker_user}:{docker_password}".encode()).decode()
config = {"auths": {"https://index.docker.io/v1/": {"auth": docker_credentials}}}
with open(f"{docker_config_folder}/config.json", "w") as outfile:
    outfile.write(json.dumps(config))
```

## How to Build a Docker Image
Let us set some constants that will customize the code for your environment.


```python
import time
import os

timestamp = int(time.time())

# Name of the file with additional Python packages required during model training
requirements = "requirements.txt"

extra_files = [requirements, "mnist.py", "datasets"]

# Image used in the FROM instruction of the Dockerfile
base_image = "mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0"

# Name of the final image
image_name = f"mesosphere/kubeflow:kaptain-sdk-mnist-tf-{timestamp}"
```

Create a requirements file with Python packages that need to be included in the resulting image. For the purpose of this example, we will specify packages already installed into the base image:


```python
%%writefile {requirements}

scikit-learn
numpy
```

    Writing requirements.txt


This tutorial describes two options of using the SDK:
- If your goal is to provide a Docker image that includes the code for distributed training or hyperparameter tuning, Option 1 is more appropriate.
  It does not run the job (with pre-defined arguments) but merely pushes the image to the container registry.
- If your goal is to run a distributed training job _immediately_ from a notebook, choose Option 2.
  With it, you build (and push) the image as a part of a deployment (e.g. distributed training job).

Both options automatically push the image to the registry specified.

## Option 1: Build-Push
You can 'just' build a Docker image, that is, without running it by plugging it into your ML-workflow, with the following snippet.

First, we need to define Dockerfile for the image:


```python
dockerfile = f"""
FROM {base_image}

# Create working directory to place required files (requirements.txt, the trainer file and the dataset)
WORKDIR /workdir
COPY . /workdir

RUN pip install -r {requirements}
ENTRYPOINT ["python", "-u", "mnist.py"]
"""
```

Initialize image builder:


```python
from kaptain.platform.image_builder_util import ImageBuilderUtil
from kaptain import envs

envs.VERBOSE = True

builder = ImageBuilderUtil.builder(
    image_name=image_name, dockerfile_content=dockerfile, files=extra_files,
)
```

Finally, the following cell will run the image build using the Dockerfile with all the files and dependencies mentioned above:


```python
builder.build_image()
```

    2021-11-02 14:11:59,714 kaptain-log[INFO]: Building Docker image.
    2021-11-02 14:11:59,714 kaptain-log[INFO]: Creating secret docker-ffccde4355a4a541 in namespace user1.
    2021-11-02 14:11:59,728 kaptain-log[INFO]: Creating secret context-ffccde4355a4a541 in namespace user1.
    2021-11-02 14:11:59,735 kaptain-log[INFO]: Creating job kaniko-ffccde4355a4a541 in namespace user1.
    2021-11-02 14:11:59,918 kaptain-log[INFO]: Waiting for Image Build to start...
    2021-11-02 14:12:03,869 kaptain-log[INFO]: Image Build started in pod: kaniko-ffccde4355a4a541-hz9pl.
    2021-11-02 14:12:05,996 kaptain-log[INFO]: [kaniko-ffccde4355a4a541-hz9pl/kaniko] logs:
    [0001] Retrieving image manifest mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0001] Retrieving image mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0001] Retrieving image manifest mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0001] Retrieving image mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0002] Built cross stage deps: map[]                
    2021-11-02 14:12:57,247 kaptain-log[INFO]: [kaniko-ffccde4355a4a541-hz9pl/kaniko] logs:
    [0002] Retrieving image manifest mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0002] Retrieving image mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0003] Retrieving image manifest mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0003] Retrieving image mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0 
    [0004] Executing 0 build triggers                   
    [0004] Unpacking rootfs as cmd COPY . /workdir requires it. 
    [0054] Taking snapshot of full filesystem...        
    2021-11-02 14:13:54,353 kaptain-log[INFO]: [kaniko-ffccde4355a4a541-hz9pl/kaniko] logs:
    [0111] WORKDIR /workdir                             
    2021-11-02 14:15:05,258 kaptain-log[INFO]: [kaniko-ffccde4355a4a541-hz9pl/kaniko] logs:
    [0111] cmd: workdir                                 
    [0111] Changed working directory to /workdir        
    [0111] Creating directory /workdir                  
    [0111] COPY . /workdir                              
    [0111] RUN pip install -r requirements.txt          
    [0111] cmd: /bin/bash                               
    [0111] args: [-cu pip install -r requirements.txt]  
    [0111] Running: [/bin/bash -cu pip install -r requirements.txt] 
    Requirement already satisfied: scikit-learn in /opt/conda/lib/python3.7/site-packages (from -r requirements.txt (line 2)) (0.24.2)
    Requirement already satisfied: numpy in /opt/conda/lib/python3.7/site-packages (from -r requirements.txt (line 3)) (1.19.5)
    Requirement already satisfied: scipy>=0.19.1 in /opt/conda/lib/python3.7/site-packages (from scikit-learn->-r requirements.txt (line 2)) (1.7.1)
    Requirement already satisfied: joblib>=0.11 in /opt/conda/lib/python3.7/site-packages (from scikit-learn->-r requirements.txt (line 2)) (1.0.1)
    Requirement already satisfied: threadpoolctl>=2.0.0 in /opt/conda/lib/python3.7/site-packages (from scikit-learn->-r requirements.txt (line 2)) (2.2.0)
    WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
    [0113] ENTRYPOINT ["python", "-u", "mnist.py"]      
    [0113] LABEL checksum=dd270080d096520306e0cb72857bd859 
    [0113] Applying label checksum=dd270080d096520306e0cb72857bd859 
    [0113] Taking snapshot of full filesystem...        
    2021-11-02 14:15:06,233 kaptain-log[INFO]: Image build completed successfully. Image pushed: mesosphere/kubeflow:kaptain-sdk-mnist-tf-1635862297
    2021-11-02 14:15:06,234 kaptain-log[INFO]: Deleting job kaniko-ffccde4355a4a541 in namespace user1.
    2021-11-02 14:15:06,243 kaptain-log[INFO]: Deleting secret docker-ffccde4355a4a541 in namespace user1.
    2021-11-02 14:15:06,253 kaptain-log[INFO]: Deleting secret context-ffccde4355a4a541 in namespace user1.


That's it! Image build has been completed and the image with required packages and files has been pushed to the Docker registry. 

## Option 2: Build-Push-Run

But what if you want to not just build and push an image, but actually run it as a distributed training job on the cluster without leaving the notebook? Kaptain SDK can take care of it.

The central abstraction of the Kaptain SDK is a <code>Model</code> class. All we need to do to actually run a training job with the new image is to create a new <code>Model</code> object from the previously defined parameters and invoke the <code>train()</code> method, specifying the desired resource requirements, number of replicas, and container arguments. Behind the scenes, Kaptain SDK will build the model image, push it to the image registry and schedule a training job with the new model image on the cluster.


```python
from kaptain.model.models import Model
from kaptain.model.frameworks import ModelFramework

model = Model(
    id="mnist-model",
    name="MNIST",
    description="MNIST Model",
    version="1.0",
    framework=ModelFramework.TENSORFLOW,
    framework_version="2.5.0",
    main_file="mnist.py",
    extra_files=extra_files,
    image_name=image_name,
    base_image=base_image,
    requirements=requirements,
)

model.train(
    cpu=1,
    memory="2G",
    workers=3,
    hyperparameters={"--learning-rate": 0.1, "--momentum": 0.02, "--epochs": 5,},
)
```

    2021-11-02 18:37:40,752 kaptain-log[INFO]: Skipping image build for the model - the image 'mesosphere/kubeflow:kaptain-sdk-mnist-tf-1635862297' with the same contents has already been published to the registry.
    2021-11-02 18:37:40,755 kaptain-log[INFO]: Creating secret train-d5fd784b5409a57f in namespace user1.
    2021-11-02 18:37:40,768 kaptain-log[INFO]: Creating secret train-registry-c33ad3a574d5dee2 in namespace user1.
    2021-11-02 18:37:40,775 kaptain-log[INFO]: Submitting a new training job "mnist-tfjob-30f13374".
    2021-11-02 18:37:40,801 kaptain-log[INFO]: Waiting for the training job to complete...
    2021-11-02 18:37:41,327 kaptain-log[INFO]: Waiting for Master Node Training Model to start...
    2021-11-02 18:37:43,377 kaptain-log[INFO]: Master Node Training Model started in pod: mnist-tfjob-30f13374-chief-0.
    2021-11-02 18:37:46,014 kaptain-log[INFO]: [mnist-tfjob-30f13374-chief-0/tensorflow] logs:
    ...
    Epoch 1/5
    10/10 [==============================] - 6s 99ms/step - loss: 2.2109 - accuracy: 0.2283
    2021-11-02 18:37:54,934 kaptain-log[INFO]: [mnist-tfjob-30f13374-chief-0/tensorflow] logs:
    Epoch 2/5
    10/10 [==============================] - 1s 100ms/step - loss: 1.5499 - accuracy: 0.6074
    Epoch 3/5
    10/10 [==============================] - 1s 90ms/step - loss: 1.0213 - accuracy: 0.6840
    2021-11-02 18:37:57,019 kaptain-log[INFO]: [mnist-tfjob-30f13374-chief-0/tensorflow] logs:
    Epoch 4/5
    10/10 [==============================] - 1s 91ms/step - loss: 0.6624 - accuracy: 0.8128
    Epoch 5/5
    10/10 [==============================] - 1s 100ms/step - loss: 0.6195 - accuracy: 0.8173
    ...
    2021-11-02 18:38:00,335 kaptain-log[INFO]: [mnist-tfjob-30f13374-chief-0/tensorflow] logs:
    INFO:root:accuracy=0.8609
    2021-11-02 18:38:30,371 kaptain-log[INFO]: Deleting secret train-d5fd784b5409a57f in namespace user1.
    2021-11-02 18:38:30,378 kaptain-log[INFO]: Deleting secret train-registry-c33ad3a574d5dee2 in namespace user1.
    2021-11-02 18:38:30,384 kaptain-log[INFO]: Model training is completed.


To learn more about creating and deploying machine learninig models with Kaptain SDK, refer to [Kaptain SDK with Tensorflow](../tensorflow) or [Kaptain SDK with Pytorch](../pytorch) tutorials.

This tutorial includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs: [https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z](https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z) and [https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z](https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z)

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
