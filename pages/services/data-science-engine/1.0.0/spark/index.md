---
layout: layout.pug
navigationTitle:  Spark
excerpt: Using Spark with DC/OS Data Science Engine
title: Spark
menuWeight: 6
model: /services/data-science-engine/data.yml
render: mustache
---
{{ model.techName }} comes pre-installed with Apache Spark, a unified analytics engine for large-scale data processing. This section describes basic and advanced examples of how to use {{ model.techName }} with Spark.
{{ model.techName }} includes the Spark History Server, which requires HDFS. For information about installing the Spark History Server, see the [HDFS section](/services/data-science-engine/hdfs/).


# Basic

##Prerequisites
Perform a default installation by following the instructions in the [Install and Customize](/services/data-science-engine/install/) section.

## Run a {{ model.techName }} job
1. Before submitting your job, upload the artifact (such as a `jar` file) to a location that is visible to the cluster (such as HTTP, S3, or HDFS).

1. Run the job.
   Include all configuration flags for the job before the `jar` url. Provide the arguments for the {{ model.packageName }} job after the `jar` url.

   Follow the template `dcos spark run --submit-args="<flags> URL [args]`, where:
   `<flags>` are options like `--conf spark.cores.max=16` and `--class my.aprk.App`
  `URL` is the location of the application
  `[args]` are any arguments for the application

   
   If your job runs successfully, you will get a message with the job’s submission ID:
    ```bash
    Run job succeeded. Submission id: driver-20160126183319-0001
    ```
View the {{ model.packageName }} scheduler progress by navigating to the {{ model.packageName }} dispatcher at `http://<dcos-url>/service/spark/`.

View the job's logs through the Mesos UI at `http://<dcos-url>/mesos/` or by running `dcos task log --follow <submission_id>`.

### Run a Python {{ model.packageName }} job
```bash
dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"
```

### Run an R {{ model.packageName }} job

```bash
dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"
```

View the status of your job using the Spark cluster dispatcher or use the Mesos UI to see job logs.

## Interactive Spark shell

You can run Spark commands interactively in the Spark shell. The Spark shell is available in Scala, Python, and R.
1. Launch a long-running interactive `bash` session using `dcos task exec`.
1. From your interactive `bash` session, pull and run a Spark Docker image.
    ```bash
    docker pull mesosphere/spark:2.8.0-2.4.0-hadoop-2.9
    docker run -it --net=host mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 /bin/bash
    ```
1. Run the Spark shell from within the Docker image.

   For the Scala Spark shell:

    ```bash
    ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 --conf spark.mesos.executor.home=/opt/spark/dist
    ```
   For the Python Spark shell:

    ```bash   
    ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 --conf spark.mesos.executor.home=/opt/spark/dist
    ```

   For the R Spark shell:

    ```bash  
    ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 --conf spark.mesos.executor.home=/opt/spark/dist
    ```

<p class="message--note"><strong>NOTE: </strong>Find your internal leader IP by going to <tt>dcos-url/mesos</tt>. The internal leader IP is listed in the upper left hand corner.</p>

4.  Run Spark commands interactively.

    In the Scala shell:

    ```bash
    val textFile = sc.textFile("/opt/spark/dist/README.md")
    textFile.count()
    ```
    In the Python shell:

    ```bash
    textFile = sc.textFile("/opt/spark/dist/README.md")
    textFile.count()
    ```

    In the R shell:

    ```bash
    df <- as.DataFrame(faithful)
    head(df)
    ```

# Advanced

This section describes a few of the more advanced jobs you can run with {{ model.packageName }} and Spark.
Run a {{ model.packageName }} streaming job with Kafka
Examples of {{ model.techName }} streaming applications that connect to a secure Kafka cluster can be found at spark-build. As mentioned in the [Kerberos](/services/data-science-engine/kerberos/) section, {{ model.techName }} requires a {{ model.packageName }} file, the `krb5.conf`, and the keytab.
An example of a {{ model.packageName }} file is:

    KafkaClient {
    com.sun.security.auth.module.Krb5LoginModule required
    storeKey=true
    keyTab="/mnt/mesos/sandbox/kafka-client.keytab"
    useTicketCache=false
    serviceName="kafka"
    principal="client@LOCAL";
        };

The corresponding `dcos spark` command would be:

