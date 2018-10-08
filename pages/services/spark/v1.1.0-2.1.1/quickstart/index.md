---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 1
excerpt: Get up and running with Spark
featureMaturity:
enterprise: false
---

This tutorial will get you up and running in minutes with Spark. You will install the DC/OS Apache Spark service.

**Prerequisites:**

-  [DC/OS and DC/OS CLI installed](/1.9/installing/) with a minimum of three agent nodes with eight
GB of memory and ten GB of disk available on each agent.
-  Depending on your [security mode](/1.9/security/ent/#security-modes/), Spark requires
service authentication for access to DC/OS. For more information, see [Configuring DC/OS Access for
Spark](/services/spark/spark-auth/).

   | Security mode | Service Account |
   |---------------|-----------------------|
   | Disabled      | Not available   |
   | Permissive    | Optional   |
   | Strict    | Required |


1.  Install the Spark package. This may take a few minutes. This installs the Spark DC/OS service, Spark CLI, dispatcher, and,
optionally, the history server. See [Custom Installation](/services/spark/v1.0.9-2.1.0-1/install/#custom) to install the
history server.

```bash
dcos package install spark
```

Your output should resemble:

```bash
    Installing Marathon app for package [spark] version [1.1.0-2.1.1]
    Installing CLI subcommand for package [spark] version [1.1.0-2.1.1]
    New command available: dcos spark
    DC/OS Spark is being installed!

    	Documentation: /services/spark/
    	Issues: /support/
```

**Note:**  You can view the status of your Spark installation from the DC/OS GUI **Services** tab.

![Verify spark installation](/services/spark/v1.1.0-2.1.1/img/spark-gui-install.png)

Figure 1. Services tab showing Spark

2. Install the Spark CLI

    -  Type `dcos spark` to view the Spark CLI options.
    -  You can install the Spark CLI with this command:

    ```bash
    dcos package install spark --cli
    ```

## Sample jobs

### SparkPi

1.  Run the sample SparkPi jar for DC/OS. This runs a Spark job which calculates the value of Pi. You can view the example source [here](https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar). Use the `dcos spark run` command to run it.


```bash
    dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 30"
```

   Your output should resemble:

```bash
    Spark distribution spark-2.1.1-bin-2.6 not found locally.
    It looks like this is your first time running Spark!
    Downloading https://downloads.mesosphere.com/spark/assets/spark-2.1.1-bin-2.6.tgz...
    Extracting spark distribution /Users/username/.dcos/spark/dist/spark-2.1.1-bin-2.6.tgz...
    Successfully fetched spark distribution https://downloads.mesosphere.com/spark/assets/spark-2.1.1-bin-2.6.tgz!
    127.0.0.1 - - [16/Jun/2017 14:29:57] "POST /v1/submissions/create HTTP/1.1" 200 -
    127.0.0.1 - - [16/Jun/2017 14:29:57] "GET /v1/submissions/status/driver-20170616212957-0001 HTTP/1.1" 200 -
    Run job succeeded. Submission id: driver-20170616212957-0001
```

2.  Use the `dcos task log` command to view the standard output from your job:

```bash
    dcos task log --completed
```

  Your output should resemble:

```bash
    Registered docker executor on 10.0.2.199
    Starting task driver-20170616212957-0001
    Pi is roughly 3.141853333333333
```
### Python SparkPi

1.  Run a Python SparkPi jar. This runs a Python Spark job which calculates the value of Pi. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/pi.py). Use the `dcos spark run` command to run it.


```bash
    dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"
```

Your output should resemble:

```bash
    127.0.0.1 - - [16/Jun/2017 14:39:17] "POST /v1/submissions/create HTTP/1.1" 200 -
    127.0.0.1 - - [16/Jun/2017 14:39:17] "GET /v1/submissions/status/driver-20170616213917-0002 HTTP/1.1" 200 -
    Run job succeeded. Submission id: driver-20170616213917-0002
```

2.  Use the `dcos task log` command to view the standard output from your job:  

```bash
    dcos task log --completed
```

Your output should resemble:

```bash
    Registered docker executor on 10.0.2.199
    Starting task driver-20170616213917-0002
    Pi is roughly 3.142211
```

## R Job

1.  Run an R job. You can view the example source [here](https://downloads.mesosphere.com/spark/examples/dataframe.R). Use the `dcos task log` command to view the standard output from your job:


```bash
    dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"
```

Your output should resemble:

```bash
    127.0.0.1 - - [16/Jun/2017 14:39:56] "POST /v1/submissions/create HTTP/1.1" 200 -
    127.0.0.1 - - [16/Jun/2017 14:39:56] "GET /v1/submissions/status/driver-20170616213956-0003 HTTP/1.1" 200 -
    Run job succeeded. Submission id: driver-20170616213956-0003
```

2.  View the standard output from your job:

```bash
    dcos task log --completed
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

- To view the status of your job, run the `dcos spark webui` command and then visit the Spark cluster dispatcher UI at
`http://<dcos-url>/service/spark/` .
- To view the logs, the Mesos UI at `http://<your-master-ip>/mesos`.
- To view details about your Spark job, run the `dcos task log --completed <submissionId>` command.
