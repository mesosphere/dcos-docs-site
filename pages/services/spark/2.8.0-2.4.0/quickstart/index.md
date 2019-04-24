---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Introduction to DC/OS Apache Spark service
title: Quick Start
menuWeight: 11
model: /services/spark/data.yml
render: mustache
featureMaturity:
---

This page explains how to install the DC/OS {{ model.techName }} service.

**Prerequisites**

* [DC/OS and DC/OS CLI installed](/1.12/installing/) with a minimum of {{ model.install.nodeDescription }}
* Depending on your [security mode](/1.12/security/ent/), {{ model.techShortName }} requires service authentication for access to DC/OS. See [Provisioning a service account](/services/spark/2.8.0-2.4.0/security/#provision-a-service-account) for more information.

    | Security mode  | Service account  |
    |---------------|-----------------|
    | Disabled      | Not available   |
    | Permissive    | Optional   |
    | Strict        | Required |

1. Install the {{ model.techShortName }} package. This may take a few minutes. This step installs the {{ model.techShortName }} DC/OS service, {{ model.techShortName }} CLI, dispatcher, and, optionally, the history server. See the [History Server](/services/spark/2.8.0-2.4.0/history-server/#installing-hdfs) section for information about how to install the history server.

    ```bash
    dcos package install spark
    ```

    Expected output:

    ```bash
    Installing Marathon app for package [{{ model.packageName }}] version [2.8.0-2.4.0]
    Installing CLI subcommand for package [{{ model.packageName }}] version [2.8.0-2.4.0]
    New command available: dcos spark
    DC/OS {{ model.techShortName }} is being installed!

    	Documentation: https://docs.mesosphere.com/services/{{ model.packageName }}/
    	Issues: https://docs.mesosphere.com/support/
    ```

   <p class="message--note"><strong>NOTE: </strong>Type <code>dcos spark</code> to view the {{ model.techShortName }} CLI options.</p>

1. Run the sample SparkPi jar for DC/OS.

    You can view the example source [here](https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.3.2.jar).

    1. Use the following command to run a {{ model.techShortName }} job which calculates the value of Pi.

        ```bash
        dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 30"
        ```

        Expected output:

        ```bash
        2017/08/24 15:42:07 Using docker image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for drivers
        2017/08/24 15:42:07 Pulling image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:42:07 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224209-0001
        ```

    2. View the standard output from your job:

        ```bash
        dcos spark log driver-20170824224209-0001
        ```

        Expected output:

        ```bash
        Pi is roughly 3.141853333333333
        ```

2. Run a Python SparkPi jar. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/pi.py).

    1. Use the following command to run a Python {{ model.techShortName }} job which calculates the value of Pi.

        ```bash
        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"
        ```

        Expected output:

        ```bash
        2017/08/24 15:44:20 Parsing application as Python job
        2017/08/24 15:44:23 Using docker image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for drivers
        2017/08/24 15:44:23 Pulling image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:44:23 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224423-0002
        ```

    2. View the standard output from your job:

        ```bash
        dcos task log --completed driver-20170616213917-0002
        ```

        Expected output:

        ```bash
        Pi is roughly 3.142715
        ```

3. Run an R job. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/dataframe.R).

    1. Use the following command to run an R job.

        ```bash
        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"
        ```

        Expected output:

        ```bash
        2017/08/24 15:45:21 Parsing application as R job
        2017/08/24 15:45:23 Using docker image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for drivers
        2017/08/24 15:45:23 Pulling image mesosphere/spark:2.8.0-2.4.0-hadoop-2.9 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:45:23 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224524-0003
        ```

    2. Use the following command to view the standard output from your job.

        ```bash
        dcos spark log --lines_count=10 driver-20170824224524-0003
        ```

        Expected output:

        ```bash
        In Filter(nzchar, unlist(strsplit(input, ",|\\s"))) :
          bytecode version mismatch; using eval
        root
         |-- name: string (nullable = true)
         |-- age: double (nullable = true)
        root
         |-- age: long (nullable = true)
         |-- name: string (nullable = true)
            name
        1 Justin
        ```

## Next steps

- To view the status of your job, run the `dcos spark webui` command then visit the {{ model.techShortName }} cluster dispatcher UI at `http://<dcos-url>/service/spark/` .
- To view the logs, see the documentation for [Mesosphere DC/OS monitoring](https://docs.mesosphere.com/1.12/monitoring/logging/).
- To view details about your {{ model.techShortName }} job, run the `dcos task log --completed <submissionId>` command.
