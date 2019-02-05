---
layout: layout.pug
navigationTitle: Run a Spark Job
excerpt: Running a Spark job
title: Run a Spark Job
menuWeight: 80
featureMaturity:
render: mustache
model: /services/spark/data.yml
---

1. Before submitting your job, upload the artifact (such as a `jar` file) to a location that is visible to the cluster (such as HTTP, S3, or HDFS). [Learn more][13].

1. Run the job.
    - Include all configuration flags for the job before the `jar` url.
    - Provide the arguments for the {{ model.techShortName }} job after the `jar` url.

    Follow the template `dcos spark run --submit-args="<flags> URL [args]`, where:
    - `<flags>` are options like `--conf spark.cores.max=16` and `--class my.aprk.App`
    - `URL` is the location of the application
    -`[args]` are any arguments for the application

    For example:

        dcos spark run --submit-args=--class MySampleClass http://external.website/mysparkapp.jar"

        dcos spark run --submit-args="--py-files mydependency.py http://external.website/mysparkapp.py"

        dcos spark run --submit-args="http://external.website/mysparkapp.R"

    If your job runs successfully, you will get a message with the job’s submission ID:

        Run job succeeded. Submission id: driver-20160126183319-0001

1. View the {{ model.techShortName }} scheduler progress by navigating to the {{ model.techShortName }} dispatcher at http://<dcos-url>/service/spark/`.

1. View the job's logs through the Mesos UI at `http://<dcos-url>/mesos/` or by running `dcos task log --follow <submission_id>`.

# Setting {{ model.techShortName }} properties

{{ model.techShortName }} job settings are controlled by configuring [{{ model.techShortName }} properties][14].

## Submission

All properties are submitted through the `--submit-args` option to `dcos spark run`. There are a few options that are unique to DC/OS that are not in {{ model.techShortName }} Submit (for example `--keytab-secret-path`).  View `dcos spark run --help` for a list of all these options. All `--conf` properties supported by {{ model.techShortName }} can be passed through the command-line with within the `--submit-args` string.

    dcos spark run --submit-args="--conf spark.executor.memory=4g --supervise --class MySampleClass http://external.website/mysparkapp.jar 30`

## Setting automatic configuration defaults

To set {{ model.techShortName }} properties with a configuration file, create a
`spark-defaults.conf` file and set the environment variable
`SPARK_CONF_DIR` to the containing directory. [Learn more][15].

## Using a properties file

To reuse {{ model.techShortName }} properties without cluttering the command line, the CLI supports passing a path to a local file containing {{ model.techShortName }} properties. Such a file consists of properties and values separated by whitespace. For example:
```text
spark.mesos.containerizer   mesos
spark.executors.cores       4
spark.eventLog.enabled      true
spark.eventLog.dir          hdfs:///history
```
This sample property file sets the containerizer to `mesos`, the executor cores to `4` and enables the history server. This file is parsed locally, so it is not be available to your driver applications.

## Secrets

Enterprise DC/OS provides a secrets store to enable access to sensitive data such as database passwords, private keys, and API tokens. DC/OS manages secure transportation of secret data, access control and authorization, and secure storage of secret content. A secret can be exposed to drivers and executors as a file or as an environment variable.

To configure a job to access a secret, see the sections on
* [Using the Secret Store](../security/#using-the-secret-store) and
* [Using Mesos Secrets](../security/#using-mesos-secrets)

# DC/OS overlay network

To submit a {{ model.techShortName }} job inside the [DC/OS Overlay Network](/1.12/overview/design/overlay/), run a command similar to the following:

    dcos spark run --submit-args="--conf spark.mesos.containerizer=mesos --conf spark.mesos.network.name=dcos --class MySampleClass http://external.website/mysparkapp.jar"

Note that DC/OS overlay support requires the [UCR](/1.12/deploying-services/containerizers/ucr/)   rather than the default Docker Containerizer, so you must set `--conf spark.mesos.containerizer=mesos`.

# Driver failover timeout

The `--conf spark.mesos.driver.failoverTimeout` option specifies the number of seconds that the master will wait for the driver to reconnect, after being temporarily disconnected, before it tears down the driver framework by killing
all its executors. The default value is zero, meaning no timeout. If the
driver disconnects and the value of this option is zero, the master immediately tears down the framework.

To submit a job with a nonzero failover timeout, run a command similar to the following:

    dcos spark run --submit-args="--conf spark.mesos.driver.failoverTimeout=60 --class MySampleClass http://external.website/mysparkapp.jar"

<p class="message--important"><strong>IMPORTANT: </strong>If you kill a job before it finishes, the framework will persist as an <code>inactive</code> framework in Mesos for a period equal to the failover timeout. You can manually tear down the framework before that period is over by hitting
the <a href="http://mesos.apache.org/documentation/latest/endpoints/master/teardown/">Mesos teardown endpoint</a>.</p>

# Versioning

The DC/OS {{ model.techName }} Docker image contains OpenJDK 8 and Python 2.7.6.

DC/OS {{ model.techName }} distributions 1.X are compiled with Scala 2.10.  DC/OS {{ model.techName }} distributions 2.X are compiled with Scala 2.11.  Scala is not binary compatible across minor verions, so your {{ model.techShortName }} job must be compiled with the same Scala version as your version of DC/OS {{ model.techName }}.

The default DC/OS {{ model.techName }} distribution is compiled against Hadoop 2.7 libraries.  However, you can choose a different version by following the instructions in [Customize {{ model.techShortName }} distribution](/services/spark/2.6.0-2.3.2/install/#custom-dist/).


[13]: http://spark.apache.org/docs/latest/submitting-applications.html
[14]: http://spark.apache.org/docs/latest/configuration.html#spark-properties
[15]: http://spark.apache.org/docs/latest/configuration.html#overriding-configuration-directory
[18]: http://mesos.apache.org/documentation/latest/endpoints/master/teardown/
