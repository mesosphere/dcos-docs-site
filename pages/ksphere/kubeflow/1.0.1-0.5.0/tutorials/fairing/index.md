---
layout: layout.pug
navigationTitle: Kubeflow Fairing
title: Kubeflow Fairing
menuWeight: 5
excerpt: Tutorial for Kubeflow Fairing
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.mesosphere.io/kudo-kubeflow/d2iq-tutorials-1.0.1-0.5.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run
<code>wget -O - https://downloads.mesosphere.io/kudo-kubeflow/d2iq-tutorials-1.0.1-0.5.0.tar.gz | tar xz</code>
from a Jupyter Notebook Terminal running in your KUDO for Kubeflow installation.
</p>
<p class="message--note"><strong>NOTE: </strong>Please note that these notebook tutorials have been built for and
tested on D2iQ's KUDO for Kubeflow. Without the requisite Kubernetes operators and custom Docker images, these notebook
will likely not work.</p>


<p class="message--warning"><strong>WARNING: </strong>Kubeflow Fairing does not support docker registries using
a self-signed TLS certificate, certificate chaining nor insecure (plaintext HTTP) registries.</p>

# Kubeflow Fairing: Build Docker Images from within Jupyter Notebooks

## Introduction
Although you can build Docker images by downloading files to your local machine and subsequently pushing the images to a container registry, it is much faster to do so without leaving Jupyter!
[Kubeflow Fairing](https://www.kubeflow.org/docs/fairing/fairing-overview/) makes that possible.

### What You'll Learn
In this notebook we'll go through the steps involved in building a Docker image from a base image (e.g. TensorFlow or PyTorch) and a custom trainer file that defines your machine learning model.
This image can be used for distributed training or [hyperparameter tuning](../katib).
You can use the model code you generated with `%%writefile` in [MNIST with TensorFlow tutorial](../training/tensorflow) or [MNIST with PyTorch tutorial](../training/pytorch) or a file of your own choosing.

The Docker image builder process stores (temporary) files in MinIO.
[MinIO](https://min.io/), an open-source S3-compliant object storage tool, is already included with your Kubeflow installation.

### What You'll Need

- An executable Python file (e.g. an `mnist.py` trainer);
- A container registry to which you have push access.

Please note that this notebook is interactive!

## Prerequisites
Kubeflow Fairing must be installed, so let's check that it is:


```python
! pip show kubeflow-fairing
```

### Prepare the training code and datasets
The examples in this tutorial require a trainer code file `mnist.py` and a dataset to be present in the current folder.
The code and datasets are already available in [MNIST with TensorFlow](../training/tensorflow)
or [MNIST with PyTorch](../training/pytorch) tutorials and can be reused here. Run one of the following shortcuts to copy the required files.

##### TensorFlow


```python
! jq -j '.cells[] | select(.metadata.tags!= null) | select (.metadata.tags[] | contains("trainer_code")) | .source | .[]' ../training/tensorflow/MNIST\ with\ TensorFlow.ipynb | sed '1d' > mnist.py
! cp -R ../training/tensorflow/datasets .
```

##### PyTorch


```python
! jq -j '.cells[] | select(.metadata.tags!= null) | select (.metadata.tags[] | contains("trainer_code")) | .source | .[]' ../training/pytorch/MNIST\ with\ PyTorch.ipynb | sed '1d' > mnist.py
! cp -R ../training/pytorch/datasets .
```

We're ready to go!

## How to Create a Docker Credentials File and Kubernetes Secret

We shall also require `getpass`, so that you can provide your password interactively without it being immediately visible.
It's a standard Python library, so there is no need to install it.
A simple `import` will suffice.

<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
    We do not recommend you store passwords directly in notebooks.
    Ideally, credentials are stored safely inside secrets management solutions or provided with service accounts.
    This notebook should be used for demonstration purposes only!
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

With these details, we can base-64-encode the username and password and create a Kubernetes configmap with a name expected by the builder's context source.


```python
%%capture creds --no-stderr
! echo -n "$docker_user:$docker_password" | base64
```


```python
docker_credentials = creds.stdout.rstrip()
```


```python
js = {"auths": {"https://index.docker.io/v1/": {"auth": docker_credentials}}}

%store json.dumps(js) >config.json
```


```python
! kubectl create configmap docker-config --from-file=config.json
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
If you have your own container registry, please prepend it in `REGISTRY`.
The `IMAGE_NAME` contains the name of the image that will be built and pushed to the `REGISTRY`.


```python
REGISTRY = "mesosphere"
IMAGE_NAME = "kubeflow"
```

If your goal is to run a distributed training job _immediately_ from a notebook, we recommend the Option 1.
With it, you build (and push) the image as a part of a deployment (e.g. distributed training job).

If your goal is to provide a Docker image that includes the code for distributed training or hyperparameter tuning, Option 2 is more appropriate.
It does not run the job (with pre-defined arguments) but merely pushes the image to the container registry.

Both options automatically push the image to the registry specified.

<div class="alert alert-block alert-warning" id="WARN">
    The Kubeflow Fairing API does <em>not</em> set the Docker image's entrypoint or command.
    You can check that neither the <code>ENTRYPOINT</code> nor the <code>CMD</code> is not set with <code>docker inspect</code> on your local machine.
    This means that you have to <a href="https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell">add the command</a> you want to run to your Kubernetes resource specification (YAML)!
    Without this modification to the YAML your pods will fail to run their containerized workloads.
    You can do this by adding the key <code>command</code> above the <code>args</code> specification:
<code>
containers:
  - name: <name>
    image: <docker-image-built-with-kubeflow-fairing>
    <b>command:
      - python
      - -u
      - mnist.py</b>
    args:
      - --epochs
      - "7"
    ...
</code>        
</div>

### Option 1: Build-Push-Run
Multiple input files (e.g. a trainer and utilities) can be provided in the `input_files` list.
There can be only one `executable` file.
With the `command` we must include all the mandatory arguments (i.e. `epochs`):


```python
from kubeflow import fairing
import glob

fairing.config.set_preprocessor(
    "python",
    command=["python", "-u", "mnist.py", "--epochs=3"],
    input_files=["mnist.py"] + glob.glob("datasets/**", recursive=True),
    path_prefix="/",
    executable="mnist.py",
)
```

#### TensorFlow
If your `mnist.py` file is based on TensorFlow, you must specify the appropriate base image for TensorFlow.
In case you want to run the model on CPUs only, you ought to drop the `-gpu` suffix from the base image name.
The primary configuration options are the chief and worker counts, but feel free to peruse all available parameters [here](https://github.com/kubeflow/fairing/blob/master/kubeflow/fairing/deployers/tfjob/tfjob.py).

If your model code is based on PyTorch, please skip this section!


```python
from kubeflow.fairing.kubernetes import utils as k8s_utils

BASE_IMAGE = "mesosphere/kubeflow:1.0.1-0.5.0-tensorflow-2.2.0-gpu"

fairing.config.set_builder(
    name="cluster",
    registry=REGISTRY,
    base_image=BASE_IMAGE,
    image_name=IMAGE_NAME,
    context_source=minio_context_source,
)

fairing.config.set_deployer(
    name="tfjob",
    worker_count=2,
    chief_count=1,
    # remove this parameter if the cluster doesn't have GPUs
    pod_spec_mutators=[k8s_utils.get_resource_mutator(gpu=1)],
)

fairing.config.run()
```

#### PyTorch
For a PyTorch-based `mnist.py` model, you must specify the appropriate base image for PyTorch.
In case you want to run the model on CPUs and not GPUs, you simplify leave off the `-gpu` suffix from the base image's name.
The main configuration options are the master and worker counts, but you can see all options [here](https://github.com/kubeflow/fairing/blob/master/kubeflow/fairing/deployers/pytorchjob/pytorchjob.py).


```python
from kubeflow.fairing.kubernetes import utils as k8s_utils

BASE_IMAGE = "mesosphere/kubeflow:1.0.1-0.5.0-pytorch-1.5.0-gpu"

fairing.config.set_builder(
    name="cluster",
    registry=REGISTRY,
    base_image=BASE_IMAGE,
    image_name=IMAGE_NAME,
    context_source=minio_context_source,
)

fairing.config.set_deployer(
            name="pytorchjob", 
            worker_count=2,
            master_count=1,
            # remove this parameter if the cluster doesn't have GPUs
            pod_spec_mutators=[k8s_utils.get_resource_mutator(gpu=1)],
)

fairing.config.run()
```

### Option 2: Build-and-Push
You can 'just' build a Docker image, that is, without running it by plugging it into a Kubeflow Fairing workflow, with the following snippet.
Please choose the appropriate `BASE_IMAGE` based on whether your `mnist.py` file is a TensorFlow or PyTorch model.


```python
from kubeflow.fairing.builders import cluster
from kubeflow.fairing.preprocessors import base as base_preprocessor
import glob

# Choose which base image your executable mnist.py file requires
BASE_IMAGE = "mesosphere/kubeflow:1.0.1-0.5.0-tensorflow-2.2.0-gpu"
# BASE_IMAGE = "mesosphere/kubeflow:1.0.1-0.5.0-pytorch-1.5.0-gpu"

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
Moreover, we also leave out the `command` in the preprocessor since Kubeflow Fairing does not set the entrypoint or executable command in the Docker image anyway.
We have to manually do that in the <a href="#WARN">specification</a>.
