---
layout: layout.pug
navigationTitle:
excerpt: Getting started with Spark
title: Quickstart
menuWeight: 1
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

This Quick Start Guide will get you up and running in minutes with the DC/OS {{ model.techName }} service.

**Prerequisites:**

-  [DC/OS and DC/OS CLI installed](https://docs.mesosphere.com/latest/installing/) with a minimum of {{ model.install.nodeDescription }} available on each agent.
-  Depending on your [security mode](https://docs.mesosphere.com/latest/overview/security/security-modes/), {{ model.techShortName }} requires service authentication for access to DC/OS. See [Provisioning a service account](/services/spark/2.3.1-2.2.1-2/security/#provisioning-a-service-account) for more information.

   | Security mode | Service Account |
   |---------------|-----------------------|
   | Disabled      | Not available   |
   | Permissive    | Optional   |
   | Strict        | Required |


# Installation

For more installation about minimal installation, multiple installations, and other, more complicated tasks, see the [Installation documentation](/services/spark/2.3.1-2.2.1-2/install/).
1.  Install the {{ model.techShortName }} package. This may take a few minutes. This installs the  DC/OS {{ model.techShortName }} service, {{ model.techShortName }} CLI, dispatcher, and, optionally, the Spark History Server. See [Spark History Server](/services/spark/2.3.1-2.2.1-2/history-server/) to install the history server.

  ```bash
    dcos package install spark
  ```

  Your output should resemble:

  ```bash
    Installing Marathon app for package [spark] version [1.1.0-2.1.1]
    Installing CLI subcommand for package [spark] version [1.1.0-2.1.1]
    New command available: dcos spark
    DC/OS Spark is being installed!

    	Documentation: https://docs.mesosphere.com/services/spark/
    	Issues: https://docs.mesosphere.com/support/
  ```

**Note:** You can view the status of your {{ model.techShortName }} installation from the DC/OS GUI **Services** tab.

![Verify spark installation](/services/spark/v1.1.0-2.1.1/img/spark-gui-install.png)

Figure 1. Services tab showing Spark

2. Install the Spark CLI

    - Type `dcos spark` to view the {{ model.techShortName }} CLI options.
    - Install the {{ model.techShortName }} CLI with this command:

     ```bash
       dcos package install spark --cli
     ```

## Sample jobs

### SparkPi

1.  Run the sample SparkPi jar for DC/OS. This runs a Spark job which calculates the value of Pi. You can view the example source [here](https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar).

  ```bash
        dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 30"
  ```

  Your output should resemble:

  ```bash
        2017/08/24 15:42:07 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
        2017/08/24 15:42:07 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:42:07 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224209-0001
  ```

2.  View the standard output from your job:

  ```bash
        dcos spark log driver-20170824224209-0001
  ```

  Your output should resemble:

  ```bash
        Pi is roughly 3.141853333333333
  ```
### Python SparkPi

1.  Run a Python SparkPi jar. This runs a Python Spark job which calculates the value of Pi. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/pi.py).

  ```bash
        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"
  ```

  Your output should resemble:

  ```bash
        2017/08/24 15:44:20 Parsing application as Python job
        2017/08/24 15:44:23 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
        2017/08/24 15:44:23 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:44:23 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224423-0002
  ```

2.  View the standard output from your job:

  ```bash
        dcos task log --completed
  ```

  Your output should resemble:

  ```bash
        Pi is roughly 3.142715
  ```
### R Job

1.  Run an R job. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/dataframe.R).

  ```bash
        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"
  ```

  Your output should resemble:

  ```bash
        2017/08/24 15:45:21 Parsing application as R job
        2017/08/24 15:45:23 Using docker image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for drivers
        2017/08/24 15:45:23 Pulling image mesosphere/spark:2.0.0-2.2.0-1-hadoop-2.6 for executors, by default. To bypass set spark.mesos.executor.docker.forcePullImage=false
        2017/08/24 15:45:23 Setting DCOS_SPACE to /spark
        Run job succeeded. Submission id: driver-20170824224524-0003
  ```

2.  View the standard output from your job:

  ```bash
        dcos spark log --lines_count=10 driver-20170824224524-0003
  ```

  Your output should resemble:

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


## Next Steps

- To view the status of your job, run the `dcos spark webui` command and then visit the Spark cluster dispatcher UI at `http://<dcos-url>/service/spark/` .
- To view the logs, see the documentation for [Mesosphere DC/OS monitoring](https://docs.mesosphere.com/1.12/monitoring/logging/).
- To view details about your Spark job, run the `dcos task log --completed <submissionId>` command.
