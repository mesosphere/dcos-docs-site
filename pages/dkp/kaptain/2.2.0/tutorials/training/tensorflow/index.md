---
layout: layout.pug
navigationTitle: MNIST with TensorFlow
title: MNIST with TensorFlow
menuWeight: 13
excerpt: Tutorial for MNIST with TensorFlow
beta: false
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

[//]: # "WARNING: This page is auto-generated from Jupyter notebooks and should not be modified directly."

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.2.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run the following command
from a Jupyter Notebook Terminal running in your Kaptain installation:

```bash
curl -L https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.2.0.tar.gz | tar xz
```

</p>
<p class="message--note"><strong>NOTE: </strong>These notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebooks
will likely not work.</p>


<p class="message--warning"><strong>NOTE: </strong>
    This notebook is for TensorFlow 2 only.
    TensorFlow 1 does not support data auto-sharding.
</p>

# Training MNIST with TensorFlow

## Introduction
Recognizing handwritten digits based on the [MNIST (Modified National Institute of Standards and Technology) data set](http://yann.lecun.com/exdb/mnist/) is the "Hello, World" example of machine learning.
Each (anti-aliased) black-and-white image represents a digit from 0 to 9 and fits in a 28&times;28 pixel bounding box.
The problem of recognizing digits from handwriting is, for instance, important to the postal service when automatically reading zip codes from envelopes.

### What You Will Learn
You will see how to use TensorFlow to build a model with a convolutional layer and a fully connected layer to perform the multi-class classification of images provided.

The example in the notebook includes both training a model in the notebook and running a [distributed](https://www.tensorflow.org/guide/distributed_training) `TFJob` on the cluster, so you can easily scale up your own models.
For the distributed training job, you have to package the complete trainer code in a Docker image.
You will do that using Kaptain SDK, so that you do not have to leave your favorite notebook environment at all!
Instructions for local development are also included, in case you prefer that.

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<b>Kubernetes Nomenclature</b><br>
    <code>TFJob</code> is a <a href="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/">custom resource (definition) (CRD)</a> provided by the <a href="https://www.kubeflow.org/docs/reference/tfjob/v1/tensorflow/">TensorFlow operator</a>.
    <a href="https://kubernetes.io/docs/concepts/extend-kubernetes/operator/">Operators</a> extend Kubernetes by capturing domain-specific knowledge on how to deploy and run an application or service, how to deal with failures, and so on.
    The TensorFlow operator controller manages the lifecycle of a <code>TFJob</code>.
    A distributed TensorFlow job typically consists of the following processes:
    <ul>
        <li style="color: #31708f;">The <b>chief</b> ('master') orchestrates the training and performing supplementary tasks, such as initializing the graph, checkpointing, and, saving logs for TensorBoard, and saving the model. It also manages failures and restarts. If the chief itself fails, the training restarts from the last available checkpoint.</li>
        <li style="color: #31708f;">The <b>workers</b>, as you might expect, do the actual work of training the model. In certain configurations, worker 0 may also act as the chief.</li>
        <li style="color: #31708f;"><b>Parameter servers</b> (ps) provide a distributed data store for the model parameters.</li>
        <li style="color: #31708f;">An <b>Evaluator</b> is used to compute evaluation metrics.</li>
    </ul>
    The TensorFlow operator <a href="https://github.com/kubeflow/training-operator/blob/master/docs/design/tf_job_design_doc.md#controller">controller</a> takes care of the <a href="https://www.tensorflow.org/guide/distributed_training#TF_CONFIG"><code>TF_CONFIG</code></a> environment variable, which TensorFlow requires for distributed training.
</div>

### What You Need
All you need is this notebook.
If you prefer to create your Docker image locally (i.e. outside of the Kubernetes cluster), you must have a [Docker](https://www.docker.com/products/container-runtime) client on your machine and configured to work with your own container registry.
For Kubernetes commands to run outside of the cluster, you need [`kubectl`](https://kubernetes.io/docs/reference/kubectl/kubectl/).

## Prerequisites
Before proceeding, check you are using the correct notebook image, that is, [TensorFlow](https://www.tensorflow.org/api_docs/) is available:


```sh
%%sh
pip list | grep tensorflow
```

To package the trainer in a container image, you need a file (on the cluster) that contains both the code and a file with the resource definition of the job for the Kubernetes cluster:


```python
TRAINER_FILE = "mnist.py"
KUBERNETES_FILE = "tfjob-mnist.yaml"
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
    :raises Exception: if the resource could not be created
    """
    out = captured_io.stdout
    matches = re.search(r"^(.+)\s+created", out)
    if matches is not None:
        return matches.group(1)
    else:
        raise Exception(
            f"Cannot get the resource as its creation failed: {out}. It may already exist."
        )
```

## How to Load and Inspect the Data
Grab the MNIST data set with the aid of `tensorflow_datasets`.


```python
import tensorflow as tf
import tensorflow_datasets as tfds

from matplotlib import pyplot as plt

mnist, info = tfds.load(name="mnist", split="train", data_dir="datasets", download=False, with_info=True)
tfds.show_examples(mnist, info)
```




    tfds.core.DatasetInfo(
        name='mnist',
        version=3.0.0,
        description='The MNIST database of handwritten digits.',
        homepage='http://yann.lecun.com/exdb/mnist/',
        features=FeaturesDict({
            'image': Image(shape=(28, 28, 1), dtype=tf.uint8),
            'label': ClassLabel(shape=(), dtype=tf.int64, num_classes=10),
        }),
        total_num_examples=70000,
        splits={
            'test': 10000,
            'train': 60000,
        },
        supervised_keys=('image', 'label'),
        citation="""@article{lecun2010mnist,
          title={MNIST handwritten digit database},
          author={LeCun, Yann and Cortes, Corinna and Burges, CJ},
          journal={ATT Labs [Online]. Available: http://yann. lecun. com/exdb/mnist},
          volume={2},
          year={2010}
        }""",
        redistribution_info=,
    )



Read off the shape of the input tensors, which shows the images are all 28&times;28 pixels. You do not yet know whether their grayscale values have been scaled to the [0, 1] range or not:


```python
for example in mnist.take(1):
    squeezed = tf.squeeze(example["image"])
    print(tf.math.reduce_min(squeezed), tf.math.reduce_max(squeezed))
```

    tf.Tensor(0, shape=(), dtype=uint8) tf.Tensor(255, shape=(), dtype=uint8)


No, they have not.
This means you have to do this in the training and before serving!


```python
# Clear variables that are no longer needed
del mnist, squeezed
```

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
    Before proceeding, we separate some of the <code>TFJob</code> parameters from the main code.
    The reason we do that is to ensure we can run the notebook in so-called headless mode with <a href="https://papermill.readthedocs.io/en/latest/">Papermill</a> for custom parameters.
    This allows us to test the notebooks end-to-end, automatically.
    If you check the <a href="https://jupyterlab.readthedocs.io/en/stable/user/notebook.html#notebook">cell tag</a> of the next cell, you can see it is tagged as <code>parameters</code>.
    Feel free to ignore it!
</div>


```python
EPOCHS = 15
GPUS = 1
MEMORY = "4G"
```

Make the defined constants available as shell environment variables. They parameterize the `TFJob` manifest below.


```python
%env EPOCHS $EPOCHS
%env GPUS $GPUS
%env MEMORY $MEMORY
```

## How to Train the Model in the Notebook
Since you ultimately want to train the model in a distributed fashion (potentially on GPUs), put all the code in a single cell.
That way you can save the file and include it in a container image:


```python
%%writefile $TRAINER_FILE
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

    parser.add_argument(
        "--log-dir",
        default="/home/kubeflow/tf-logs",
        type=str,
        help="the path of the directory where to save the log files to be parsed by TensorBoard",
    )


    args, _ = parser.parse_known_args()

    # Check if GPUs are availible for CUDA-built image
    if int(os.getenv("GPUS",0)) > 0:
        if len(tf.config.list_physical_devices("GPU")) is 0:
            raise Exception(
                    f"Cannot find GPUs available using image with GPU support. "
                    f"Physical devices: {tf.config.list_physical_devices()}."
                )

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

    log_dir = args.log_dir + "/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    # setting 'profile_batch' to 0 to disable batch profiling.
    tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1, profile_batch=0)

    # You cannot set `steps_per_epoch = None` with MirroredStrategy
    # See: https://github.com/tensorflow/tensorflow/issues/25254
    model.fit(train_datasets_sharded, epochs=args.epochs, steps_per_epoch=args.steps, callbacks=[tensorboard_callback])
    eval_loss, eval_acc = model.evaluate(test_dataset_sharded, verbose=0, steps=args.steps)

    # Log metrics for Katib
    logging.info("loss={:.4f}".format(eval_loss))
    logging.info("accuracy={:.4f}".format(eval_acc))


if __name__ == "__main__":
    main()
```

That saves the file as defined by `TRAINER_FILE` but it does not run it.

The log entries for `Katib` are to re-use the same file for [hyperparameter tuning](../../katib), which is done in a separate notebook.
All you need to know for that is that Katib looks for `key=value` entries in the logs.

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<b>A Note on Activation Functions</b><br>
    A common choice for <a href="https://arxiv.org/abs/1606.02228">activation functions</a> is a ReLU (Rectified Linear Unit).
    It is linear for non-negative values and zero for negative ones.
    The <a href="https://machinelearningmastery.com/rectified-linear-activation-function-for-deep-learning-neural-networks/">main benefits of ReLU</a> as opposed to sigmoidal functions (e.g. logistic or `tanh`) are:
    <ul>
        <li style="color: #31708f;">ReLU and its gradient are very cheap to compute;</li>
        <li style="color: #31708f;">Gradients are less likely to vanish, because for (non-)negative values its gradient is constant and therefore does not saturate, which for deep neural networks can <a href="https://dl.acm.org/doi/10.1145/3065386">accelerate convergence;</a></li>
        <li style="color: #31708f;">ReLU has a regularizing effect, because it promotes <a href="https://www.researchgate.net/publication/215616967_Deep_Sparse_Rectifier_Neural_Networks">sparse representations</a> (i.e. some nodes' weights are zero);</li>
        <li style="color: #31708f;">Empirically it has been found to work well.</li>
    </ul>
    ReLU activation functions can cause neurons to 'die' because a large, negative (learned) bias value causes all inputs to be negative, which in turn leads to a zero output.
    The neuron has thus become incapable of discriminating different input values.
    So-called leaky ReLU activations functions address that issue; these functions are linear but non-zero for negative values, so that their gradients are small but non-zero.
    <a href="https://arxiv.org/abs/1511.07289">ELUs</a>, or exponential linear units, are another solution to the problem of dying neurons.
</div>

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
    <b>A Note on CNNs</b><br>
    While it is not our intention to cover the basics of <a href="https://www.deeplearningbook.org/contents/convnets.html">convolutional neural networks</a> (CNNs), there are a few matters worth mentioning.
    Convolutional layers are spatial feature extractors for images.
    A series of convolutional kernels (of the same dimensions) is applied to the image to obtain different versions of the same base image (i.e. filters).
    These filters extract patterns hierarchically.
    In the first layer, filters typically capture dots, edges, corners, and so on.
    With each additional layer, these patterns become more complex and turn from basic geometric shapes into constituents of objects and entire objects.
    That is why often the number of filters increases with each additional convolutional layer: to extract more complex patterns.<br><br>
    Convolutional layers are often followed by a pooling layer to down-sample the input.
    This aids in lowering the computational burden as you increase the number of filters.
    A max pooling layer simply picks the largest value of pixels in a small (rectangular) neighbourhood of a single channel (e.g. RGB).
    This has the effect of making features <em>locally</em> translation-invariant, which is often desired: whether a feature of interest is on the left or right edge of a pooling window, which is also referred to as a kernel, is largely irrelevant to the problem of image classification.
    Note that this may not always be a desired characteristic and depends on the size of the pooling kernel.
    For instance, the precise location of tissue damage in living organisms or defects on manufactured products may be very significant indeed.
    Pooling kernels are generally chosen to be relatively small compared to the dimensions of the input, which means that local translation invariance is often desired. <br><br>
    Another common component of CNNs is a dropout layer.
    <a href="http://jmlr.org/papers/v15/srivastava14a.html">Dropout</a> provides a mechanism for regularization that has proven successful in many applications.
    It is surprisingly simple: some nodes' weights (and biases) in a specific layer are set to zero <em>at random</em>, that is, arbitrary nodes are removed from the network during the training step.
    This causes the network to not rely on any single node (a.k.a. neuron) for a feature, as each node can be dropped at random.
    The network therefore has to learn redundant representations of features.
    This is important because of what is referred to as <em>internal covariate shift</em> (often mentioned in connection with <a href="http://proceedings.mlr.press/v37/ioffe15.html">batch normalization</a>): the change of distributions of internal nodes' weights due to all other layers, which can cause nodes to stop learning (i.e. updating their weights).
    Thanks to dropout, layers become more robust to changes, although it also means it limits what can be learned (as always with regularization).
    Layers with a high risk of overfitting (e.g. layers with many units and lots of inputs) typically have a higher dropout rate.
    <br><br>
    A nice visual explanation of convolutional layers is available <a href="https://cezannec.github.io/Convolutional_Neural_Networks/">here</a>.
    If you are curious what a CNN "sees" while training, you can have a look <a href="https://poloclub.github.io/cnn-explainer/">here</a>.
</div>

Ensure the code is correct by running it from within the notebook:


```python
%run $TRAINER_FILE --epochs $EPOCHS
```

    Train for 10 steps
    Epoch 1/5
    10/10 [==============================] - 5s 450ms/step - loss: 2.1215 - accuracy: 0.2875
    Epoch 2/5
    10/10 [==============================] - 0s 8ms/step - loss: 1.8495 - accuracy: 0.4172
    Epoch 3/5
    10/10 [==============================] - 0s 7ms/step - loss: 1.3506 - accuracy: 0.5875
    Epoch 4/5
    10/10 [==============================] - 0s 7ms/step - loss: 0.8821 - accuracy: 0.6969
    Epoch 5/5
    10/10 [==============================] - 0s 7ms/step - loss: 0.4770 - accuracy: 0.8422


    INFO:root:loss=0.4222
    INFO:root:accuracy=0.8769


This trains the model in the notebook, but does not distribute it across nodes (a.k.a. pods) in the cluster.
To that end, first create a Docker image with the code, push it to a registry (e.g. [Docker Hub](https://hub.docker.com/), [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/), [ECR](https://aws.amazon.com/ecr/), [GCR](https://cloud.google.com/container-registry/)), and then define the Kubernetes resource that uses the image.

## How to Create a Docker Image with Kaptain SDK
Kaptain SDK allows you to build, push, and run containerized ML models without leaving Jupyter.
To build and push Docker images from within a notebook, please check out the [Build Docker Images with Kaptain SDK](../../sdk/image-builder).

All you need is the `TRAINER_FILE` and access to a container registry.

## How to Create a Docker Image Manually
If you are comfortable with Docker (or prefer to use it as a part of your CI/CD setup), you can create a Dockerfile as follows.
You do have to download the `TRAINER_FILE` contents to your local machine.
The Kubernetes cluster does not have a Docker daemon available to build your image, so you must do it locally.
It uses [containerd](https://containerd.io/) to run workloads (only) instead.

The Dockerfile looks as follows:

```
FROM mesosphere/kubeflow:2.2.0-tensorflow-2.9.1-gpu
ADD mnist.py /
ADD datasets /datasets

ENTRYPOINT ["python", "-u", "/mnist.py"]
```

If GPU support is not needed, you can leave off the `-gpu` suffix from the image.
`mnist.py` is the trainer code you have to download to your local machine.

Then it is easy to push images to your container registry:

```bash
docker build -t <docker_image_name_with_tag> .
docker push <docker_image_name_with_tag>
```

The image is available as `mesosphere/kubeflow:2.2.0-mnist-tensorflow-2.9.1-gpu` in case you want to skip it for now.


```python
%env IMAGE mesosphere/kubeflow:2.2.0-mnist-tensorflow-2.9.1-gpu
```

## How to Create a Distributed `TFJob`
For large training jobs, run the trainer in a distributed mode.
Once the notebook server cluster can access the Docker image from the registry, you can launch a distributed TensorFlow job.

The specification for a distributed `TFJob` is defined using YAML:


```bash
%%bash
cat <<END > $KUBERNETES_FILE
apiVersion: "kubeflow.org/v1"
kind: "TFJob"
metadata:
  name: "tfjob-mnist"
spec:
  tfReplicaSpecs:
    Chief:
      replicas: 1
      restartPolicy: OnFailure  # workaround for https://github.com/tensorflow/tensorflow/issues/43838
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: ${IMAGE}
              args:
                - --epochs
                - "${EPOCHS}"
                - --steps
                - "250"
                - --log-dir
                - "/var/log/tf-logs"
              # Comment out these resources when using only CPUs
              resources:
                limits:
                  cpu: 1
                  memory: "${MEMORY}"
                  nvidia.com/gpu: ${GPUS}
              volumeMounts:
                - mountPath: /var/log/tf-logs
                  name: tf-logs
          volumes:
            - name: tf-logs
              persistentVolumeClaim:
                claimName: tf-logs
    Worker:
      replicas: 2
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
            - name: tensorflow
              image: ${IMAGE}
              args:
                - --epochs
                - "${EPOCHS}"
                - --steps
                - "250"
              # Comment out these resources when using only CPUs
              resources:
                limits:
                  cpu: 1
                  memory: "${MEMORY}"
                  nvidia.com/gpu: ${GPUS}
  runPolicy:
    ttlSecondsAfterFinished: 600
END
```

This `spec.tfReplicaSpecs.Worker.replicas` configuration defines two worker pods (`tfjob-mnist-worker-0` and `tfjob-mnist-worker-1`).

Custom training arguments can be passed to the container by means of the `spec.containers.args`.
What is supported is visible in `main()` of `mnist.py`.

The job can run in parallel on CPUs or GPUs, provided these are available in your cluster.
To switch to CPUs or define resource limits, please adjust `spec.containers.resources` as required.
It is best to change the image name listed under the comment of the specification to use an equivalent image in your own container registry, to ensure everything works as expected.

To clean up finished `TFJob` set `spec.runPolicy.ttlSecondsAfterFinished`. It may take extra `ReconcilePeriod` seconds for the cleanup, since reconcile gets called periodically. Defaults to infinite.

You can either execute the following commands on your local machine with `kubectl` or directly from the notebook.
If you do run these locally, you cannot rely on cell magic, so you have to manually copy-paste the variables' values wherever you see `$SOME_VARIABLE`.
If you execute the following commands on your own machine (and not inside the notebook), you obviously do not need the cell magic `%%` lines either.
In that case, you have to set the user namespace for all subsequent commands:

```
kubectl config set-context --current --namespace=<insert-namespace>
```

Please change the namespace to whatever has been set up by your administrator.

### Create PVC
Before deploying the job to the cluster, a PVC needs to be created for storing log data for the application. This step is required for integration with TensorBoard, which is described later in this tutorial.


```python
%%writefile pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: tf-logs
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```


```sh
%%sh
kubectl apply -f pvc.yaml
```

Deploy the distributed training job:


```python
%%capture tf_output --no-stderr
%%sh
kubectl create -f "${KUBERNETES_FILE}"
```


```python
%env TF_JOB {get_resource(tf_output)}
```

To see the job status, use the following command:


```sh
%%sh
kubectl describe ${TF_JOB}
```

You should now be able to see the created pods matching the specified number of workers.


```sh
%%sh
kubectl get pods -l job-name=tfjob-mnist
```

    NAME                   READY   STATUS    RESTARTS   AGE
    tfjob-mnist-worker-0   1/2     Running   0          8s
    tfjob-mnist-worker-1   1/2     Running   0          8s


In case of issues, it may be helpful to see the last ten events within the cluster:


```sh
%%sh
kubectl get events --sort-by='{.metadata.creationTimestamp}'
```

Wait until the chief pod is ready:


```sh
%%sh
for i in $(seq 1 5); do kubectl wait pod/tfjob-mnist-chief-0 --for=condition=Ready --timeout=10m && break || sleep 5; done
```

To stream logs from the chief pod to check the training progress, run the following command:


```sh
%%sh
kubectl logs -f tfjob-mnist-chief-0 -c tensorflow
```

    Train for 250 steps
    Epoch 1/15
    250/250 [==============================] - 12s 47ms/step - loss: 0.5652 - accuracy: 0.8220
    Epoch 2/15
    250/250 [==============================] - 5s 19ms/step - loss: 0.1362 - accuracy: 0.9581
    Epoch 3/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0925 - accuracy: 0.9711
    Epoch 4/15
    250/250 [==============================] - 4s 14ms/step - loss: 0.0808 - accuracy: 0.9749
    Epoch 5/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0599 - accuracy: 0.9817
    Epoch 6/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0518 - accuracy: 0.9826
    Epoch 7/15
    250/250 [==============================] - 4s 14ms/step - loss: 0.0442 - accuracy: 0.9859
    Epoch 8/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0385 - accuracy: 0.9877
    Epoch 9/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0330 - accuracy: 0.9899
    Epoch 10/15
    250/250 [==============================] - 3s 14ms/step - loss: 0.0274 - accuracy: 0.9914
    Epoch 11/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0278 - accuracy: 0.9908
    Epoch 12/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0239 - accuracy: 0.9931
    Epoch 13/15
    250/250 [==============================] - 4s 14ms/step - loss: 0.0216 - accuracy: 0.9933
    Epoch 14/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0204 - accuracy: 0.9938
    Epoch 15/15
    250/250 [==============================] - 3s 13ms/step - loss: 0.0185 - accuracy: 0.9945
    INFO:root:loss=0.0521
    INFO:root:accuracy=0.9838


The setting `spec.runPolicy.ttlSecondsAfterFinished` will result in the cleanup of the created job:


```sh
%%sh
kubectl get tfjobs -w
```

    NAME          STATE     AGE
    tfjob-mnist   Created   0s
    tfjob-mnist   Running   2s
    tfjob-mnist   Running   2s
    tfjob-mnist   Succeeded   70s
    tfjob-mnist   Succeeded   70s
    tfjob-mnist   Succeeded   11m



```sh
%%sh
kubectl get tfjob tfjob-mnist
```

To delete the job manually, run the following command:


```sh
%%sh
kubectl delete ${TF_JOB}
```

## TensorBoard

TensorBoard is a tool for providing the measurements and visualizations needed during the machine learning workflow.
This section shows how to create a TensorBoard instance using the log data from a previously created distributed `TFJob`.
You can create a new TensorBoard instance by clicking the "Tensorboards" menu item page in the central dashboard or by applying the following resource using the PVC created in the previous step of this tutorial:


```python
%%writefile tensorboard.yaml
apiVersion: tensorboard.kubeflow.org/v1alpha1
kind: Tensorboard
metadata:
  name: tensorboard
spec:
  logspath: pvc://tf-logs/
```


```sh
%%sh
kubectl apply -f tensorboard.yaml
```

You can access the TensorBoard instance by navigating to the _Tensorboards_ page from the Central Dashboard and clicking the "Connect" button in the instance list. To learn more about TensorBoard and its features, visit the [official documentation](https://www.tensorflow.org/tensorboard).

This tutorial includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs: [https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z](https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z) and [https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z](https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z)

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