```bash
dcos spark run --submit-args="\
--conf spark.mesos.containerizer=mesos \  # required for secrets
--conf spark.mesos.uris=<URI_of_jaas.conf> \
--conf spark.mesos.driver.secret.names=spark/__dcos_base64___keytab \  # base64 encoding of binary secrets required in DC/OS 1.10 or lower
--conf spark.mesos.driver.secret.filenames=kafka-client.keytab \
--conf spark.mesos.executor.secret.names=spark/__dcos_base64___keytab \
--conf spark.mesos.executor.secret.filenames=kafka-client.keytab \
--conf spark.mesos.task.labels=DCOS_SPACE:/spark \
--conf spark.scheduler.minRegisteredResourcesRatio=1.0 \
--conf spark.executorEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
--conf spark.mesos.driverEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
--class MyAppClass <URL_of_jar> [application args]"
```

<p class="message--note"><strong>NOTE: </strong>There are additional walkthroughs available in the docs/walkthroughs/ directory of Mesosphere's `spark-build`.</p>

# Setting {{ model.packageName }} properties

{{ model.techName }} job settings are controlled by configuring {{ model.packageName }} properties.

## Submission

All properties are submitted through the `--submit-args` option to `dcos spark run`. There are a few options that are unique to DC/OS that are not in {{ model.techName }} Submit (for example `--keytab-secret-path`).  View `dcos spark run --help` for a list of all these options. All `--conf` properties supported by {{ model.techName }} can be passed through the command-line with within the `--submit-args` string.
```bash
dcos spark run --submit-args="--conf spark.executor.memory=4g --supervise --class MySampleClass http://external.website/mysparkapp.jar 30"
```

## Setting automatic configuration defaults

To set {{ model.packageName }} properties with a configuration file, create a `spark-defaults.conf` file and set the environment variable `SPARK_CONF_DIR` to the containing directory.

## Using a properties file

To reuse {{ model.techName }} properties without cluttering the command line, the CLI supports passing a path to a local file containing {{ model.packageName }} properties. Such a file consists of properties and values separated by whitespace. For example:
```text
spark.mesos.containerizer   mesos
spark.executors.cores       4
spark.eventLog.enabled      true
spark.eventLog.dir          hdfs:///history
```
This sample property file sets the containerizer to `mesos`, the executor cores to `4` and enables the history server. This file is parsed locally, so it is not be available to your driver applications.

# Secrets

Enterprise DC/OS provides a secrets store to enable access to sensitive data such as database passwords, private keys, and API tokens. DC/OS manages secure transportation of secret data, access control and authorization, and secure storage of secret content. A secret can be exposed to drivers and executors as a file or as an environment variable.

For more information, see the [Secrets](/services/data-science-engine/1.0.0/security/#create-a-secret) documentation.

# DC/OS overlay network
To submit a {{ model.packageName }} job inside the [DC/OS Overlay Network](/1.14/overview/design/overlay/), run a command similar to the following:
```bash
dcos {{ model.packageName }} run --submit-args="--conf spark.{{ model.packageName }}.containerizer=mesos --conf {{ model.packageName }}.mesos.network.name=dcos --class MySampleClass http://external.website/my{{ model.packageName }}app.jar"
```

Note that DC/OS overlay support requires the UCR rather than the default Docker Containerizer, so you must set

```bash
--conf {{ model.packageName }}.mesos.containerizer=mesos
```

# Driver failover timeout

The `--conf {{ model.packageName }}.mesos.driver.failoverTimeout` option specifies the number of seconds that the master will wait for the driver to reconnect, after being temporarily disconnected, before it tears down the driver framework by killing all its executors. The default value is zero, meaning no timeout. If the driver disconnects and the value of this option is zero, the master immediately tears down the framework.
To submit a job with a nonzero failover timeout, run a command similar to the following:

```bash
dcos {{ model.packageName }} run --submit-args="--conf {{ model.packageName }}.mesos.driver.failoverTimeout=60 --class MySampleClass http://external.website/my{{ model.packageName }}app.jar"
```

<p class="message--important"><strong>IMPORTANT: </strong>If you kill a job before it finishes, the framework will persist as an inactive framework in Mesos for a period equal to the failover timeout. You can manually tear down the framework before that period is over by hitting the Mesos teardown endpoint.

# Versioning
The {{ model.techName }} Docker image contains OpenJDK 8 and Python 2.7.6.
{{ model.techName }} distributions 1.X are compiled with Scala 2.10.  {{ model.techName }} distributions 2.X are compiled with Scala 2.11.  Scala is not binary compatible across minor verions, so your {{ model.packageName }} job must be compiled with the same Scala version as your version of {{ model.techName }}.
The default {{ model.techName }} distribution is compiled against Hadoop 2.9 libraries.  
