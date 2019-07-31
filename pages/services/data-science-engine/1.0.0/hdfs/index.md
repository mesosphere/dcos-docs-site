---
layout: layout.pug
navigationTitle: HDFS
excerpt: Using HDFS with DC/OS Data Science Engine
title: HDFS
menuWeight: 4
model: /services/data-science-engine/data.yml
render: mustache
---

If you plan to read and write from HDFS using {{ model.techName }}, there are two Hadoop configuration files that you should include in the {{ model.productName }} classpath:

- `hdfs-site.xml`, which provides default behaviors for the HDFS client.
- `core-site.xml`, which sets the default file system name.

You can specify the location of these files at install time or for each job.

# Configuring HDFS with {{ model.techName }}

Within the {{ model.techName }} service configuration, set `service.jupyter_conf_urls` to be a list of URLs that serves your `hdfs-site.xml` and `core-site.xml`. The following example uses `http://mydomain.com/hdfs-config/hdfs-site.xml` and `http://mydomain.com/hdfs-config/core-site.xml` URLs:

```json
{
 "service": {
   "jupyter_conf_urls": "http://mydomain.com/hdfs-config"
 }
}
```
You can also specify the URLs through the UI. If you are using the default installation of HDFS from Mesosphere, this is probably `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints`.

## Adding HDFS configuration files per-job
To add the configuration files manually for a Spark job, use following configuration with `spark-submit` in a notebook. 

```bash
--conf spark.mesos.uris=<location_of_hdfs-site.xml>,<location_of_core-site.xml>
```

This setting downloads the files to the sandbox of the driver {{ model.productName }} application, and {{ model.techName }} automatically loads these files into the correct location.

<p class="message--important"><strong>IMPORTANT: </strong>It is important that these files are called <tt>hdfs-site.xml</tt> and <tt>core-site.xml</tt>.</p>

## Example of Using HDFS with Spark
Here is the example notebook of `Tensorflow on Spark` using `HDFS` as a storage backend.

```json
{
  "cells": [
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! rm -rf TensorFlowOnSpark \u0026\u0026 git clone https://github.com/yahoo/TensorFlowOnSpark"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! rm -rf mnist \u0026\u0026 mkdir mnist"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! curl -fsSL -O https://infinity-artifacts.s3-us-west-2.amazonaws.com/jupyter/mnist.zip"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! unzip -d mnist/ mnist.zip"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! hdfs dfs -ls -R mnist/ \u0026\u0026 hdfs dfs -rm -R mnist/"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": "! spark-submit \\\n  --verbose \\\n  $(pwd)/TensorFlowOnSpark/examples/mnist/mnist_data_setup.py \\\n  --output mnist/csv \\\n  --format csv"
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": [
        "! hdfs dfs -ls -R  mnist"
      ]
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": "! spark-submit \\\n  --verbose \\\n  --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \\\n  $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \\\n  --cluster_size 4 \\\n  --images mnist/csv/train/images \\\n  --labels mnist/csv/train/labels \\\n  --format csv \\\n  --mode train \\\n  --model mnist/mnist_csv_model"
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {
        "pycharm": {}
      },
      "outputs": [],
      "source": "! hdfs dfs -ls -R mnist/mnist_csv_model\n"
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    },
    "language_info": {
      "codemirror_mode": {
        "name": "ipython",
        "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.6.7"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}
```

## {{ model.techName }} checkpointing
To use {{ model.techName }} with checkpointing, make sure you follow the instructions here and use an HDFS directory as the checkpointing directory. For example:

```bash
val checkpointDirectory = "hdfs://hdfs/checkpoint"
val ssc = ...
ssc.checkpoint(checkpointDirectory)
```
The HDFS directory is automatically created on HDFS. 
<!-- The {{ model.techName }} streaming app will work from checkpointed data, even in the event of an application restarts or failure. -->

# S3

You can read/write files to S3 using environment variable-based secrets to pass your AWS credentials.

Upload your credentials to the DC/OS secret store:

```bash
dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY>
```

After uploading your credentials, {{ model.techName }} service can get the credentials via service options:

```json
{
  "s3": {
    "aws_access_key_id": "<secret_path_for_key_id>",
    "aws_secret_access_key": "<secret_path_for_secret_key>"
  }
}
```
You can also specify them through the UI.

# Enabling the Spark History Server

{{ model.techName }} includes the Spark History Server. Because the history server requires HDFS, you must explicitly enable it.

## Installing HDFS

<p class="message--note"><strong>NOTE: </strong>HDFS requires at least five private nodes.</p>

1. Install HDFS:

```bash
dcos package install hdfs
```

1. Create a history HDFS directory (default is `/history`). SSH into your cluster and run:

```bash
docker run -it mesosphere/hdfs-client:1.0.0-2.6.0 bash
./bin/hdfs dfs -mkdir /history
```

1. Create `spark-history-options.json`:

```json
{
  "service": {
   "hdfs-config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
              }
}
```

## Installing Spark history server

1. To install the Spark history server:

```bash
dcos package install spark-history --options=spark-history-options.json
```

1. Create `spark-dispatcher-options.json`:

```json
{
"service": {
"spark-history-server-url": "http://<dcos_url>/service/spark-history"
},
"hdfs": {
"config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
}
}
```

1. Install the Spark dispatcher:

```bash
dcos package install spark --options=spark-dispatcher-options.json
```

1. Enable the event log:

```bash
dcos spark run --submit-args="--conf spark.eventLog.enabled=true --conf spark.eventLog.dir=hdfs://hdfs/history ... --class MySampleClass  http://external.website/mysparkapp.jar"
```

## Confirm history server installation
View your job in the dispatcher at `http://<dcos_url>/service/spark/`. The information displayed includes a link to the history server entry for that job.
