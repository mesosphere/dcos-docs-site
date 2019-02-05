---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 0
excerpt: Install Spark using either the web interface or the DC/OS CLI
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/spark-build -->


Spark is available in the Universe and can be installed by using either the GUI or the DC/OS CLI.

**Prerequisites:**

- [DC/OS and DC/OS CLI installed](/1.9/installing/).
- Depending on your [security mode](/1.9/security/ent/#security-modes/), Spark requires service authentication for access to DC/OS. For more information, see [Configuring DC/OS Access for Spark](/services/spark/spark-auth/).

  | Security mode | Service Account |
  |---------------|-----------------------|
  | Disabled      | Not available   |
  | Permissive    | Optional   |
  | Strict        | Required |

# Default Installation
To install the DC/OS Apache Spark service, run the following command on the DC/OS CLI. This installs the Spark DC/OS service, Spark CLI, dispatcher, and, optionally, the history server. See [Custom Installation][7] to install the history server.

```bash
dcos package install spark
```

Go to the **Services** > **Deployments** tab of the DC/OS GUI to monitor the deployment. When it has finished deploying , visit Spark at `http://<dcos-url>/service/spark/`.

You can also [install Spark via the DC/OS GUI](/1.9/gui/universe/).


## Spark CLI
You can install the Spark CLI with this command. This is useful if you already have a Spark cluster running, but need the Spark CLI.

**Important:** If you install Spark via the DC/OS GUI, you must install the Spark CLI as a separate step from the DC/OS CLI.

```bash
dcos package install spark --cli
```

<a name="custom"></a>

# Custom Installation

You can customize the default configuration properties by creating a JSON options file and passing it to `dcos package install --options`. For example, to install the history server, create a file called `options.json`:

```json
{
  "history-server": {
    "enabled": true
  }
}
```

Install Spark with the  configuration specified in the `options.json` file:

```bash
dcos package install --options=options.json spark
```

**Tip:** Run this command to see all configuration options:

```bash
dcos package describe spark --config
```

## Customize Spark Distribution

DC/OS Apache Spark does not support arbitrary Spark distributions, but Mesosphere does provide multiple pre-built distributions, primarily used to select Hadoop versions.  

To use one of these distributions, select your Spark distribution from [here](https://github.com/mesosphere/spark-build/blob/master/docs/spark-versions.md), then select the corresponding Docker image from [here](https://hub.docker.com/r/mesosphere/spark/tags/), then use those values to set the following configuration variables:

```json
{
  "service": {
    "spark-dist-uri": "<spark-dist-uri>",
    "docker-image": "<docker-image>"
  }
}
```

# Minimal Installation

For development purposes, you can install Spark on a local DC/OS cluster. For this, you can use [dcos-vagrant][16].

1. Install a minimal DC/OS Vagrant according to the instructions [here][16].

1. Install Spark:

   ```bash
   dcos package install spark
   ```

1. Run a simple Job:

   ```bash
   dcos spark run --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com.s3.amazonaws.com/assets/spark/spark-examples_2.10-1.5.0.jar"
   ```

**Note:** A limited resource environment such as DC/OS Vagrant restricts some of the features available in DC/OS Apache Spark.  For example, you must have enough resources to start up a 5-agent cluster, otherwise you will not be able to install DC/OS HDFS an enable the history server.

Also, a limited resource environment can restrict how you size your executors, for example with `spark.executor.memory`.


# Multiple Installations

Installing multiple instances of the DC/OS Apache Spark package provides basic multi-team support. Each dispatcher displays only the jobs submitted to it by a given team, and each team can be assigned different resources.

To install multiple instances of the DC/OS Apache Spark package, set each `service.name` to a unique name (e.g.: `spark-dev`) in your JSON configuration file during installation. For example, create a JSON options file name `multiple.json`:

```json
{
  "service": {
    "name": "spark-dev"
  }
}
```

Install Spark with the options file specified:

```bash
dcos package install --options=multiple.json spark
```

Alternatively, you can specify a Spark instance directly from the CLI. For example:

```bash
dcos config set spark.app_id spark-dev
```

 [7]: #custom
 [16]: https://github.com/mesosphere/dcos-vagrant
