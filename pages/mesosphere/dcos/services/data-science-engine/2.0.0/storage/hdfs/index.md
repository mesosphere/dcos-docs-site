---
layout: layout.pug
navigationTitle: HDFS
excerpt: Using HDFS with DC/OS Data Science Engine
title: HDFS
menuWeight: 4
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true

---

# Prerequisites

<p class="message--note"><strong>NOTE: </strong> If you are planning to use <a href="/mesosphere/dcos/services/data-science-engine/2.0.0/storage/hdfs/">HDFS</a> on {{ model.techName }}, you will need a minimum of five nodes.</p>

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

You can also specify the URLs through the UI. If you are using the default installation of HDFS from Mesosphere, this would be `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints` for HDFS service installed with the `hdfs` name.

# Example of Using HDFS with Spark

Here is an example of running `Spark Job` using `HDFS` as a storage backend.

1. Launch **Python3 Notebook** from the Notebook UI. Put the following code in a code cell.

    ```python
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.appName("HDFS Read Write Example").getOrCreate()

    hdfs_path = "hdfs://hdfs/jupyter/test"
    spark.range(10).write.parquet(hdfs_path)
    result = spark.read.parquet(hdfs_path)
    print("COUNT={}".format(result.count()))

    spark.stop()
    ```

    The expected output would be:

    ```text
    COUNT=10
    ```

1. Verify that the file has been saved. Go to the **Terminal** from the Notebook UI and run following command.

    ```bash
    hdfs dfs -ls -R /jupyter/test
    ```

    The expected output would be:

    ```log
    -rw-r--r--   3 nobody supergroup          0 2020-06-09 15:25 /jupyter/test/_SUCCESS
    -rw-r--r--   3 nobody supergroup        443 2020-06-09 15:25 /jupyter/test/part-00000-4260aa54-4302-40a2-8fb6-370fe8393f8b-c000.snappy.parquet
    -rw-r--r--   3 nobody supergroup        445 2020-06-09 15:25 /jupyter/test/part-00001-4260aa54-4302-40a2-8fb6-370fe8393f8b-c000.snappy.parquet
    ```
