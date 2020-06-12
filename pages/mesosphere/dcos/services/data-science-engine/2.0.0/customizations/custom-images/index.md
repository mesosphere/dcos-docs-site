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

This guide will show you how to build custom Docker images both for Spark Executor (or Worker) and Notebook (or Spark Driver). You can use these custom-built images with libraries in distributed Spark jobs and/or Jupyter Notebooks.

There are 16 docker images published in total. Customize one or more according to your DL Framework (TensorFlow v1, TensorFlow v2, Pytorch or MxNet), Processor Type (CPU or GPU), and Execution Type (Spark Executor or Spark Driver/Jupyter Notebook).

Here is the list of published docker images:

```text
# CPU based Notebook images for each DL Framework supported
"mesosphere/jupyter-service:727a04a69058c382134533cbdbeaf6e5e9f11918c83bce4eff90bd46de193339-notebook-tensorflow-2.1.0"
"mesosphere/jupyter-service:a699c3aa92cf6ea85b6c02fe43274fa2547e1a6a8fa7a6913e3bf54d20c732bc-notebook-tensorflow-1.15"
"mesosphere/jupyter-service:3cfe8de8c8b04549ebda811bf9461925d15473364dfe5e77dfca34852d9f9046-notebook-pytorch-1.4.0"
"mesosphere/jupyter-service:7c0ff9159bc36ada373d0f811cb5dc90668b727de8f11e167b35c6c8d39678df-notebook-mxnet-1.6.0"


# GPU based Notebook images for each DL Framework supported
"mesosphere/jupyter-service:545a45c5926f006faf98ff1f70e868bf7bf28b43efc553743e3ebee79820c1da-notebook-tensorflow-2.1.0-gpu"
"mesosphere/jupyter-service:3098ffb9417f21c5c640508e671df04d4fa294fbe0f3e79e048782fe9f8e6132-notebook-tensorflow-1.15-gpu"
"mesosphere/jupyter-service:59f5739641f58f79861d4a248e14a25b31e6e5570bd371f9bd052cfc15df0c81-notebook-pytorch-1.4.0-gpu"
"mesosphere/jupyter-service:6c02651260bf094077bc2963e48bb5abc0d437924ab3b5305481e197ff6b6926-notebook-mxnet-1.6.0-gpu"

# CPU based Worker images for each DL Framework supported
"mesosphere/jupyter-service:b51ef1a82b207380ae268ae94dfb4e49156cc7ad21d42edf7ee70da26b1cb2c9-worker-tensorflow-2.1.0"
"mesosphere/jupyter-service:0a104439d74f74ece0ea82650df74b673d0e7c4c03e9aee725e85aa42a6d4b74-worker-tensorflow-1.15"
"mesosphere/jupyter-service:0ef22682b45fde63038ebda6f4edce4620db45e72f44365f4c6cdcf4e3ead81b-worker-pytorch-1.4.0"
"mesosphere/jupyter-service:5f4660355a05c8e10675e4f5064e1d77c7eea1a9e94f4b2bd9522165f38a3fdf-worker-mxnet-1.6.0"

# GPU based Worker images for each DL Framework supported
"mesosphere/jupyter-service:ea9c3ed28ef2464bb4e6ff2e24fb227eabeca8939d0e58f7b5f228e224cf8dbf-worker-tensorflow-2.1.0-gpu"
"mesosphere/jupyter-service:d6b71dbc4fc689cf621ac27588e839b991fa65c39e16e2dddc5753f82836f271-worker-tensorflow-1.15-gpu"
"mesosphere/jupyter-service:42ddb7d996734154b63e15d271f953e6e16fca2f8dc31492299e649b4578f769-worker-pytorch-1.4.0-gpu"
"mesosphere/jupyter-service:c9017c0afeb7f13000d9457c4a5a54e6864a983553604658acca5dde94100094-worker-mxnet-1.6.0-gpu"
```

## Customize Notebook Image

1. **Choose the image to customize**: Suppose you want to make a library available for notebooks as well as workers and you have planned it to run on CPU with Pytorch, then pick these two images to customize:

    ```text
    mesosphere/jupyter-service:cea0efa8e0578237d4247568be579904e0af1da4834ed17f166f06f7ef5be0f2-notebook-mxnet-1.6.0
    ```

