---
layout: layout.pug
navigationTitle: Kaptain SDK with Tensorflow
title: Kaptain SDK with Tensorflow
menuWeight: 12
excerpt: Tutorial for Kaptain SDK with Tensorflow
beta: false
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

[//]: # "WARNING: This page is auto-generated from Jupyter notebooks and should not be modified directly."

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run the following command
from a Jupyter Notebook Terminal running in your Kaptain installation:

```bash
curl -L https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0.tar.gz | tar xz
```

</p>
<p class="message--note"><strong>NOTE: </strong>These notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebooks
will likely not work.</p>


<p class="message--warning"><strong>NOTE: </strong>This notebook requires Kaptain SDK 0.4.x or later.
</p>

# Kaptain SDK: Training, Tuning, and Deploying

## Introduction
To perform [distributed training](../../training/) on a cluster's resources, conduct [experiments with multiple parallel trials](../../katib/) to obtain the best hyperparameters, and [deploying a trained or tuned model](../../pipelines/) typically requires additional steps, such as building a Docker image and providing framework-specific specifications for Kubernetes.
This places the burden on each data scientist to learn all the details of all the components.

Instead of doing all the work, using the Kaptain SDK, you can `train`, `tune`, and `deploy` from within a notebook without having to worry about framework specifics, Kubeflow-native SDKs, or even thinking about Kubernetes

### What You Will Learn
The Kaptain SDK provides a data science-friendly user experience from within a notebook that hides all the specifics, and focuses on the model as the main abstraction.
A model can be trained, tuned, deployed, and tracked.

The example is based on TensorFlow, but it works equally for PyTorch.
The original model code can be found in the tutorials [MNIST with TensorFlow](../../training/tensorflow)
and [MNIST with PyTorch](../../training/pytorch).

The SDK relies on [MinIO](https://min.io/), an open-source S3-compliant object storage tool, that is already included with your Kaptain installation.

### What You Need
All you need is this notebook.

## Prerequisites
Before proceeding, check you are using the correct notebook image, that is, [TensorFlow](https://www.tensorflow.org/api_docs/) is available:


```sh
%%sh
pip list | grep tensorflow
```

    tensorflow                    2.4.0
    tensorflow-datasets           4.1.0
    tensorflow-estimator          2.4.0
    tensorflow-metadata           0.26.0


## Prepare the Training Code and Data Sets
The examples in this tutorial require a trainer code file `mnist.py` and a dataset to be present in the current folder.
The code and datasets are already available in the [other tutorials](../../training/) and can be reused here.

## How to Create a Docker Credentials File and Kubernetes Secret

For the tutorial you will need `getpass` to provide a password interactively without it being immediately visible.
It is a standard Python library, so there is no need to install it.
A simple `import` will suffice.

<p class="message--warning"><strong>WARNING: </strong>Please do not store passwords directly in notebooks.
    Ideally, credentials are stored safely inside secrets management solutions or provided with service accounts.
    Please check the section on <a href="https://docs.d2iq.com/dkp/kaptain/">how to manage secrets</a> in the official Kaptain documentation for more details on how to set up Docker credentials that you can attach to a notebook server.
    This notebook should be used for demonstration purposes only!
</p>

Please type in the container registry username by running the next cell:


```python
import json
import getpass
import pathlib
from base64 import b64encode
```


```python
docker_user = input()
```

Enter the password for the Docker container registry when prompted by executing the following code:


```python
docker_password = getpass.getpass()
```

With these details, base64-encode the username and password and create a Docker configuration file as follows:


```python
# Create a folder to store the Docker configuration file
docker_config_folder = pathlib.Path.joinpath(pathlib.Path.home(), ".docker")
docker_config_folder.mkdir(exist_ok=True)

# Write the base64-encoded credentials to the configuration file
docker_credentials = b64encode(f"{docker_user}:{docker_password}".encode()).decode()
config = {"auths": {"https://index.docker.io/v1/": {"auth": docker_credentials}}}
with open(f"{docker_config_folder}/config.json", "w") as outfile:
    outfile.write(json.dumps(config))
```

## Adapt the Model Code
To use the Kaptain SDK, you need to add two lines of code to the original model code:
1. One right after the model training (here: Keras' `fit` method), to save the trained model to the cluster's built-in object storage, MinIO.
1. Another right after the model evaluation (here: Keras' `evaluate` method), to record the metrics of interest.


```python
%%writefile trainer.py
import argparse
import logging

import tensorflow as tf
import tensorflow_datasets as tfds

from kaptain.platform.model_export_util import ModelExportUtil
from kaptain.platform.metadata_util import MetadataUtil

logging.getLogger().setLevel(logging.INFO)


def get_datasets(buffer_size):
    datasets, ds_info = tfds.load(name="mnist", data_dir="datasets", download=False, with_info=True, as_supervised=True)
    mnist_train, mnist_test = datasets["train"], datasets["test"]

    def scale(image, label):
        image = tf.cast(image, tf.float32) / 255.0
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
            tf.keras.layers.Dense(10, activation="softmax"),
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
    parser = argparse.ArgumentParser(description="TensorFlow MNIST Trainer")
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

    train_dataset, test_dataset = get_datasets(buffer_size=args.buffer_size)
    train_dataset = train_dataset.batch(batch_size=global_batch_size)
    test_dataset = test_dataset.batch(batch_size=global_batch_size)

    dataset_options = tf.data.Options()
    dataset_options.experimental_distribute.auto_shard_policy = (
        tf.data.experimental.AutoShardPolicy.DATA
    )
    train_datasets_sharded = train_dataset.with_options(dataset_options)
    test_dataset_sharded = test_dataset.with_options(dataset_options)

    with strategy.scope():
        model = compile_model(args=args)

    # Train the model
    model.fit(train_datasets_sharded, epochs=args.epochs, steps_per_epoch=args.steps)

    # Save the trained model (to MinIO) with the exporter utility
    model.save("mnist")
    ModelExportUtil().upload_model("mnist")

    eval_loss, eval_acc = model.evaluate(test_dataset_sharded, verbose=0, steps=args.steps)
    
    # Record the evaluation metrics for use with the hyperparameter tuner
    MetadataUtil.record_metrics({"loss": eval_loss, "accuracy": eval_acc})

if __name__ == "__main__":
    main()
```

    Writing trainer.py


## Define the Model
The central abstraction of the Kaptain SDK is a model:


```python
extra_files = ["datasets/mnist"]
base_image = "mesosphere/kubeflow-dev:305a2b36-tensorflow-2.8.0"
# replace with your docker repository with a tag (optional), e.g. "repository/image"  or "repository/image:tag"
image_name = "mesosphere/kubeflow:mnist-sdk-example"
# name of the file with additional python packages to install into model image (e.g. "requirements.txt")
requirements = None
```


```python
from kaptain.model.models import Model
from kaptain.model.frameworks import ModelFramework

model = Model(
    id="dev/mnist",
    name="MNIST",
    description="MNIST Model",
    version="0.0.1",
    framework=ModelFramework.TENSORFLOW,
    framework_version="2.8.0",
    main_file="trainer.py",
    extra_files=extra_files,
    image_name=image_name,
    base_image=base_image,
    requirements=requirements,
)
```

The `id` is a unique identifier of the model.
The identifier shown indicates it is an MNIST model in development.

The fields `member` and `description` are for humans: to inform your colleagues and yourself of what the model is about.
`version` is the models' own version, so it is easy to identify models by their iteration.
The `framework` and `framework_version` are for the time being human-friendly metadata.

Since a Docker image is built in the background when you `train` or `tune` a `Model` instance, a `base_image` has to be provided.
The name of the final image `image_name` must be provided with or without image tag.
If the tag is omitted, a concatenation of model `id`, `framework`, and `framework_version` is used.

The `main_file` specifies the name of file that contains the model code, that is, `trainer.py` for the purposes of this tutorial.

To specify additional Python packages required for training or serving, provide the path to your requirements file via the `requirements` parameter of the `Model` class. Details on the format of the requirements file can be found in the [pip official documentation](https://pip.pypa.io/en/stable/cli/pip_install/#requirements-file-format).

More details are available with `?Model`.

## Train the Model
Training the model on 2 nodes is as easy as the following function call:


```python
workers = 2
gpus = 0
memory = "5G"
cpu = "1"
```


```python
model.train(
    workers=workers,
    cpu=cpu,
    memory=memory,
    gpus=gpus,
    hyperparameters={"--steps": 10, "--epochs": 5},
    args={}, # additional command line arguments for the training job. 
)
```

    ...
    10/10 [==============================] - 0s 48ms/step - accuracy: 0.2516 - loss: 2.2895
    [I 201214 11:18:01 kubernetes:190] Epoch 2/5
    10/10 [==============================] - 0s 48ms/step - accuracy: 0.4219 - loss: 2.1582
    [I 201214 11:18:02 kubernetes:190] Epoch 3/5
    10/10 [==============================] - 0s 35ms/step - accuracy: 0.5633 - loss: 1.9389
    [I 201214 11:18:02 kubernetes:190] Epoch 4/5
    10/10 [==============================] - 0s 38ms/step - accuracy: 0.5859 - loss: 1.8862
    [I 201214 11:18:03 kubernetes:190] Epoch 5/5
    10/10 [==============================] - 0s 42ms/step - accuracy: 0.6461 - loss: 1.8179
    [I 201214 11:18:06 kubernetes:190] INFO:root:Record metrics.
    [I 201214 11:18:06 kubernetes:190] INFO:root:Metrics saved.
    [I 201214 11:18:07 job_runner:58] Waiting for the training job to complete...
    [I 201214 11:18:07 models:332] Training result: Succeeded


The default `gpus` argument is 0, but it is shown here as an explicit option.
Use `?Model.train` to see all supported arguments.

<p class="message--note"><strong>NOTE: </strong>When resource quotas are set for a namespace, users have to specify <code>cpu</code> and <code>memory</code> explicitly in the SDK. 
Otherwise, tasks such as training and tuning will fail with <code>Error creating: pods ... is forbidden: failed quota: kf-resource-quota: must specify cpu,memory</code>.
These fields are optional when resource quotas are not set.
In case the issue appears for other types of workloads, it is recommended to configure defaults for the user namespace using the <a href="https://kubernetes.io/docs/concepts/policy/limit-range/">Limit Range</a>.
</p>

The low accuracy of the model is to make the demonstration of distributed training quicker, as in the next section the model's hyperparameters are optimized anyway.

### Verify the Model is Exported to MinIO


```sh
%%sh
set -o errexit

minio_accesskey=$(kubectl get secret minio-creds-secret -o jsonpath="{.data.accesskey}" | base64 --decode)
minio_secretkey=$(kubectl get secret minio-creds-secret -o jsonpath="{.data.secretkey}" | base64 --decode)

mc --no-color alias set minio http://minio.kubeflow ${minio_accesskey} ${minio_secretkey}
mc --no-color ls -r minio/kaptain/models
```

## Deploy the Model
A trained model can be deployed as an auto-scalable inference service with a single call:


```python
model.deploy(cpu="1", memory="2G")
```

    [I 201214 11:36:13 models:506] Deploying model from s3://kaptain/models/dev/mnist/tuned/f9e0dff3211a4bf8968c95519bedb926
    [I 201214 11:36:13 kubernetes:36] Reading secrets dev-mnist-secret in namespace demo.
    [I 201214 11:36:13 kubernetes:27] Creating secret dev-mnist-secret in namespace demo.
    [I 201214 11:36:13 kubernetes:84] Reading secrets dev-mnist-service-account in namespace demo.
    [I 201214 11:36:13 kubernetes:75] Creating service account dev-mnist-service-account in namespace demo.
    [I 201214 11:36:50 deployer:93] Model dev/mnist deployed successfully. Cluster URL: http://dev-mnist.demo.svc.cluster.local/v1/models/dev-mnist:predict


The SDK will deploy the latest saved trained or tuned model.
It is also possible to specify a custom URI for the model, and GPUs for inference.
If the model has already been deployed before, use `replace=True` to hot-swap it.

## Tune the Model
Specify the hyperparameters and ranges or discrete values, and then use the `tune` method:


```python
trials = 16
parallel_trials = 2
```


```python
from kaptain.hyperparameter.domains import Double, Discrete

hyperparams = {
    "--learning-rate": Double(0.2, 0.8),
    "--momentum": Double(0.1, 0.5),
    "--epochs": Discrete(["5", "10"]),
    "--steps": Discrete(["100"]),
}

model.tune(
    trials=trials, 
    parallel_trials=parallel_trials, 
    workers=workers,
    cpu=cpu,
    memory=memory,
    gpus=gpus, 
    hyperparameters=hyperparams, 
    objectives=["accuracy"], 
    objective_goal=0.99,
    args={}, # additional command line arguments to pass to a Trial (TFJob). 
)
```

    ...
    [I 201214 11:27:11 experiment_runner:66] Creating experiment mnist-tune-14c4431d in namespace demo
    [I 201214 11:27:11 experiment_runner:68] Experiment mnist-tune-14c4431d has been created.
    Progress: 100%|=========================|16/16 [time: 07:15, accuracy: 0.9574999809265137, trials running: 0, pending: 0, failed: 0, killed: 0]
    [I 201214 11:34:27 experiment_runner:74] Model tuning completed, final status: Succeeded
    [I 201214 11:34:27 kubernetes:66] Deleting secret tune-3cc0353f00e4f27f in namespace demo.
    [I 201214 11:34:27 models:429] Experiment results:
        parameters: {'--learning-rate': '0.6885679458378395', '--momentum': '0.3915904809621852', '--epochs': '10', '--steps': '100'}, best_trial_name: mnist-tune-14c4431d-wttgxggg
    [I 201214 11:34:27 models:432] Copying saved model with the best metrics from the trial to the target location.
    [I 201214 11:34:27 models:444] Removing intermediate trial models from the storage.


For more details on the arguments supported by the SDK, execute `?Model.tune` in a notebook.
Available options are:
- a list of objectives with a goal for the primary objective based on the objective type (maximize vs minimize)
- the maximum number of trials, parallel trials, and failed trials
- the hyperparameter tuning algorithm and any custom algorithm settings

The Kaptain SDK allows individual trials to be run in parallel as well as trained in a distributed manner each.

<p class="message--warning"><strong>BEWARE! </strong>With a large number of parallel trials <i>and</i> a fair number of workers per trial, it is easy to max out on the available resources.
    If the worker quota for the namespace is <i>Q</i>, the number of parallel trials is <i>P</i>, and the number of workers per trial is <i>W</i>, please ensure that <i>P</i> &times; <i>W</i> &leq; <i>Q</i></p>

## Run canary rollout
To run a canary rollout launch:


```python
model.deploy_canary(canary_traffic_percentage=30)
```

This will split the traffic between the last deployed revision and the current latest ready revision.
It is also possible to specify a custom URI for the model.

To promote the latest canary deployment run:


```python
model.promote_canary()
```

This will redirect all the traffic to the deployed canary revision.

## Test the Model Endpoint


```python
import matplotlib.pyplot as plt
import numpy as np


def display_image(x_test, image_index):
    plt.imshow(x_test[image_index].reshape(28, 28), cmap="binary")


with np.load("datasets/mnist.npz", allow_pickle=True) as f:
    x_test = f["x_test"] / 255.0

image_index = 1005

display_image(x_test, image_index)
```

![Image](../../pipelines/img/9.png)


```python
import codecs, json

tf_serving_req = {
    "instances": x_test[image_index : image_index + 1].reshape(1, 28, 28, 1).tolist()
}

with open("input.json", "w") as json_file:
    json.dump(tf_serving_req, json_file)
```


```sh
%%sh
set -o errexit
model_name="dev-mnist"
namespace=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)
url="http://${model_name}.${namespace}.svc.cluster.local/v1/models/${model_name}:predict"

curl --location \
     --silent \
     --fail \
     --retry 10 \
     --retry-delay 10 \
     $url \
     -d@input.json
```

    {
        "predictions": [[2.81844894e-14, 1.56485475e-13, 4.98654347e-11, 1.6658154e-08, 4.37566339e-09, 2.91234592e-10, 3.17106647e-15, 8.52349302e-11, 5.57288715e-10, 1.0]
        ]
    }

The last class has the largest probability; the neural network correctly predicts the image to be a 9.

This tutorial includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs: [https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z](https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z) and [https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z](https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z)

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
