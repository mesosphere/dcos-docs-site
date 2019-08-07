---
layout: layout.pug
navigationTitle: Spark
excerpt: Using Spark with DC/OS Data Science Engine 
title: Spark
menuWeight: 8
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true

---

{{ model.techName }} comes with Apache Spark integration and allows running Spark jobs from notebooks and a terminal.

# Launching a Spark job
## Using Terminal
Open a `Terminal` from the Notebook UI and run this example `spark-submit` job:

```bash
spark-submit --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.4.0.jar 100
```

## Using a Python Notebook
Open a `Python Notebook` and put the following code in a code cell.
```python
from __future__ import print_function
import sys
from random import random
from operator import add
from pyspark.sql import SparkSession
spark = SparkSession\
        .builder\
        .appName("PythonPi")\
        .getOrCreate()
partitions = 2
n = 100000 * partitions
def f(_):
    x = random() * 2 - 1
    y = random() * 2 - 1
    return 1 if x ** 2 + y ** 2 <= 1 else 0
count = spark.sparkContext.parallelize(range(1, n + 1), partitions).map(f).reduce(add)
print("Pi is roughly %f" % (4.0 * count / n))
spark.stop
```

# Spark UI
The Spark UI starts automatically when a SparkContext is created, and is available at 

```bash
http://<dcos_url>/service/{{ model.serviceName }}/sparkui
```

# Spark History Server

{{ model.techName }} includes the Spark History Server (SHS), which is up and running by default, using `org.apache.spark.deploy.history.FsHistoryProvider` as a default provider with
`spark.history.fs.logDirectory` set to `file:/mns/mesos/sandbox/`. It is highly recommended to use HDFS as the backend storage for SHS.
You can configure SHS to use HDFS with the following steps:

## Installing HDFS

<p class="message--note"><strong>NOTE: </strong>HDFS requires at least five private nodes.</p>

1. Install HDFS:

    ```bash
    dcos package install hdfs
    ```

2. Create a history HDFS directory (default is `/history`). SSH into your cluster and run:

    ```bash
    docker run -it mesosphere/hdfs-client:1.0.0-2.6.0 bash
    ./bin/hdfs dfs -mkdir /history
    ```

## Configuring Spark History Server

1. Configure **Spark History Log Directory** to point to the created HDFS directory in `service.json`:

    ```json
    {
        "service": {
        "jupyter_conf_urls": "<DCOS HDFS endpoint>"
        },
        "spark": {
            "start_spark_history_server": true,
            "spark_history_fs_logdirectory": "hdfs://hdfs/history"
        }
    }
    ```

    To find more about configuring HDFS integration of {{model.nickName}}, see the [Using HDFS with DC/OS Data Science Engine](/mesosphere/dcos/services/data-science-engine/1.0.0/hdfs/) documentation.

1.  Enable the `Spark Event` log and set the HDFS directory:

    ```json
    {
        "spark": {
            "start_spark_history_server": true,
            "spark_history_fs_logdirectory": "hdfs://hdfs/history",
            "spark_eventlog_enabled": true,
            "spark_eventlog_dir": "hdfs://hdfs/history"
        }
    }
    ```

1. Restart the {{ model.serviceName }} Service to apply the changes.

## Confirm Spark History Server installation
The Spark History Server UI is available at `http://<dcos_url>/service/{{ model.serviceName }}/sparkhistory`, listing incomplete and completed applications and attempts.
