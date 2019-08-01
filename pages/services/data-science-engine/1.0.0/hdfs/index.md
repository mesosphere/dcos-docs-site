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

Within the {{ model.techName }} service configuration, set `hdfs.config-url` to be a URL that serves your `hdfs-site.xml` and `core-site.xml`. The following example uses `http://mydomain.com/hdfs-config/hdfs-site.xml` and `http://mydomain.com/hdfs-config/core-site.xml` URLs:

```json
{
 "hdfs": {
   "config-url": "http://mydomain.com/hdfs-config"
 }
}
```
You can also specify the URLs through the UI. If you are using the default installation of HDFS from Mesosphere, this is probably `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints`.

## Adding HDFS configuration files per-job
To add the configuration files manually for a job, use 

```bash
--conf spark.mesos.uris=<location_of_hdfs-site.xml>,<location_of_core-site.xml>
```

This setting downloads the files to the sandbox of the driver {{ model.productName }} application, and {{ model.techName }} automatically loads these files into the correct location.

<p class="message--important"><strong>IMPORTANT: </strong>It is important that these files are called <tt>hdfs-site.xml</tt> and <tt>core-site.xml</tt>.</p>

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

1. Upload your credentials to the DC/OS secret store:

```bash
dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY>
```

1. After uploading your credentials, {{ model.techName }} jobs can get the credentials directly:

```bash
dcos {{ model.packageName }} run --submit-args="\
...
--conf {{ model.packageName }}.mesos.containerizer=mesos  # required for secrets
--conf {{ model.packageName }}.mesos.driver.secret.names=<secret_path_for_key_id>,<secret_path_for_secret_key>
--conf {{ model.packageName }}.mesos.driver.secret.envkeys=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY
...
```


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
