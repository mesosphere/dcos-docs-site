---
layout: layout.pug
navigationTitle: Install and Customize
excerpt: Installing and customizing your DC/OS Apache Spark service
title: Install and Customize
menuWeight: 2
model: /services/spark/data.yml
render: mustache
featureMaturity:
---

{{ model.techShortName }} is available in the Universe and can be installed by using either the DC/OS web interface or the DC/OS CLI.

**Prerequisites**

- [DC/OS and DC/OS CLI installed](/1.12/installing/)
- Depending on your [security mode](/1.12/security/ent/), {{ model.techShortName }} requires service authentication for access to DC/OS.

  | Security mode | Service account       |
  |---------------|-----------------------|
  | Disabled      | Not available         |
  | Permissive    | Optional              |
  | Strict        | **Required**          |

For more information about service accounts, see [Security](/1.12/security/):  

# Default installation
To install the DC/OS {{ model.techName }} service, run the following command on the DC/OS CLI. This installs the {{ model.techShortName }} DC/OS service, {{ model.techShortName }} CLI, dispatcher, and, optionally, the history server. See [Custom installation][7] to install the history server.

```bash
dcos package install spark
```

Go to the **Services** > **Deployments** tab of the DC/OS GUI to monitor the deployment. When it has finished deploying, visit {{ model.techShortName }} at `http://<dcos-url>/service/spark/`.

You can also [install {{ model.techShortName }} via the DC/OS GUI](/1.12/installing/).

## {{ model.techShortName }} CLI
You can install the {{ model.techShortName }} CLI with this command. This is useful if you already have a {{ model.techShortName }} cluster running, but need the {{ model.techShortName }} CLI.

<p class="message--important"><strong>IMPORTANT: </strong>If you install {{ model.techShortName }} via the DC/OS GUI, you must install the {{ model.techShortName }} CLI as a separate step from the DC/OS CLI.</p>

```bash
dcos package install spark --cli
```

<a name="custom"></a>

# Custom installation

You can customize the default configuration properties by creating a JSON options file and passing it to `dcos package install --options`. For example, to launch the Dispatcher using the Universal Container Runtime (UCR), create a file called `options.json`.

To customie the installation:
1. Create the `options.json` configuration file.

  ```json
  {
    "service": {
      "UCR_containerizer": true
    }
  }
  ```

1. Install {{ model.techShortName }} with the configuration specified in the `options.json` file:

  ```bash
  dcos package install --options=options.json spark
  ```

1. Run this command to see all configuration options:

  ```bash
  dcos package describe spark --config
  ```
<a name="custom-dist"></a>
## Customize {{ model.techShortName }} distribution

DC/OS {{ model.techName }} does not support arbitrary {{ model.techShortName }} distributions, but Mesosphere does provide multiple pre-built distributions, primarily used to select Hadoop versions.  

