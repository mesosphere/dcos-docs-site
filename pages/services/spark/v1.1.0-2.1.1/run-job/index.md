---
layout: layout.pug
navigationTitle:  Run a Spark Job
title: Run a Spark Job
menuWeight: 80
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/spark-build -->

1.  Before submitting your job, upload the artifact (e.g., jar file)
    to a location visible to the cluster (e.g., HTTP, S3, or HDFS). [Learn more][13].

1.  Run the job.

        $ dcos spark run --submit-args="--class MySampleClass http://external.website/mysparkapp.jar 30"

        $ dcos spark run --submit-args="--py-files mydependency.py http://external.website/mysparkapp.py 30"

        $ dcos spark run --submit-args="http://external.website/mysparkapp.R"

    `dcos spark run` is a thin wrapper around the standard Spark `spark-submit` script. You can submit arbitrary pass-through options to this script via the `--submit-args` options.

	The first time you run a job, the CLI must download the Spark distribution to your local machine. This may take a while.

	If your job runs successfully, you will get a message with the job’s submission ID:

        Run job succeeded. Submission id: driver-20160126183319-0001

1.  View the Spark scheduler progress by navigating to the Spark dispatcher at `http://<dcos-url>/service/spark/`.

1.  View the job's logs through the Mesos UI at `http://<dcos-url>/mesos/`.

# Setting Spark properties

Spark job settings are controlled by configuring [Spark properties][14]. You can set Spark properties during submission, or you can create a configuration file.

## Submission

All properties are submitted through the `--submit-args` option to `dcos spark run`. These are ultimately passed to the [`spark-submit` script][13].  View `dcos spark run --help` for a list of all these options.

Certain common properties have their own special names. You can view these through `dcos spark run --help`. Here is an example of using `--supervise`:

    $ dcos spark run --submit-args="--conf spark.executor.memory=4g --supervise --class MySampleClass http://external.website/mysparkapp.jar 30"

## Configuration file

To set Spark properties with a configuration file, create a
`spark-defaults.conf` file and set the environment variable
`SPARK_CONF_DIR` to the containing directory. [Learn more][15].

# DC/OS Overlay Network

To submit a Spark job inside the [DC/OS Overlay Network][16]:

    $ dcos spark run --submit-args="--conf spark.mesos.containerizer=mesos --conf spark.mesos.network.name=dcos --class MySampleClass http://external.website/mysparkapp.jar"

Note that DC/OS Overlay support requires the [UCR][17], rather than
the default Docker Containerizer, so you must set `--conf spark.mesos.containerizer=mesos`.

# Versioning

The DC/OS Spark Docker image contains OpenJDK 8 and Python 2.7.6.

DC/OS Spark distributions 1.X are compiled with Scala 2.10.  DC/OS Spark distributions 2.X are compiled with Scala 2.11.  Scala is not binary compatible across minor verions, so your Spark job must be compiled with the same Scala version as your version of DC/OS Spark.

The default DC/OS Spark distribution is compiled against Hadoop 2.6 libraries.  However, you may choose a different version by following the instructions in the "Customize Spark Distribution" section of the Installation page.


[13]: http://spark.apache.org/docs/latest/submitting-applications.html
[14]: http://spark.apache.org/docs/latest/configuration.html#spark-properties
[15]: http://spark.apache.org/docs/latest/configuration.html#overriding-configuration-directory
[16]: https://dcos.io/docs/overview/design/overlay/
[17]: https://dcos.io/docs/1.9/deploying-services/containerizers/ucr/
