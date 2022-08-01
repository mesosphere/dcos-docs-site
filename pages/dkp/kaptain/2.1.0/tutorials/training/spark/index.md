---
layout: layout.pug
navigationTitle: MNIST with Spark
title: MNIST with Spark
menuWeight: 16
excerpt: Tutorial for MNIST with Spark
beta: false
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

[//]: # "WARNING: This page is auto-generated from Jupyter notebooks and should not be modified directly."

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0-rc.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run the following command
from a Jupyter Notebook Terminal running in your Kaptain installation:

```bash
curl -L https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.1.0-rc.0.tar.gz | tar xz
```

</p>
<p class="message--note"><strong>NOTE: </strong>These notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebooks
will likely not work.</p>


# Training MNIST with Spark and Horovod

## Introduction
Recognizing handwritten digits based on the [MNIST (Modified National Institute of Standards and Technology) data set](http://yann.lecun.com/exdb/mnist/) is the "Hello, World" example of machine learning.
Each (anti-aliased) black-and-white image represents a digit from 0 to 9 and fits in a 28&times;28 pixel bounding box.
The problem of recognizing digits from handwriting is, for instance, important to the postal service when automatically reading zip codes from envelopes.

### What You Will Learn
You will see how to use Spark to build a simple Keras model to perform the multi-class classification of images provided.
The example in the notebook includes both training a model in the notebook and running a distributed training job on the cluster using <a href="https://github.com/horovod/horovod">Horovod</a>, so you can easily scale up your own models.
[Horovod is best](https://github.com/horovod/horovod/blob/master/docs/spark.rst) when you want to build estimators with Keras or if you want to train on Spark `DataFrame`s from `pyspark`.
Of course, you can also use Spark's [MLlib](https://spark.apache.org/docs/3.3.0/ml-guide.html) if you prefer.
They key is that if you already have a Keras model, you may not want to rewrite it in Spark, but you may still want to leverage the power of distributed training with Spark and Horovod.

<p class="message--warning"><strong>Horovod and Istio</strong><br />
    If Istio is enabled in the current namespace (ask your administrator), <a href="https://github.com/horovod/horovod/issues/1855">Horovod on Spark does not work from within a notebook</a> neither does Spark in the client mode due to <a href="https://spark.apache.org/docs/3.3.0/running-on-kubernetes.html#client-mode-networking">networking specifics</a>.
    To disable Istio, please set the namespace label <code>istio-injection</code> to <code>disabled</code>: <code>kubectl label namespace test istio-injection=disabled --overwrite</code> and create a new dedicated notebook for Horovod-on-Spark or Spark client-mode workloads.
    Once the dedicated notebook server is created, enable Istio sidecar injection back: <code>kubectl label namespace test istio-injection=enabled --overwrite</code>.
    Additionally, you should disable it at the application level when running a distributed job (see below).
</p>

For the distributed training job, you have to package the complete trainer code in a Docker image.
You can do that with Kaptain SDK, so that you do not have to leave your favorite notebook environment at all!
Included are also instructions for local development, in case you prefer that.

### What You Need
All you need is this notebook.
If you prefer to create your Docker image locally (i.e. outside of the Kubernetes cluster), you must have a [Docker](https://www.docker.com/products/container-runtime) client on your machine and configured to work with your own container registry.
For Kubernetes commands to run outside of the cluster, you need [`kubectl`](https://kubernetes.io/docs/reference/kubectl/kubectl/).

## Prerequisites
All pre-built images already include Spark and Horovod.

To package the trainer in a container image, you need a file (on the cluster) that contains both the code and a file with the resource definition of the job for the Kubernetes cluster:


```python
TRAINER_FILE = "mnist.py"
KUBERNETES_FILE = "sparkapp-mnist.yaml"
%env KUBERNETES_FILE $KUBERNETES_FILE
```

Define a helper function to capture output from a cell that usually looks like `some-resource created`, using [`%%capture`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#cellmagic-capture):


```python
import re

from IPython.utils.capture import CapturedIO


def get_resource(captured_io: CapturedIO) -> str:
    """
    Gets a resource name from `kubectl apply -f <configuration.yaml>`.

    :param str captured_io: Output captured by using `%%capture` cell magic
    :return: Name of the Kubernetes resource
    :rtype: str
    :raises Exception: if the resource could not be created (e.g. already exists)
    """
    out = captured_io.stdout
    matches = re.search(r"^(.+)\s+created", out)
    if matches is not None:
        return matches.group(1)
    else:
        raise Exception(f"Cannot get resource as its creation failed: {out}")
```

## How to Train the Model in the Notebook
Since you ultimately want to train the model in a distributed fashion (potentially on GPUs), put all the code in a single cell.
That way you can save the file and include it in a container image:


```python
%%writefile $TRAINER_FILE
import argparse
import os
import tempfile

import numpy as np
import horovod.spark
import horovod.tensorflow.keras as hvd
import tensorflow as tf
from pyspark.sql import SparkSession


def get_dataset(rank=0, size=1):
    with np.load('datasets/mnist.npz', allow_pickle=True) as f:
        x_train = f['x_train'][rank::size]
        y_train = f['y_train'][rank::size]
        x_test = f['x_test'][rank::size]
        y_test = f['y_test'][rank::size]
        x_train, x_test = x_train / 255.0, x_test / 255.0 # Normalize RGB values to [0, 1]
        return (x_train, y_train), (x_test, y_test)


def get_model():
    model = tf.keras.models.Sequential([
        tf.keras.layers.Flatten(input_shape=(28, 28)),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation='softmax')
    ])
    return model


def deserialize(model_bytes):
    import horovod.tensorflow.keras as hvd
    import h5py
    import io
    bio = io.BytesIO(model_bytes)
    with h5py.File(bio, 'a') as f:
        return hvd.load_model(f)


def predict_number(model, x_test, image_index):
    pred = model.predict(x_test[image_index:image_index + 1])
    print(f"Model prediction for index {image_index}: {pred.argmax()}")


def train_hvd(learning_rate, batch_size, epochs):
    # 1 - Initialize Horovod
    hvd.init()

    # 2 - Pin GPUs
    gpus = tf.config.experimental.list_physical_devices('GPU')
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
    if gpus:
        tf.config.experimental.set_visible_devices(gpus[hvd.local_rank()], 'GPU')
    
    (x_train, y_train), (x_test, y_test) = get_dataset(hvd.rank(), hvd.size())
    model = get_model()

    initial_lr=learning_rate * hvd.size()
    # 3 - Wrap optimizer
    optimizer = hvd.DistributedOptimizer(
        # 4- Scale learning rate
        tf.optimizers.Adam(lr=initial_lr)
    )

    model.compile(optimizer=optimizer,
                  loss='sparse_categorical_crossentropy',
                  experimental_run_tf_function=False,
                  metrics=['accuracy'])

    callbacks = [
        # 5 - Broadcast initial variables
        hvd.callbacks.BroadcastGlobalVariablesCallback(0),
        hvd.callbacks.LearningRateWarmupCallback(warmup_epochs=3, verbose=1, initial_lr=initial_lr),
    ]

    # 6 - Save checkpoints
    ckpt_dir = tempfile.mkdtemp()
    ckpt_file = os.path.join(ckpt_dir, 'checkpoint.h5')
    if hvd.rank() == 0:
        callbacks.append(
            tf.keras.callbacks.ModelCheckpoint(ckpt_file, monitor='accuracy', mode='max',
                                               save_best_only=True))

    history = model.fit(x_train, y_train,
                        batch_size=batch_size,
                        callbacks=callbacks,
                        epochs=epochs,
                        verbose=2,
                        validation_data=(x_test, y_test))

    if hvd.rank() == 0:
        with open(ckpt_file, 'rb') as f:
            return history.history, f.read()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Horovod-on-Spark MNIST Training Job")

    parser.add_argument(
        "--learning_rate",
        type=int,
        default=0.001,
        metavar="N",
        help="Learning rate (default: 0.001)",
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=64,
        metavar="N",
        help="Batch size for training (default: 64)",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=5,
        metavar="N",
        help="Number of epochs to train (default: 5)",
    )

    args, _ = parser.parse_known_args()
    spark = SparkSession.builder.appName("HorovodOnSpark").getOrCreate()

    image_index = 100
    (x_train, y_train), (x_test, y_test) = get_dataset()
    
    print(f"Expected prediction for index {image_index}: {y_test[image_index]}")
    
    # Train model with Horovod on Spark
    model_bytes = horovod.spark.run(train_hvd, args=(args.learning_rate,
                                                     args.batch_size,
                                                     args.epochs))[0][1]

    model = deserialize(model_bytes)
    model.evaluate(x_test, y_test, verbose=2)

    predict_number(model, x_test, image_index)
    spark.stop()
```

    Writing mnist.py


[Several things](https://github.com/horovod/horovod#concepts) are worth highlighting:

1. Horovod is initialized with `hvd.init()`.
1. Each GPU is pinned to a single process to avoid resource contention.
1. The model's optimizer must be wrapped in `hvd.DistributedOptimizer`, which delegates gradient computations to the original optimizers (here: Adam) but applies averaged gradients.
1. The learning rate must be scaled by the number of workers, because the effective batch size is scaled by the number of workers, which an increased learning rate can compensate for in turn.
1. Initial variables must be broadcast from rank 0 to all other processes
1. Checkpoints must only be created on worker 0 to prevent any corruption.

Horovod is designed to scale on servers with multiple GPUs.

Horovod relies on [MPI](https://github.com/horovod/horovod/blob/master/docs/concepts.rst) (Message Passing Interface) and therefore recycles some of its terminology:
- The number of processes is the **size**.
- The unique process identifier, which runs from `0` to `size - 1`.
- The local rank is the unique process identifier within each server.


```python
%env HOROVOD_JOB=$TRAINER_FILE
```

    env: HOROVOD_JOB=mnist.py


To verify the training job, first run it on Spark in local mode:


```python
%env PYSPARK_DRIVER_PYTHON=/opt/conda/bin/python
```

    env: PYSPARK_DRIVER_PYTHON=/opt/conda/bin/python



```sh
%%sh
"${SPARK_HOME}/bin/spark-submit" --master "local[1]" "${HOROVOD_JOB}" --epochs=1
```

    Expected prediction for index 100: 6
    Running 1 processes (inferred from spark.default.parallelism)...
    20/06/18 16:09:21 INFO Executor: Running task 0.0 in stage 0.0 (TID 0)
    ...
    [1,0]<stdout>:938/938 - 2s - loss: 0.3325 - accuracy: 0.9046 - val_loss: 0.1697 - val_accuracy: 0.9500 - lr: 0.0010
    313/313 - 0s - loss: 0.1697 - accuracy: 0.9500
    Model prediction for index 100: 6
    ...
    20/06/18 16:09:30 INFO SparkContext: Successfully stopped SparkContext


This trains the model in the notebook, but does not distribute the procedure.
To that end, build-and-push a container image that contains the code and input dataset.

The data set is included, so the tutorial works on air-gapped (i.e. private/offline) clusters.
MNIST data sets are typically downloaded on the fly, which would fail in such scenarios.
In most realistic cases, the data sets would be available to the cluster as a volume.

## How to Create a Docker Image with Kaptain SDK
Kaptain SDK allows you to build, push, and run containerized ML models without leaving Jupyter.
To build and push Docker images from within a notebook, please check out the [Build Docker Images with Kaptain SDK](../../sdk/image-builder).
All you need is the `TRAINER_FILE` and access to a container registry.

## How to Create a Docker Image Manually
If you are comfortable with Docker (or prefer to use it as a part of your CI/CD setup), you can create a Dockerfile as follows.
You do have to download the `TRAINER_FILE` contents and the `datasets` directory to your local machine.
The Kubernetes cluster does not have a Docker daemon available to build your image, so you must do it locally.
It uses [containerd](https://containerd.io/) to run workloads (only) instead.

The Dockerfile looks as follows:

```
FROM mesosphere/kubeflow:2.1.0-rc.0-spark-3.3.0-horovod-0.24.2-tensorflow-2.8.0-gpu
ADD mnist.py /
ADD datasets /datasets

WORKDIR /
```

If GPU support is not needed, you can leave off the `-gpu` suffix from the image.
`mnist.py` is the trainer code you have to download to your local machine.

Then it is easy to push images to your container registry:

```bash
docker build -t <docker_image_name_with_tag> .
docker push <docker_image_name_with_tag>
```

The image is available as `mesosphere/kubeflow:2.1.0-rc.0-mnist-spark-3.3.0-horovod-0.24.2-tensorflow-2.8.0-gpu` in case you want to skip it for now.

## How to Create a Distributed `SparkApplication`
The [KUDO Spark Operator](https://github.com/kudobuilder/operators/tree/master/repository/spark/docs) manages Spark applications in a similar way as the [PyTorch](../pytorch) or [TensorFlow](../tensorflow) operators manage `PyTorchJob`s and `TFJob`s, respectively. 
It exposes a resource called `SparkApplication` that you will use to train the model on multiple nodes with Horovod.

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<b>Kubernetes Nomenclature</b><br>
    <code>SparkApplication</code> is a <a href="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/">custom resource (definition) (CRD)</a> provided by the KUDO <a href="https://github.com/mesosphere/kudo-spark-operator">Spark operator</a>.
    <a href="https://kubernetes.io/docs/concepts/extend-kubernetes/operator/">Operators</a> extend Kubernetes by capturing domain-specific knowledge on how to deploy and run an application or service, how to deal with failures, and so on.
    The Spark operator controller manages the lifecycle of a <code>SparkApplication</code>.
    <a href="https://kudo.dev">KUDO</a> is a toolkit for creating custom Kubernetes operators using YAML instead of writing Go code.
</div>


```python
# set this to 0 when running on CPU.
GPUS = 1
IMAGE = "mesosphere/kubeflow:2.1.0-rc.0-mnist-spark-3.3.0-horovod-0.24.2-tensorflow-2.8.0-gpu"
```


```python
%env GPUS $GPUS
%env IMAGE $IMAGE
```

The specification for a distributed `SparkApplication` is defined using YAML:


```bash
%%bash
cat <<END > $KUBERNETES_FILE
apiVersion: "sparkoperator.k8s.io/v1beta2"
kind: SparkApplication
metadata:
  name: horovod-mnist
spec:
  type: Python
  mode: cluster
  pythonVersion: "3"
  image: ${IMAGE}
  imagePullPolicy: Always  
  mainApplicationFile: "local:///mnist.py"
  sparkVersion: "3.3.0"
  restartPolicy:
    type: OnFailure
    onFailureRetries: 3
    onFailureRetryInterval: 10
    onSubmissionFailureRetries: 5
    onSubmissionFailureRetryInterval: 20
  arguments:
    - --epochs
    - "5"
  driver:
    env:
    - name: PYTHONUNBUFFERED
      value: "1"
    cores: 1
    memory: "2G"
    gpu:
      name: "nvidia.com/gpu"
      quantity: ${GPUS}
    labels:
      version: 3.3.0
      metrics-exposed: "true"  
    annotations:
      sidecar.istio.io/inject: "false"
    serviceAccount: default-editor
  executor:
    cores: 1
    instances: 2
    memory: "2G"
    gpu:
      name: "nvidia.com/gpu"
      quantity: ${GPUS}
    labels:
      version: 3.3.0
      metrics-exposed: "true"  
    annotations:
      sidecar.istio.io/inject: "false"
  monitoring:
    exposeDriverMetrics: true
    exposeExecutorMetrics: true
    prometheus:
      jmxExporterJar: "/prometheus/jmx_prometheus_javaagent-0.11.0.jar"
      port: 8090
END
```

    Writing sparkapp-mnist.yaml


The operator's user guide explains [how to configure the application](https://github.com/mesosphere/spark-on-k8s-operator/blob/master/docs/user-guide.md).

Please note that in `spec.mainApplicationFile` the file name `/mnist.py` is hard coded and it must match the file in the docker image.

The annotation `sidecar.istio.io/inject: "false"` disables Istio on the `SparkApplication` level.
This is not needed if Istio is disabled at the namespace level by your administrator.

You can either execute the following commands on your local machine with `kubectl` or directly from the notebook.
If you do run these locally, you cannot rely on cell magic, so you have to manually copy-paste the variables' values wherever you see `$SOME_VARIABLE`.
If you execute the following commands on your own machine (and not inside the notebook), you obviously do not need the cell magic `%%` either.
In that case, you have to set the user namespace for all subsequent commands:

```
kubectl config set-context --current --namespace=<insert-namespace>
```

Please change the namespace to whatever has been set up by your administrator.

Deploy the distributed training job:


```python
%%capture hvd_output --no-stderr
%%sh
kubectl create -f "${KUBERNETES_FILE}"
```


```python
%env HVD_JOB {get_resource(hvd_output)}
```

Check the pods are being created according to the specification:


```sh
%%sh
kubectl get pods -l sparkoperator.k8s.io/app-name=horovod-mnist
```

    NAME                   READY   STATUS      RESTARTS   AGE
    horovod-mnist-driver   0/1     Completed   0          64s


Wait for the `SparkApplication` to complete:


```python
import subprocess, time
for attempt in range(1, 60):
  state = subprocess.check_output(
      'kubectl get $HVD_JOB -o jsonpath={.status.applicationState.state}', shell=True).decode().strip()
  print(f'job state at attempt {attempt}: {state}')
  if state == 'FAILED' or state == 'COMPLETED':
    break
  time.sleep(10)
```

See the status of the `horovod-mnist` `SparkApplication`:


```sh
%%sh
kubectl describe ${HVD_JOB}
```

    Name:         horovod-mnist
    ...
    API Version:  sparkoperator.k8s.io/v1beta2
    Kind:         SparkApplication
    ...
    Events:
      Type    Reason                     Age   From            Message
      ----    ------                     ----  ----            -------
      Normal  SparkApplicationAdded      75s   spark-operator  SparkApplication horovod-mnist was added, enqueuing it for submission
      Normal  SparkApplicationSubmitted  72s   spark-operator  SparkApplication horovod-mnist was submitted successfully
      Normal  SparkDriverRunning         70s   spark-operator  Driver horovod-mnist-driver is running
      Normal  SparkExecutorPending       65s   spark-operator  Executor horovod-mnist-1592496574728-exec-1 is pending
      Normal  SparkExecutorPending       64s   spark-operator  Executor horovod-mnist-1592496574728-exec-2 is pending
      Normal  SparkExecutorPending       64s   spark-operator  Executor horovod-mnist-1592496574728-exec-3 is pending
      Normal  SparkExecutorPending       64s   spark-operator  Executor horovod-mnist-1592496574728-exec-4 is pending
      Normal  SparkExecutorPending       64s   spark-operator  Executor horovod-mnist-1592496574728-exec-5 is pending
      Normal  SparkExecutorRunning       63s   spark-operator  Executor horovod-mnist-1592496574728-exec-1 is running
      Normal  SparkExecutorRunning       62s   spark-operator  Executor horovod-mnist-1592496574728-exec-3 is running
      Normal  SparkExecutorRunning       62s   spark-operator  Executor horovod-mnist-1592496574728-exec-2 is running
      Normal  SparkExecutorRunning       61s   spark-operator  Executor horovod-mnist-1592496574728-exec-4 is running
      Normal  SparkExecutorRunning       61s   spark-operator  Executor horovod-mnist-1592496574728-exec-5 is running
      Normal  SparkDriverCompleted       23s   spark-operator  Driver horovod-mnist-driver completed
      Normal  SparkApplicationCompleted  23s   spark-operator  SparkApplication horovod-mnist completed


Check the model prediction (as before) by looking at the logs of the driver:


```sh
%%sh
kubectl logs horovod-mnist-driver | grep 'Model prediction'
```

    Model prediction for index 100: 6



```sh
%%sh
kubectl delete ${HVD_JOB}
```

    sparkapplication.sparkoperator.k8s.io "horovod-mnist" deleted


This tutorial includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs: [https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z](https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z) and [https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z](https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z)

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