To use one of these distributions, select your {{ model.techShortName }} distribution from [here](https://github.com/mesosphere/spark-build/blob/master/docs/spark-versions.md), then select the corresponding Docker image from [here](https://hub.docker.com/r/mesosphere/spark/tags/), then use those values to set the following configuration variables:

```json
{
  "service": {
    "docker-image": "<docker-image>"
  }
}
```

# Minimal installation

For development purposes, use [dcos-vagrant][16] to install {{ model.techShortName }} on a local DC/OS cluster.

1. Install DC/OS Vagrant:

	Install a minimal DC/OS Vagrant according to the instructions [here][16].

1. Install {{ model.techShortName }}:

   ```bash
   dcos package install spark
   ```

1. Run a simple job:

   ```bash
   dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 30"
   ```

<p class="message--important"><strong>IMPORTANT: </strong>A limited resource environment such as DC/OS Vagrant restricts some of the features available in DC/OS {{ model.techName }}.  For example, you must have enough resources to start up a 5-agent cluster, otherwise you will not be able to install DC/OS HDFS an enable the history server.</p>

Also, a limited resource environment can restrict how you size your executors, for example with `spark.executor.memory`.

# Multiple installations

Installing multiple instances of the DC/OS {{ model.techName }} package provides basic multi-team support. Each dispatcher displays only the jobs submitted to it by a given team, and each team can be assigned different resources.

To install multiple instances of the DC/OS {{ model.techName }} package, set each `service.name` to a unique name (e.g.: `spark-dev`) in your JSON configuration file during installation. For example, create a JSON options file name `multiple.json`:

```json
{
  "service": {
    "name": "spark-dev"
  }
}
```

Install {{ model.techShortName }} with the options file specified:

```bash
dcos package install --options=multiple.json spark
```

To specify which instance of {{ model.techShortName }} to use add `--name=<service_name>` to your CLI, for example

```bash
$ dcos spark --name=spark-dev run ...
```

# Installation for strict mode

If your cluster is set up for [strict](/1.12/security/ent/#strict) security then you will follow these steps to install and run {{ model.techShortName }}.

## Service accounts and secrets

1.  Install the `dcos-enterprise-cli` to get CLI security commands (if you have not already done so):

    ```bash
    $ dcos package install dcos-enterprise-cli
    ```

1.  Create a 2048-bit RSA public-private key pair using the Enterprise DC/OS CLI. Create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    $ dcos security org service-accounts keypair <your-private-key>.pem <your-public-key>.pem
    ```

    For example:

    ```bash
    dcos security org service-accounts keypair private-key.pem public-key.pem
    ```

1.  Create a new service account, `service-account-id` (for example, `spark-principal`) containing the public key,
    `your-public-key.pem`.

    ```bash
    $ dcos security org service-accounts create -p <your-public-key>.pem -d "{{ model.techShortName }} service account" <service-account>
    ```

    For example:

    ```bash
    dcos security org service-accounts create -p public-key.pem -d "{{ model.techShortName }} service account" spark-principal
    ```

    In Mesos parlance, a `service-account` is called a `principal` and so we use the terms interchangeably here.

    You can verify your new service account using the following command.

    ```bash
    $ dcos security org service-accounts show <service-account>
    ```

1.  Create a secret (for example, `spark/<secret-name>`) with your service account, `service-account`, and private key specified, `your-private-key.pem`.

    ```bash
    # permissive mode
    $ dcos security secrets create-sa-secret <your-private-key>.pem <service-account> spark/<secret-name>
    # strict mode
    $ dcos security secrets create-sa-secret --strict <private-key>.pem <service-account> spark/<secret-name>
    ```

    For example, on a strict-mode DC/OS cluster:

    ```bash
    dcos security secrets create-sa-secret --strict private-key.pem spark-principal spark/spark-secret
    ```

1. Use the `dcos security secrets list /` command to verify that the secrets were created:

    ```bash
    $ dcos security secrets list /
    ```

## Assigning permissions
Permissions must be created so that the {{ model.techShortName }} service will be able to start {{ model.techShortName }} jobs and so the jobs themselves can launch the executors that perform the work on their behalf. There are a few points to keep in mind depending on your cluster:

*   RHEL/CentOS users cannot currently run {{ model.techShortName }} in strict mode as user `nobody`, but must run as user `root`. This is due to how accounts are mapped to UIDs. CoreOS users are unaffected, and can run as user `nobody`. We designate the user as `spark-user` below.

*   {{ model.techShortName }} runs by default under the Mesos default role, which is represented by the `*` symbol. You can deploy multiple instances of {{ model.techShortName }} without modifying this default. If you want to override the default {{ model.techShortName }} role, you must modify these code samples accordingly. We use `spark-service-role` to designate the role used below.

Permissions can also be assigned through the UI.

1.  Run the following to create the required permissions for {{ model.techShortName }}:
    ```bash
    $ dcos security org users grant <service-account> dcos:mesos:master:task:user:<user> create --description "Allows the Linux user to execute tasks"
    $ dcos security org users grant <service-account> dcos:mesos:master:framework:role:<spark-service-role> create --description "Allows a framework to register with the Mesos master using the Mesos default role"
    $ dcos security org users grant <service-account> dcos:mesos:master:task:app_id:/<service_name> create --description "Allows reading of the task state"
    ```

    Note that above the `dcos:mesos:master:task:app_id:/<service_name>` will likely be `dcos:mesos:master:task:app_id:/spark`

    For example, continuing from above:

    ```bash
    dcos security org users grant spark-principal dcos:mesos:master:task:user:root create --description "Allows the Linux user to execute tasks"
    dcos security org users grant spark-principal dcos:mesos:master:framework:role:* create --description "Allows a framework to register with the Mesos master using the Mesos default role"
    dcos security org users grant spark-principal dcos:mesos:master:task:app_id:/spark create --description "Allows reading of the task state"

    ```

    Here, we are using the service account `spark-principal` and the user `root`.

1.  If you are running the {{ model.techShortName }} service as `root` (as we are in this example) you will need to add an additional
    permission for Marathon:

    ```bash
    dcos security org users grant dcos_marathon dcos:mesos:master:task:user:root create --description "Allow Marathon to launch containers as root"
    ```

## Install {{ model.techShortName }} with necessary configuration

1.  Make a configuration file with the following before installing {{ model.techShortName }}, these settings can also be set through the UI:
    ```json
    $ cat spark-strict-options.json
    {
    "service": {
            "service_account": "<service-account-id>",
            "user": "<user>",
            "service_account_secret": "spark/<secret_name>"
            }
    }
    ```

    A minimal example would be:

    ```json
    {
    "service": {
            "service_account": "spark-principal",
            "user": "root",
            "service_account_secret": "spark/spark-secret"
            }
    }
    ```

    Then install:

    ```bash
    $ dcos package install spark --options=spark-strict-options.json
    ```

## Add necessary configuration

You must add configuration parameters to your {{ model.techShortName }} jobs when submitting them.

To run a job on a strict mode cluster, you must add the `principal` to the command line. For example:

```bash
$ dcos spark run --verbose --submit-args=" \
--conf spark.mesos.principal=<service-account> \
--conf spark.mesos.containerizer=mesos \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```

If you want to use the [Docker Engine](/1.10/deploying-services/containerizers/docker-containerizer/) instead of the [Universal Container Runtime](/1.10/deploying-services/containerizers/ucr/), you must specify the user through the `SPARK_USER` environment variable:

```bash
$ dcos spark run --verbose --submit-args="\
--conf spark.mesos.principal=<service-account> \
--conf spark.mesos.driverEnv.SPARK_USER=nobody \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```

 [7]: #custom
 [16]: https://github.com/mesosphere/dcos-vagrant