1. **Create a Dockerfile**:
    We will use `@jupyterlab/fasta-extension` as an example. On your personal laptop or server, create `Dockerfile` with the following content:

    ```dockerfile
    FROM mesosphere/jupyter-service:cea0efa8e0578237d4247568be579904e0af1da4834ed17f166f06f7ef5be0f2-notebook-mxnet-1.6.0

    RUN ${CONDA_DIR}/bin/jupyter labextension install --no-build \
          @jupyter-widgets/jupyterlab-manager@2.0.0 \
          @jupyterlab/fasta-extension@2.0.0 \
        && ${CONDA_DIR}/bin/jupyter lab build --minimize=False --dev-build=False
    ```

1. **Build and push the Dockerfile**:
    From directory where Dockerfile has been created, run the commands `docker build` and `docker push` as shown below. Assuming that the docker repository name is `docker123` and image name is `jupyter-with-extension:notebook`, the commands will be:

    ```bash
    docker build -t docker123/jupyter-with-extension:notebook .
    docker push docker123/jupyter-with-extension:notebook
    ```

1. **Run the service with custom image**:
    You could specify this custom built image in the config of the service as follows:

    ```json
    {
        "advanced": {
            "jupyter_notebook_image": "docker123/jupyter-with-extension:notebook"
        }
    }
    ```

## Example Notebook for Custom Notebook Image

In the following example, you will use an extension that we installed in a custom image.

Open a `Python Notebook` and put the following in a code cell:

```python
from IPython.display import display
 
def Fasta(data=''):
    bundle = {}
    bundle['application/vnd.fasta.fasta'] = data
    bundle['text/plain'] = data
    display(bundle, raw=True)
 
Fasta(""">SEQUENCE_1
MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
>SEQUENCE_2
SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH""")
```

Expected output would be:

![FASTA Extension Example](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-fasta-extension-example.png)


## Customize Worker Image

1. **Choose an image to customize**:
    Suppose you want to make a library available for workers or Spark executors and you have planned it to run on CPU with MxNet, then you need to pick this image to customize.

    ```
    mesosphere/jupyter-service:5f4660355a05c8e10675e4f5064e1d77c7eea1a9e94f4b2bd9522165f38a3fdf-worker-mxnet-1.6.0
    ```

1. **Create a Dockerfile**:
    We will use `conda install -yq spacy` as an example, and will install `spacy` for demo purposes. On your personal laptop or server, create `Dockerfile` with the following content:

    ```dockerfile
    FROM mesosphere/jupyter-service:5f4660355a05c8e10675e4f5064e1d77c7eea1a9e94f4b2bd9522165f38a3fdf-worker-mxnet-1.6.0

    RUN conda install -yq spacy
    ```

1. **Build and push the Dockerfile**: From each directory where Dockerfile has been created, run the commands `docker build` and `docker push` as shown below. Assuming that the docker repository name is `docker123` and image names are `spacy-example:notebook` and `spacy-example:worker`, run the following commands:

    ```bash
    docker build -t docker123/spacy-example:worker .
    docker push docker123/spacy-example:worker
    ```

1. **Run the service with custom image**: Specify these custom built images in the config of the service as follows:

    ```json
    {
        "advanced": {
            "jupyter_worker_image": "docker123/spacy-example:worker"
        }
    }
    ```

    Or you could directly specify this image in the configuration of the Spark Job as follows:

    ```python
    spark = SparkSession.builder.config("spark.mesos.executor.docker.image", "docker123/spacy-example:worker").appName("SparkJobName").getOrCreate()
    ```

## Example Notebook for Custom Worker Image

In the following example, use a user-defined function to import a library we installed in a custom image.

Open a `Python Notebook` and put the following in a code cell:

```python
import pyspark
from pyspark.sql import SparkSession
spark = SparkSession.builder.config("spark.mesos.executor.docker.image", "docker123/spacy-example:worker").appName("Test UDF").getOrCreate()

from pyspark.sql.types import StringType

def test_func(x):
    import spacy
    return x

spark.udf.register("test_func", test_func, StringType())

spark.range(1, 20).registerTempTable("test")

spark.sql("SELECT test_func(id) from test").collect()

spark.stop()
```

The expected output would be:

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
