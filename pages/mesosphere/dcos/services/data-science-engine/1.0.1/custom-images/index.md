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

This guide will show you how to build a custom Docker image for Spark Executor. You can use these custom-built images with libraries used in distributed Spark jobs.

1. To identify the currently used image, open a **Terminal** from the Notebook UI and run the following command:

    ```bash
    cat /opt/spark/conf/spark-defaults.conf | grep "spark.mesos.executor.docker.image"
    # Output would be something like this:
    # mesosphere/jupyter-service-worker:26a3231f513a686a2fcfb6f9ddb8acd45da467b261311b48a45b2a55bb0f2613
    ```

1. Create a Dockerfile. We will use `conda install -yq spacy` as an example, and will install `spacy` for demo purposes. On your personal laptop or server, create a file with name `Dockerfile` and put the following content into it:

    ```dockerfile
    FROM mesosphere/jupyter-service-worker:26a3231f513a686a2fcfb6f9ddb8acd45da467b261311b48a45b2a55bb0f2613
    USER nobody
    RUN conda install -yq spacy
    ```

1. Build and push the Dockerfile. From the same directory where Dockerfile has been created, run the commands `docker build` and `docker push` as shown below. Assuming that the docker repository name is `docker123` and image name is `spacy-example`, the commands will be:

    ```bash
    docker build -t docker123/spacy-example .
    docker push docker123/spacy-example
    ```

## Example Notebook

In the following example, you will use a user-defined function to import a library we installed in a custom image.

Open a `Python Notebook` and put the following in a code cell:

```python
import pyspark
from pyspark.sql import SparkSession
# Specify custom image to be used, via spark.mesos.executor.docker.image configuration property
spark = SparkSession.builder.config("spark.mesos.executor.docker.image", "docker123/spacy-example").appName("Test UDF").getOrCreate()

from pyspark.sql.types import StringType

def test_func(x):
    import spacy
    return x

spark.udf.register("test_func", test_func, StringType())

spark.range(1, 20).registerTempTable("test")

spark.sql("SELECT test_func(id) from test").collect()

spark.stop()
```