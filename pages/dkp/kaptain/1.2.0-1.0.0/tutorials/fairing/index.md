---
layout: layout.pug
navigationTitle: Kubeflow Fairing
title: Kubeflow Fairing
menuWeight: 18
excerpt: Tutorial for Kubeflow Fairing
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kudo-kubeflow/d2iq-tutorials-1.2.0-1.0.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run
<code>curl -L https://downloads.d2iq.com/kudo-kubeflow/d2iq-tutorials-1.2.0-1.0.0.tar.gz | tar xz</code>
from a Jupyter Notebook Terminal running in your Kaptain installation.
</p>
<p class="message--note"><strong>NOTE: </strong>Please note that these notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebook
will likely not work.</p>


<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>Kubeflow Fairing does not support docker registries using
a self-signed TLS certificate, certificate chaining nor insecure (plaintext HTTP) registries.</p>
</div>

# Kubeflow Fairing: Build Docker Images from within Jupyter Notebooks

## Introduction
Although you can build Docker images by downloading files to your local machine and subsequently pushing the images to a container registry, it is much faster to do so without leaving Jupyter!
[Kubeflow Fairing](https://www.kubeflow.org/docs/fairing/fairing-overview/) makes that possible.

### What You Will Learn
In this notebook you will go through the steps involved in building a Docker image from a base image (e.g. TensorFlow or PyTorch) and a custom trainer file that defines your machine learning model.
This image can be used for distributed training or [hyperparameter tuning](../katib).
You can use the model code you generated with `%%writefile` in [MNIST with TensorFlow tutorial](../training/tensorflow) or [MNIST with PyTorch tutorial](../training/pytorch) or a file of your own choosing.

The Docker image builder process stores (temporary) files in MinIO.
[MinIO](https://min.io/), an open-source S3-compliant object storage tool, is already included with your Kubeflow installation.

### What You Need

- An executable Python file (e.g. an `mnist.py` trainer - you can extract it from another tutorial in case you do not have one handy);
- A container registry to which you have push access.

Please note that this notebook is interactive!

## Prerequisites
Kubeflow Fairing must be installed:


```bash
%%sh
pip show kubeflow-fairing
```

### Prepare the training code and datasets
The examples in this tutorial require a trainer code file `mnist.py` and a dataset to be present in the current folder.
The code and datasets are already available in [MNIST with TensorFlow](../training/tensorflow)
or [MNIST with PyTorch](../training/pytorch) tutorials and can be reused here. Run one of the following shortcuts to copy the required files.

##### TensorFlow


```bash
%%sh
set -o errexit
jq -j '.cells[] | select (.metadata.tags[]? | contains("trainer_code")) | .source[]' tensorflow-tutorial/MNIST\ with\ TensorFlow.ipynb | sed '1d' > mnist.py
cp -R tensorflow-tutorial/datasets .
```

##### PyTorch


```bash
%%sh
set -o errexit
jq -j '.cells[] | select (.metadata.tags[]? | contains("trainer_code")) | .source[]' pytorch-tutorial/MNIST\ with\ PyTorch.ipynb | sed '1d' > mnist.py
cp -R pytorch-tutorial/datasets .
```

## How to Create a Docker Credentials File and Kubernetes Secret

For the tutorial you will need `getpass` to provide a password interactively without it being immediately visible.
It is a standard Python library, so there is no need to install it.
A simple `import` will suffice.

<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>Please do not store passwords directly in notebooks.
    Ideally, credentials are stored safely inside secrets management solutions or provided with service accounts.
    This notebook should be used for demonstration purposes only!</p>
</div>


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
from base64 import b64encode
docker_credentials = b64encode(f"{docker_user}:{docker_password}".encode()).decode()
js = {"auths": {"https://index.docker.io/v1/": {"auth": docker_credentials}}}

%store json.dumps(js) >config.json
```


```bash
%%sh
kubectl create configmap docker-config --from-file=config.json
```

### How to Set up MinIO


```python
from kubeflow.fairing import constants
from kubeflow.fairing.builders.cluster.minio_context import MinioContextSource

s3_endpoint = "minio-service.kubeflow:9000"
s3_endpoint_url = f"http://{s3_endpoint}"
s3_secret_id = "minio"
s3_secret_key = "minio123"
s3_region = "us-east-1"

# The default Kaniko version (0.14.0) does not work with Kubeflow Fairing
constants.constants.KANIKO_IMAGE = "gcr.io/kaniko-project/executor:v0.19.0"

minio_context_source = MinioContextSource(
    endpoint_url=s3_endpoint_url,
    minio_secret=s3_secret_id,
    minio_secret_key=s3_secret_key,
    region_name=s3_region,
)
```

## How to Build a Docker Image
Let us set some constants that will customize the code for your environment.

If you have your own container registry, please prepend it in `REGISTRY`.
The `IMAGE_NAME` contains the name of the image that will be built and pushed to the `REGISTRY`.


```python
REGISTRY = "mesosphere"
IMAGE_NAME = "kubeflow"
EPOCHS = "3"
```

Depending on whether you want the training code to run on a node with a GPU, set `USE_GPU` to `True` or `False`.


```python
USE_GPU = True
```

This, among other things determines where to run the training pods:


```python
if USE_GPU:
    from kubeflow.fairing.kubernetes import utils as k8s_utils
    POD_SPEC_MUTATORS = [k8s_utils.get_resource_mutator(gpu=1)]
else:
    POD_SPEC_MUTATORS = None
```

Next, pick the base image depending on whether your `mnist.py` file is based on TensorFlow or PyTorch.
If using GPUs, you need to use the `-gpu` variant that contains the necessary libraries.


```python
BASE_IMAGE = "mesosphere/kubeflow:1.2.0-1.0.0-tensorflow-2.4.0" + ("-gpu" if USE_GPU else "")
```


```python
BASE_IMAGE = "mesosphere/kubeflow:1.2.0-1.0.0-pytorch-1.7.1" + ("-gpu" if USE_GPU else "")
```

This tutorial describes two options of using Kubeflow Fairing.
- If your goal is to run a distributed training job _immediately_ from a notebook, choose Option 1.
  With it, you build (and push) the image as a part of a deployment (e.g. distributed training job).
- If your goal is to provide a Docker image that includes the code for distributed training or hyperparameter tuning, Option 2 is more appropriate.
  It does not run the job (with pre-defined arguments) but merely pushes the image to the container registry.

Both options automatically push the image to the registry specified.

<div id="WARN" class="alert alert-block alert-warning">
<p class="message--warning"><strong>WARNING: </strong>The Kubeflow Fairing API does <em>not</em> set the Docker image's entrypoint or command.
    You can check that neither the <code>ENTRYPOINT</code> nor the <code>CMD</code> is not set with <code>docker inspect</code> on your local machine.
    This means that you have to <a href="https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">add the command</a> you want to run to your Kubernetes resource specification (YAML)!
    Without this modification to the YAML your pods will fail to run their containerized workloads.
    You can do this by adding the key <code>command</code> above the <code>args</code> specification:
<code><pre>
containers:
  - name: &lt;name&gt;
    image: &lt;docker-image-built-with-kubeflow-fairing&gt;
    <b>command:
      - python
      - -u
      - mnist.py</b>
    args:
      - --epochs
      - "7"
    ...
</pre></code>
</p>
</div>

### Option 1: Build-Push-Run
Multiple input files (e.g. a trainer and utilities) can be provided in the `input_files` list.
There can be only one `executable` file.
Within `command` you must include all the mandatory arguments (i.e. `epochs`):


```python
from kubeflow import fairing
import glob

fairing.config.set_preprocessor(
    "python",
    command=["python", "-u", "mnist.py", "--epochs", str(EPOCHS)],
    input_files=["mnist.py"] + glob.glob("datasets/**", recursive=True),
    path_prefix="/",
    executable="mnist.py",
)
fairing.config.set_builder(
    name="cluster",
    registry=REGISTRY,
    base_image=BASE_IMAGE,
    image_name=IMAGE_NAME,
    context_source=minio_context_source,
)
```

#### TensorFlow
The primary configuration options are the chief and worker counts, but feel free to peruse all available parameters of [the `tfjob` deployer](https://github.com/kubeflow/fairing/blob/master/kubeflow/fairing/deployers/tfjob/tfjob.py).

If your model code is based on PyTorch, please skip this section!


```python
fairing.config.set_deployer(
    name="tfjob",
    worker_count=2,
    chief_count=1,
    pod_spec_mutators=POD_SPEC_MUTATORS,
)

fairing.config.run()
```

#### PyTorch
The main configuration options are the master and worker counts, but you can see all options of [the `pytorchjob` deployer](https://github.com/kubeflow/fairing/blob/master/kubeflow/fairing/deployers/pytorchjob/pytorchjob.py).

If your model code is based on TensorFlow, please skip this section!


```python
fairing.config.set_deployer(
    name="pytorchjob",
    worker_count=2,
    master_count=1,
    pod_spec_mutators=POD_SPEC_MUTATORS,
)

fairing.config.run()
```

### Option 2: Build-and-Push
You can 'just' build a Docker image, that is, without running it by plugging it into a Kubeflow Fairing workflow, with the following snippet.


```python
from kubeflow.fairing.builders import cluster
from kubeflow.fairing.preprocessors import base as base_preprocessor
import glob

preprocessor = base_preprocessor.BasePreProcessor(
    input_files=["mnist.py"] + glob.glob("datasets/**", recursive=True), path_prefix="/", executable="mnist.py"
)

cluster_builder = cluster.cluster.ClusterBuilder(
    registry=REGISTRY,
    base_image=BASE_IMAGE,
    preprocessor=preprocessor,
    image_name=IMAGE_NAME,
    context_source=minio_context_source,
)

cluster_builder.build()
image_tag = cluster_builder.image_tag
print(f"Published Docker image with tag: {image_tag}")
```

Since the image is not run immediately, there is no need to specify a `deployer`.
That is done with a YAML specification.
Leave out the `command` in the preprocessor, since Kubeflow Fairing does not set the entrypoint or executable command in the Docker image anyway.
You have to manually do that in the <a href="#WARN">specification</a>.
