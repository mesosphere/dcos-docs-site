---
layout: layout.pug
navigationTitle: Kerberos
excerpt: Using Kerberos with DC/OS Data Science Engine to retrieve and write data securely
title: Kerberos
menuWeight: 5
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---
Kerberos is an authentication system that allows {{ model.techName }} to retrieve and write data securely to a Kerberos-enabled HDFS cluster. Long-running jobs will renew their delegation tokens (authentication credentials). This section assumes you have previously set up a Kerberos-enabled HDFS cluster.

# Configuring Kerberos with {{ model.techName }}

{{ model.techName }} and all Kerberos-enabled components need a valid `krb5.conf` configuration file. The `krb5.conf` file tells `{{ model.packageName }}` how to connect to your Kerberos key distribution center (KDC). You can specify properties for the `krb5.conf` file with the following options.

```json
{
  "security": {
    "kerberos": {
      "enabled": true,
      "kdc": {
        "hostname": "<kdc_hostname>",
        "port": <kdc_port>
      },
      "primary": "<primary_for_principal>",
      "realm": "<kdc_realm>",
      "keytab_secret": "<path_to_keytab_secret>"
    }
  }
}
```

Make sure your `keytab` file is in the DC/OS secret store, under a path that is accessible by the {{ model.packageName }} service.

## Example: Using HDFS with Spark in a Kerberized Environment
Here is the example notebook of `Tensorflow on Spark` using `HDFS` as a storage backend in Kerberized environment. First of all, you need to make sure that HDFS service is installed and {{model.techName}} is configured with its endpoint. To find more about configuring HDFS integration of {{model.techName}} follow [Using HDFS with DC/OS Data Science Engine](/mesosphere/dcos/services/data-science-engine/1.0.0/hdfs/) section.

1. Make sure HDFS Client service is installed and running with the "Kerberos enabled" option. 

1. Run the following commands to set up a directory on HDFS with proper permissions:

    ```bash
    # Suppose the HDFS Client version you are running is "2.6.0-cdh5.0.1", then command will be
    dcos task exec hdfs-client /bin/bash -c '/hadoop-2.6.0-cdh5.9.1/bin/hdfs dfs -mkdir -p /{{ model.packageName }}'
    # Suppose the name of the primary mentioned above is "jupyter"
    dcos task exec hdfs-client /bin/bash -c '/hadoop-2.6.0-cdh5.9.1/bin/hdfs dfs -chown jupyter:jupyter /{{ model.packageName }}'
    dcos task exec hdfs-client /bin/bash -c '/hadoop-2.6.0-cdh5.9.1/bin/hdfs dfs -chmod 700 /{{ model.packageName }}'
    ```

1. Launch **Terminal** from the Notebook UI.

1. Clone `TensorFlow on Spark` repository and download a sample dataset:

    ```bash
    rm -rf TensorFlowOnSpark && git clone https://github.com/yahoo/TensorFlowOnSpark
    rm -rf mnist && mkdir mnist
    curl -fsSL -O https://infinity-artifacts.s3-us-west-2.amazonaws.com/jupyter/mnist.zip
    unzip -d mnist/ mnist.zip
    ```

1. List files in the target HDFS directory and remove it if it is not empty.

    ```bash
    hdfs dfs -ls -R /{{ model.packageName }}/mnist_kerberos && hdfs dfs -rm -R /{{ model.packageName }}/mnist_kerberos
    ```

1. Generate sample data and save to HDFS.

    ```bash
    spark-submit \
      --verbose \
      $(pwd)/TensorFlowOnSpark/examples/mnist/mnist_data_setup.py \
      --output /{{ model.packageName }}/mnist_kerberos/csv \
      --format csv

    hdfs dfs -ls -R /{{ model.packageName }}/mnist_kerberos
    ```

1. Train the model and checkpoint it to the target directory in HDFS. You will need to specify two additional options to distribute Kerberos ticket cache file to executors: `--files <Kerberos ticket cache file>` and `--conf spark.executorEnv.KRB5CCNAME="/mnt/mesos/sandbox/krb5cc_99"`. The Kerberos ticket cache file will be used by executors for authentication with Kerberized HDFS:

    ```bash
    spark-submit \
      --files /tmp/krb5cc_99 --conf spark.executorEnv.KRB5CCNAME="/mnt/mesos/sandbox/krb5cc_99" \
      --verbose \
      --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \
      $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \
      --cluster_size 4 \
      --images /{{ model.packageName }}/mnist_kerberos/csv/train/images \
      --labels /{{ model.packageName }}/mnist_kerberos/csv/train/labels \
      --format csv \
      --mode train \
      --model /{{ model.packageName }}/mnist_kerberos/mnist_csv_model
    ```

5. Verify that the model has been saved.

    ```bash
    hdfs dfs -ls -R /{{ model.packageName }}/mnist_kerberos/mnist_csv_model
    ```
