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

You can specify the location of these files at install time or for each {{ model.techName }} instance.

# Configuring {{ model.techName }} to work with HDFS

Within the {{ model.techName }} service configuration, set `service.jupyter_conf_urls` to be a list of URLs that serves your `hdfs-site.xml` and `core-site.xml`. The following example uses `http://mydomain.com/hdfs-config/hdfs-site.xml` and `http://mydomain.com/hdfs-config/core-site.xml` URLs:

```json
{
 "service": {
   "jupyter_conf_urls": "http://mydomain.com/hdfs-config"
 }
}
```
You can also specify the URLs through the UI. If you are using the default installation of HDFS from Mesosphere, this would be `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints` for HDFS service installed with `hdfs` name.

## Example of Using HDFS with Spark
Here is the example notebook of `Tensorflow on Spark` using `HDFS` as a storage backend. Launch Terminal from Notebook UI and run the following commands:

1. Clone TensorFlow on Spark repository and download sample dataset:

    ```bash
    rm -rf TensorFlowOnSpark && git clone https://github.com/yahoo/TensorFlowOnSpark
    rm -rf mnist && mkdir mnist
    curl -fsSL -O https://infinity-artifacts.s3-us-west-2.amazonaws.com/jupyter/mnist.zip
    unzip -d mnist/ mnist.zip
    ```

2. List files in the target HDFS directory and remove it if it is not empty.

    ```bash
    hdfs dfs -ls -R mnist/ && hdfs dfs -rm -R mnist/
    ```

3. Generate sample data and save to HDFS.

    ```bash
    spark-submit \
      --verbose \
      $(pwd)/TensorFlowOnSpark/examples/mnist/mnist_data_setup.py \
      --output mnist/csv \
      --format csv

    hdfs dfs -ls -R  mnist
    ```

4. Train the model and checkpoint it to the target directory in HDFS.

    ```bash
    spark-submit \
      --verbose \
      --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \
      $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \
      --cluster_size 4 \
      --images mnist/csv/train/images \
      --labels mnist/csv/train/labels \
      --format csv \
      --mode train \
      --model mnist/mnist_csv_model
    ```

5. Verify model is saved.

    ```bash
    hdfs dfs -ls -R mnist/mnist_csv_model
    ```

# S3

You can read/write files to S3 using environment variable-based secrets to pass your AWS credentials.

1. Upload your credentials to the DC/OS secret store:

    ```bash
    dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
    dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY>
    ```

1. After uploading your credentials, {{ model.techName }} service can get the credentials via service options:

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
