---
layout: layout.pug
navigationTitle:
excerpt: Install Spark using either the web interface or the DC/OS CLI
title: Install and Customize
menuWeight: 15
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

DC/OS {{ model.techName }} is available in the Universe and can be installed by using either the GUI or the DC/OS CLI.

**Prerequisites:**

- [DC/OS and DC/OS CLI installed](https://docs.mesosphere.com/latest/installing/).
- Depending on your [security mode](https://docs.mesosphere.com/latest/security/ent/#security-modes), Spark requires service authentication for access to DC/OS. For more information:  

  | Security mode | Service Account       |
  |---------------|-----------------------|
  | Disabled      | Not available         |
  | Permissive    | Optional              |
  | Strict        | **Required**          |


# Default Installation
To install the DC/OS {{ model.techName }} service, run the following command on the DC/OS CLI. This installs the {{ model.techShortName }} DC/OS service, {{ model.techShortName }} CLI, dispatcher, and, optionally, the history server. See [Custom Installation][7] to install the history server.

```bash
dcos package install {{ model.serviceName }}
```

Go to the **Services** > **Deployments** tab of the DC/OS GUI to monitor the deployment. When it has finished deploying
, visit {{ model.techShortName }} at `http://<dcos-url>/service/{{ model.serviceName }}/`.

You can also [install {{ model.techShortName }} via the DC/OS GUI](/latest/gui/#universe).


## {{ model.techShortName }} CLI

You can install the {{ model.techShortName }} CLI with this command. This is useful if you already have a {{ model.techShortName }} cluster running, but need the {{ model.techShortName }} CLI.


**Important:** If you install {{ model.techShortName }} via the DC/OS GUI, you must install the {{ model.techShortName }} CLI as a separate step from the DC/OS CLI.

```bash
dcos package install {{ model.serviceName }} --cli
```

<a name="custom"></a>
# Custom Installation

You can customize the default configuration properties by creating a JSON options file and passing it to `dcos package install --options`. For example, to launch the Dispatcher using the Universal Container Runtime (UCR), create a file called `options.json`:

```json
{
  "service": {
    "UCR_containerizer": true
  }
}
```

Install {{ model.techShortName }} with the configuration specified in the `options.json` file:

```bash
dcos package install --options=options.json {{ model.serviceName }}
```

**Tip:** Run this command to see all configuration options:

```bash
dcos package describe {{ model.serviceName }} --config
```

## Customize {{ model.techShortName }} Distribution

DC/OS {{ model.techName }} does not support arbitrary {{ model.techShortName }} distributions, but Mesosphere does provide multiple pre-built distributions, primarily used to select Hadoop versions.  

To use one of these distributions, select your {{ model.techShortName }} distribution from [here](https://github.com/mesosphere/{{ model.serviceName }}-build/blob/master/docs/{{ model.serviceName }}-versions.md), then select the corresponding Docker image from [here](https://hub.docker.com/r/mesosphere/{{ model.serviceName }}/tags/), then use those values to set the following configuration variables:

```json
{
  "service": {
    "docker-image": "<docker-image>"
  }
}
```

# Minimal Installation

For development purposes, use [dcos-vagrant][16] to install {{ model.techShortName }} on a local DC/OS cluster.

1. Install a minimal DC/OS Vagrant according to the instructions [here][16].

1. Install {{ model.techShortName }}:

   ```bash
   dcos package install {{ model.serviceName }}
   ```

1. Run a simple Job:

   ```bash
   dcos {{ model.serviceName }} run --class org.apache.{{ model.serviceName }}.examples.SparkPi http://downloads.mesosphere.com.s3.amazonaws.com/assets/{{ model.serviceName }}/{{ model.serviceName }}-examples_2.10-1.5.0.jar"
   ```

**Note:** A limited resource environment such as DC/OS Vagrant restricts some of the features available in DC/OS {{ model.techName }}.  For example, you must have enough resources to start up a 5-agent cluster, otherwise you will not be able to install DC/OS HDFS an enable the history server.

Also, a limited resource environment can restrict how you size your executors, for example with `{{ model.serviceName }}.executor.memory`.


# Multiple Installations

Installing multiple instances of the DC/OS {{ model.techName }} package provides basic multi-team support. Each dispatcher displays only the jobs submitted to it by a given team, and each team can be assigned different resources.

To install multiple instances of the DC/OS {{ model.techName }} package, set each `service.name` to a unique name (e.g.: `{{ model.serviceName }}-dev`) in your JSON configuration file during installation. For example, create a JSON options file name `multiple.json`:

```json
{
  "service": {
    "name": "{{ model.serviceName }}-dev"
  }
}
```

Install Spark with the options file specified:

```bash
dcos package install --options=multiple.json {{ model.serviceName }}
```

To specify which instance of Spark to use add `--name=<service_name>` to your CLI, for example

```bash
$ dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev run ...
```
<a name="strict_setting"></a>
# Installation for Strict mode (setting service authentication)

If your cluster is set up for [strict](https://docs.mesosphere.com/latest/security/ent/#strict) security then you will need to follow these steps to install and run Spark.

## Service Accounts and Secrets

1.  Install the `dcos-enterprise-cli` to get CLI security commands (if you haven't already):

    ```bash
    $ dcos package install dcos-enterprise-cli
    ```

1.  Create a key pair, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI. Create a
    public-private key pair and save each value into a separate file within the current directory.

    ```bash
    $ dcos security org service-accounts keypair <your-private-key>.pem <your-public-key>.pem
    ```

    For example:

    ```bash
    dcos security org service-accounts keypair private-key.pem public-key.pem
    ```

1.  Create a new service account, `service-account-id` (e.g. `{{ model.serviceName }}-principal`) containing the public key,
    `your-public-key.pem`.

    ```bash
    $ dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" <service-account>
    ```

    For example:

    ```bash
    dcos security org service-accounts create -p public-key.pem -d "Spark service account" {{ model.serviceName }}-principal

    ```


    In the Mesos parlance a `service-account` is called a `principal` and so we use the terms interchangeably here.


    **Note** You can verify your new service account using the following command.

    ```bash
    $ dcos security org service-accounts show <service-account>
    ```

1.  Create a secret (e.g. `{{ model.serviceName }}/<secret-name>`) with your service account, `service-account`, and private key specified, `your-private-key.pem`.

    ```bash
    # permissive mode
    $ dcos security secrets create-sa-secret <your-private-key>.pem <service-account> {{ model.serviceName }}/<secret-name>
    # strict mode
    $ dcos security secrets create-sa-secret --strict <private-key>.pem <service-account> {{ model.serviceName }}/<secret-name>
    ```

    For example, on a strict-mode DC/OS cluster:

    ```bash
    dcos security secrets create-sa-secret --strict private-key.pem {{ model.serviceName }}-principal {{ model.serviceName }}/{{ model.serviceName }}-secret
    ```

    **Note** Use the `dcos security secrets list /` command to verify that the secrets were created:

    ```bash
    $ dcos security secrets list /
    ```

## Assigning permissions
Permissions must be created so that the Spark service will be able to start Spark jobs and so the jobs themselves can launch the executors that perform the work on their behalf. There are a few points to keep in mind depending on your cluster:

*   RHEL/CentOS users cannot currently run Spark in strict mode as user `nobody`, but must run as user `root`. This is due to how accounts are mapped to UIDs. CoreOS users are unaffected, and can run as user `nobody`. We designate the user as `{{ model.serviceName }}-user` below.

*   Spark runs by default under the Mesos default role, which is represented by the `*` symbol. You can deploy multiple instances of Spark without modifying this default. If you want to override the default Spark role, you must modify these code samples accordingly. We use `{{ model.serviceName }}-service-role` to designate the role used below.

Permissions can also be assigned through the UI.

1.  Run the following to create the required permissions for Spark:
    ```bash
    $ dcos security org users grant <service-account> dcos:mesos:master:task:user:<user> create --description "Allows the Linux user to execute tasks"
    $ dcos security org users grant <service-account> dcos:mesos:master:framework:role:<{{ model.serviceName }}-service-role> create --description "Allows a framework to register with the Mesos master using the Mesos default role"
    $ dcos security org users grant <service-account> dcos:mesos:master:task:app_id:/<service_name> create --description "Allows reading of the task state"
    ```

    Note that above the `dcos:mesos:master:task:app_id:/<service_name>` will likely be `dcos:mesos:master:task:app_id:/{{ model.serviceName }}`

    For example, continuing from above:

    ```bash
    dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:task:user:root create --description "Allows the Linux user to execute tasks"
    dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:* create --description "Allows a framework to register with the Mesos master using the Mesos default role"
    dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:task:app_id:/{{ model.serviceName }} create --description "Allows reading of the task state"

    ```

    Here, we are using the service account `{{ model.serviceName }}-principal` and the user `root`.

1.  If you are running the {{ model.techName }} service as `root` (as we are in this example) you will need to add an additional permission for Marathon:

    ```bash
    dcos security org users grant dcos_marathon dcos:mesos:master:task:user:root create --description "Allow Marathon to launch containers as root"
    ```

## Install Spark with necessary configuration

1.  Make a configuration file with the following before installing Spark, these settings can also be set through the UI:
    ```json
    $ cat {{ model.serviceName }}-strict-options.json
    {
    "service": {
            "service_account": "<service-account-id>",
            "user": "<user>",
            "service_account_secret": "{{ model.serviceName }}/<secret_name>"
            }
    }
    ```

    A minimal example would be:

    ```json
    {
    "service": {
            "service_account": "{{ model.serviceName }}-principal",
            "user": "root",
            "service_account_secret": "{{ model.serviceName }}/{{ model.serviceName }}-secret"
            }
    }
    ```

    Then install:

    ```bash
    $ dcos package install {{ model.serviceName }} --options={{ model.serviceName }}-strict-options.json
    ```


## Add necessary configuration to your Spark jobs when submitting them

To run a job on a strict mode cluster, you must add the `principal` to the command line. For example, if you want to use the [Docker Engine](/latest/deploying-services/containerizers/docker-containerizer/) instead of the [Universal Container Runtime](/latest/deploying-services/containerizers/ucr/), you must specify the user through the `SPARK_USER` environment variable:







```bash
$ dcos {{ model.serviceName }} run --verbose --submit-args=" \
--conf {{ model.serviceName }}.mesos.principal=<service-account> \
--conf {{ model.serviceName }}.mesos.containerizer=mesos \
--class org.apache.{{ model.serviceName }}.examples.SparkPi http://downloads.mesosphere.com/{{ model.serviceName }}/assets/{{ model.serviceName }}-examples_2.11-2.0.1.jar 100"
```




 [7]: #custom
 [16]: https://github.com/mesosphere/dcos-vagrant
