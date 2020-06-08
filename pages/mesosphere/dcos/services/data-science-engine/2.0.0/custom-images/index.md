---
layout: layout.pug
navigationTitle: Custom Images 
excerpt: Using Custom Images in DC/OS Data Science Engine
title: Custom Images
menuWeight: 7
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

This guide will show you how to build a custom Docker images both for Spark Executor (or Worker) and Notebook (or Spark Driver). You can use these custom-built images with libraries in distributed Spark jobs and/or Jupyter Notebooks.

There are 16 docker images published in total. You could pick any one of them to customize. The choice should be according to DL Framework (TensorFlow v1, TensorFlow v2, Pytorch or MxNet), Processor Type (CPU or GPU), and Execution Type (Spark Executor or Spark Driver/Jupyter Notebook).

Here is the list of published docker images:

```
# CPU based Notebook images for each DL Framework supported
"mesosphere/jupyter-service:cea0efa8e0578237d4247568be579904e0af1da4834ed17f166f06f7ef5be0f2-notebook-mxnet-1.6.0"
"mesosphere/jupyter-service:cd69c9346db5f94c2d819c81159c74c72f94c5bf0f1c87cd273f165c2a0b26bc-notebook-pytorch-1.4.0"
"mesosphere/jupyter-service:0f52d10b27bb92e5596ef08db66331628c5187c23393a098b89872d19b778fd7-notebook-tensorflow-1.15"
"mesosphere/jupyter-service:86cd108e2f1b6b9b8c54bd74a864b37f1a9378b0f19fe92601b06adb3cb07646-notebook-tensorflow-2.1.0"

# GPU based Notebook images for each DL Framework supported
"mesosphere/jupyter-service:dc833812f6d2560a4613c2fea2e7076ff81c0d0c3732c8f8f6434b44b1ebfa0b-notebook-tensorflow-1.15-gpu"
"mesosphere/jupyter-service:dbe826497d85a0d179c7217dfb3ef5e9c9b93c22f805516b3751522199aab19b-notebook-mxnet-1.6.0-gpu"
"mesosphere/jupyter-service:859d5675f9b23702248373c58a489fb5fd2934da9e8ce59aa4fd225b77f80bf5-notebook-pytorch-1.4.0-gpu"
"mesosphere/jupyter-service:fd12f3fda15690bf832093b4db9d069f295a39e93e5072619b007ca71833379a-notebook-tensorflow-2.1.0-gpu"

# CPU based Worker images for each DL Framework supported
"mesosphere/jupyter-service:5f4660355a05c8e10675e4f5064e1d77c7eea1a9e94f4b2bd9522165f38a3fdf-worker-mxnet-1.6.0"
"mesosphere/jupyter-service:0ef22682b45fde63038ebda6f4edce4620db45e72f44365f4c6cdcf4e3ead81b-worker-pytorch-1.4.0"
"mesosphere/jupyter-service:0a104439d74f74ece0ea82650df74b673d0e7c4c03e9aee725e85aa42a6d4b74-worker-tensorflow-1.15"
"mesosphere/jupyter-service:b51ef1a82b207380ae268ae94dfb4e49156cc7ad21d42edf7ee70da26b1cb2c9-worker-tensorflow-2.1.0"

# GPU based Worker images for each DL Framework supported
"mesosphere/jupyter-service:d6b71dbc4fc689cf621ac27588e839b991fa65c39e16e2dddc5753f82836f271-worker-tensorflow-1.15-gpu"
"mesosphere/jupyter-service:c9017c0afeb7f13000d9457c4a5a54e6864a983553604658acca5dde94100094-worker-mxnet-1.6.0-gpu"
"mesosphere/jupyter-service:42ddb7d996734154b63e15d271f953e6e16fca2f8dc31492299e649b4578f769-worker-pytorch-1.4.0-gpu"
"mesosphere/jupyter-service:ea9c3ed28ef2464bb4e6ff2e24fb227eabeca8939d0e58f7b5f228e224cf8dbf-worker-tensorflow-2.1.0-gpu"
```

## Steps to Build

1. **Choose the image to customize**: Suppose you want to make a library available for notebooks as well as workers and you have planned it to run on CPU with Pytorch, then you need to pick these two images to customize.

    ```
    mesosphere/jupyter-service:cd69c9346db5f94c2d819c81159c74c72f94c5bf0f1c87cd273f165c2a0b26bc-notebook-pytorch-1.4.0

    mesosphere/jupyter-service:0ef22682b45fde63038ebda6f4edce4620db45e72f44365f4c6cdcf4e3ead81b-worker-pytorch-1.4.0
    ```

1. **Create Dockerfile**: We will use `conda install -yq spacy` as an example, and will install `spacy` for demo purposes. On your personal laptop or server, run the following commands:

    ```bash
    mkdir notebook          # Create a directory for notebook image
    vi notebook/Dockerfile  # Create a docker file with below mentioned content
    ```

    ```dockerfile
    mesosphere/jupyter-service:cd69c9346db5f94c2d819c81159c74c72f94c5bf0f1c87cd273f165c2a0b26bc-notebook-pytorch-1.4.0

    RUN conda install -yq spacy
    ```

    ```bash
    mkdir worker            # Create a directory for worker image
    vi worker/Dockerfile    # Create a docker file with below mentioned content
    ```

    ```dockerfile
    mesosphere/jupyter-service:0ef22682b45fde63038ebda6f4edce4620db45e72f44365f4c6cdcf4e3ead81b-worker-pytorch-1.4.0

    RUN conda install -yq spacy
    ```

1. **Build and push the Dockerfile**: From the each directory where Dockerfile has been created, run the commands `docker build` and `docker push` as shown below. Assuming that the docker repository name is `docker123` and image names are `spacy-example:notebook` and `spacy-example:worker`, the commands will be:

    ```bash
    cd notebook
    docker build -t docker123/spacy-example:notebook .
    docker push docker123/spacy-example:notebook

    cd worker
    docker build -t docker123/spacy-example:worker .
    docker push docker123/spacy-example:worker
    ```

1. **Run the service with custom image**: You could specify these custom built images in the config of the service as follows:

    ```json
    {
        "advanced": {
            "jupyter_notebook_image": "docker123/spacy-example:notebook",
            "jupyter_worker_image": "docker123/spacy-example:worker"
        }
    }
    ```

## Example Notebook

In the following example, you will use a user-defined function to import a library we installed in a custom image.

Open a `Python Notebook` and put the following in a code cell:

```python
import pyspark
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("Test UDF").getOrCreate()

from pyspark.sql.types import StringType

def test_func(x):
    import spacy
    return x

spark.udf.register("test_func", test_func, StringType())

spark.range(1, 20).registerTempTable("test")

spark.sql("SELECT test_func(id) from test").collect()

spark.stop()
```

Expected output would be:

```text
[Row(test_func(id)='1'),
 Row(test_func(id)='2'),
 Row(test_func(id)='3'),
 Row(test_func(id)='4'),
 Row(test_func(id)='5'),
 Row(test_func(id)='6'),
 Row(test_func(id)='7'),
 Row(test_func(id)='8'),
 Row(test_func(id)='9'),
 Row(test_func(id)='10'),
 Row(test_func(id)='11'),
 Row(test_func(id)='12'),
 Row(test_func(id)='13'),
 Row(test_func(id)='14'),
 Row(test_func(id)='15'),
 Row(test_func(id)='16'),
 Row(test_func(id)='17'),
 Row(test_func(id)='18'),
 Row(test_func(id)='19')]
```
