---
layout: layout.pug
excerpt: Understanding how to configure HDFS with DC/OS Apache Spark
title: Integration with HDFS
navigationTitle: HDFS
menuWeight: 20
model: /services/spark/data.yml
render: mustache
---

# HDFS

If you plan to read and write from HDFS using DC/OS {{ model.techName }}, there are two Hadoop configuration files that should be included on {{ model.techShortName }}'s classpath: 
- `hdfs-site.xml`, which provides default behaviors for the HDFS client. 
- `core-site.xml`, which sets the default filesystem name. You can specify the location of these files at install time or for each job.

## {{ model.techShortName }} Installation
Within the {{ model.techShortName }} service configuration, set `hdfs.config-url` to be a URL that serves your `hdfs-site.xml` and `core-site.xml`, as in the [example below](#adding-hdfs), where `http://mydomain.com/hdfs-config/hdfs-site.xml` and `http://mydomain.com/hdfs-config/core-site.xml` are valid URLs:

```json
{
  "hdfs": {
    "config-url": "http://mydomain.com/hdfs-config"
  }
}
```
This can also be done through the web interface. If you are using the default installation of HDFS from Mesosphere, this is probably `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints`.

<a name="adding-hdfs"></a>
## Adding HDFS configuration files per-job
To add the configuration files manually for a job, use `--conf {{ model.serviceName }}.mesos.uris=<location_of_hdfs-site.xml>,<location_of_core-site.xml>`. This will download the files to the sandbox of the Driver {{ model.techShortName }} application, and DC/OS {{ model.techName}} will automatically load these files into the correct location. 

**Note:** It is important these files are called `hdfs-site.xml` and `core-site.xml`.

### {{ model.techShortName }} Checkpointing

In order to use {{ model.techShortName }} with checkpointing, make sure you follow the instructions [here](https://spark.apache.org/docs/latest/streaming-programming-guide.html#checkpointing) and use an HDFS directory as the checkpointing directory. 

For example:
```
val checkpointDirectory = "hdfs://hdfs/checkpoint"
val ssc = ...
ssc.checkpoint(checkpointDirectory)
```
That HDFS directory will be automatically created on HDFS and the {{ model.techShortName }} streaming app will work from checkpointed data, even in the presence of application restarts/failures.

# S3
You can read/write files to S3 using environment-based secrets to pass your AWS credentials. Your credentials must first be uploaded to the DC/OS secret store:

```
dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY> 
```
Then your {{ model.techShortName }} jobs can get these credentials directly:

```
dcos {{ model.serviceName }} run --submit-args="\
...
--conf {{ model.serviceName }}.mesos.containerizer=mesos  # required for secrets
--conf {{ model.serviceName }}.mesos.driver.secret.names=<secret_path_for_key_id>,<secret_path_for_secret_key>
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY
...
```

