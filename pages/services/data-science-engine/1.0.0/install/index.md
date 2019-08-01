---
layout: layout.pug
navigationTitle: Install and Customize
excerpt: Customize your instance of DC/OS Data Science Engine
title: Install
menuWeight: -1
model: /services/data-science-engine/data.yml
render: mustache
---
This section provides detailed instructions for installing and customizing your {{ model.techName }} deployment. If you just want to get a cluster up and running for testing or evaluation, see the [Quick Start Guide](/services/data-science-engine/1.0.0/quick-start/) for instructions.

# Prerequisites

- DC/OS and DC/OS CLI installed
- Depending on your security mode], {{ model.packageName }} requires service authentication for access to DC/OS.

| Security Mode | Service Account |
|----------------|----------------|
| Disabled | Not available |
| Permissive | Optional |
| Strict | Required |

For more information about service accounts, see the [Security](/services/data-science-engine/1.0.0/security/) documentation. 

# Default installation

## From the CLI

To install the {{ model.techName }} service from the DC/OS CLI, run the following command:

```bash
dcos package install  {{ model.packageName }}
```


### View deployment

Go to the **Services >Deployments** tab of the DC/OS UI to monitor the deployment. When it has finished deploying, visit {{ model.packageName }} at `http://<dcos-url>/service/ {{ model.packageName }}/`.

<a name="ui"></a>

## From the UI

You can install {{ model.techName }} from the DC/OS Catalog. The interface provides either a graphical view of the configuration screens, or a split-window CLI interface which lets you edit or create a JSON file. The default values are pre-loaded for each field; you can change these default values as you need using either side of the split window.

If you install {{ model.techName }} via the DC/OS GUI, you must install the {{ model.packageName }} CLI as a separate step (see <a name="CLI">Installing the {{ model.packageName }} CLI</a>.


1. From the Catalog, select {{ model.techName }}.

![Catalog view]()
Figure 1 - Catalog showing {{ model.packageName }} package

1. Review the **Preinstall Notes** to make sure you understand all the options available at install time. Click **Review & Run** when you are finished.

![Preinstall notes]()
Figure 2 - Preinstall Notes

## Configuration screens

There are seven configuration tabs in the **Edit Configuration** page. The fields will either be blank or will be filled in with the default values. If you prefer to configure your service using a JSON file, click on the **JSON Editor** button in the upper right to open a "split-screen" view. Any changes made to either side of this view will be reflected in the other.

### Service 
The first configuration tab you will edit is the Service tab. In these fields, you will configure the service name, define the CPUs allocated to it, and set other fields. 

### OIDC 
The second configuration tab is the OIDC tab, where  you will configure client IDs, secrets, and other identification values.

### S3

The third configuration tab is the S3 tab, where you can define the AWS region, endpoint, and any other values required.

### Spark
The fourth configuration tab is for Spark.

### Storage
The fifth configuration tab is for Storage.

### Networking
The sixth configuration tab is for Networking.

### Environment
The seventh configuration tab is for Environment configuration.  


# Customize {{ model.packageName }} distribution

{{ model.techName }} does not support arbitrary {{ model.packageName }} distributions, but Mesosphere does provide multiple pre-built distributions, primarily used to select GPU CUDA versions. 

To use one of these distributions, select your {{ model.packageName }} distribution from here, then select the corresponding Docker image from here, then use those values to set the following configuration variables:

```json
{
 "service": {
   "docker-image": "<docker-image>"
 }
}
```

## Customize {{ model.packageName }} user

The default user for {{ model.techName}} is `nobody`. To override it set the following configuration variable:

```json
{
 "service": {
   "user": "<user>"
 }
}
```

{{ model.packageName }} runs all of its components in Docker containers. Since the Docker image contains a full Linux userspace with its own `/etc/users` file, it is possible for the user `nobody` to have a different UID inside the container than on the host system. Although user `nobody` has UID 65534 by convention on many systems, this is not always the case. As Mesos does not perform UID mapping between Linux user namespaces for a Docker containerizer, specifying a service user of `nobody` in this case will cause access failures when the container user attempts to open or execute a filesystem resource owned by a user with a different UID, preventing the service from launching. If the hosts in your cluster have a UID for `nobody` other than 65534, you will need to a provide valid UID for `nobody` in the configuration to run the service successfully. For example, on RHEL/Centos based distributions:


# Multiple installations

Depending on the number of licenses you have purchased, you can install more than one instance of the {{ model.packageName }} package. Installing multiple instances of the {{ model.packageName }} package provides basic multi-team support. Each team can be assigned different resources.

To install multiple instances of the {{ model.packageName }} package, set each `service.name` to a unique name (for example, `{{ model.packageName }}-dev`) in your JSON configuration file during installation. For example, create a JSON options file name `multiple.json`:

```json
{
 "service": {
   "name": "{{ model.packageName }}-dev"
 }
}
```

1. Install {{ model.packageName }} with the options file specified:

    ```bash
    dcos package install --options=multiple.json {{ model.packageName }}
    ```

1. To specify which instance of {{ model.packageName }} to use add `--name=<service_name>` to your CLI, for example

    ```bash
    dcos {{ model.packageName }} --name={{ model.packageName }}-dev run ...
    ```

# Installing for strict mode

If your cluster is set up for strict security then you must follow these steps to install and run {{ model.packageName }}.
## Service accounts and secrets

1. Install the `dcos-enterprise-cli` to get CLI security commands (if you have not already done so):

   ```bash
   dcos package install dcos-enterprise-cli
   ```

1. Create a 2048-bit RSA public-private key pair using the Enterprise DC/OS CLI. Create a public-private key pair and save each value into a separate file within the current directory.

   ```bash
   dcos security org service-accounts keypair <your-private-key>.pem <your-public-key>.pem
   ```

   For example:

   ```bash
   dcos security org service-accounts keypair private-key.pem public-key.pem
   ```

1. Create a new service account, `service-account-id` (for example, `{{ model.packageName }}-principal`) containing the public key,  `your-public-key.pem`.

   ```bash
   dcos security org service-accounts create -p <your-public-key>.pem -d "{{ model.packageName }} service account" <service-account>
   ```

   For example:

   ```bash
   dcos security org service-accounts create -p public-key.pem -d "{{ model.packageName }} service account" {{ model.packageName }}-principal
   ```

    In Mesos parlance, a `service-account` is called a `principal` and so we use the terms interchangeably here.

    You can verify your new service account using the following command.
    ```bash
    dcos security org service-accounts show <service-account>
    ```

1. Create a secret (for example, `{{ model.packageName }}/<secret-name>`) with your service account, `service-account`, and private key specified, `your-private-key.pem`.

    ```bash
    # permissive mode
    dcos security secrets create-sa-secret <your-private-key>.pem <service-account> {{ model.packageName }}/<secret-name>
    # strict mode
    dcos security secrets create-sa-secret --strict <private-key>.pem <service-account> {{ model.packageName }}/<secret-name>
    ```

    For example, on a strict-mode DC/OS cluster:

    ```bash
    dcos security secrets create-sa-secret --strict private-key.pem sp{{ model.packageName }}ark-principal {{ model.packageName }}/{{ model.packageName }}-secret
    ```

1. Use the `dcos security secrets list /` command to verify that the secrets were created:

   ```bash
   dcos security secrets list /
   ```

## Assigning permissions
Permissions must be created so that the {{ model.packageName }} service will be able to start {{ model.packageName }} jobs and so the jobs themselves can launch the executors that perform the work on their behalf. There are a few points to keep in mind depending on your cluster:

The {{ model.packageName }} service runs by default under the Mesos default role, which is represented by the `*` symbol. You can deploy multiple instances of {{ model.packageName }} without modifying this default. If you want to override the default {{ model.packageName }} role, you must modify these code samples accordingly. We use `{{ model.packageName }}-service-role` to designate the role used below.

Permissions can also be assigned through the GUI.

Run the following to create the required permissions for {{ model.packageName }}:
   ```bash
   dcos security org users grant <service-account> dcos:mesos:master:task:user:<user> create --description "Allows the Linux user to execute tasks"
   dcos security org users grant <service-account> dcos:mesos:master:framework:role:< {{ model.packageName }}-service-role> create --description "Allows a framework to register with the Mesos master using the Mesos default role"
   dcos security org users grant <service-account> dcos:mesos:master:task:app_id:/<service_name> create --description "Allows reading of the task state"
   ```

  Note that above the `dcos:mesos:master:task:app_id:/<service_name>` will likely be `dcos:mesos:master:task:app_id:/{{ model.packageName }}`
  For example, continuing from above:
   ```bash
   dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:task:user:nobody create --description "Allows the Linux user to execute tasks"
   dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:* create --description "Allows a framework to register with the Mesos master using the Mesos default role"
   dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:task:app_id:/{{ model.packageName }} create --description "Allows reading of the task state"

   ```

Here, we are using the service account `{{ model.packageName }}-principal` and the user `nobody`.

If you are running the {{ model.packageName }} service as `nobody` (as we are in this example) you will need to add an additional permission for Marathon:

```bash
dcos security org users grant dcos_marathon dcos:mesos:master:task:user:nobody create --description "Allow Marathon to launch containers as nobody"
```

## Install {{ model.packageName }} with necessary configuration

1. Make a configuration file with the following before installing {{ model.packageName }}:

    ```json
    cat  {{ model.packageName }}-strict-options.json
    {
    "service": {
            "service_account": "<service-account-id>",
            "user": "<user>",
            "service_account_secret": "{{ model.packageName }}/<secret_name>"
            }
    }
    ```
    A minimal example would be:
    ```json
    {
    "service": {
            "service_account": "{{ model.packageName }}-principal",
            "user": "nobody",
            "service_account_secret": "{{ model.packageName }}/{{ model.packageName }}-secret"
            }
    }
    ```

1. Then install:

    ```bash
    dcos package install {{ model.packageName }} --options={{ model.packageName }}-strict-options.json
    ```

These settings can also be set through the GUI.

# Configuring {{ model.packageName }} jobs

You must add configuration parameters to your {{ model.packageName }} jobs when submitting them.
## Running jobs in strict mode cluster

To run a job on a strict mode cluster, you must add the `principal` to the command line. For example:
```bash
dcos  {{ model.packageName }} run --verbose --submit-args=" \
--conf  {{ model.packageName }}.mesos.principal=<service-account> \
--conf  {{ model.packageName }}.mesos.containerizer=mesos \
--class org.apache. {{ model.packageName }}.examples. {{ model.packageName }}Pi http://downloads.mesosphere.com/ {{ model.packageName }}/assets/ {{ model.packageName }}-examples_2.11-2.3.2.jar 100"
```
## Running jobs as a different user
{{ model.packageName }} Mesos Dispatcher uses the same user for running {{ model.packageName }} jobs as itself and defaults to `nobody`.
If you run Dispatcher as `root` and want to submit a job as a different user e.g. `nobody`, you must provide user property in the following way.

### Universal Container Runtime
For UCR containerizer it is sufficient to provide `{{ model.packageName }}.mesos.driverEnv.{{ model.packageName }}_USER=nobody` configuration property when submitting a job:

```bash
dcos  {{ model.packageName }} run --verbose --submit-args="\
--conf  {{ model.packageName }}.mesos.driverEnv.{{ model.packageName }}_USER=nobody \
--class org.apache. {{ model.packageName }}.examples.{{ model.packageName }}Pi http://downloads.mesosphere.com/ {{ model.packageName }}/assets/ {{ model.packageName }}-examples_2.11-2.3.2.jar 100"
```

### Docker Engine
If you want to use the Docker Engine instead of the Universal Container Runtime, you must specify ` {{ model.packageName }}.mesos.executor.docker.parameters=user=nobody` in addition to ` {{ model.packageName }}.mesos.driverEnv.{{ model.packageName }}_USER=nobody` to run the Docker container as this user:

```bash
dcos  {{ model.packageName }} run --verbose --submit-args="\
--conf  {{ model.packageName }}.mesos.driverEnv.{{ model.packageName }}_USER=nobody \
--conf  {{ model.packageName }}.mesos.executor.docker.parameters=user=nobody \
--class org.apache. {{ model.packageName }}.examples.{{ model.packageName }}Pi http://downloads.mesosphere.com/ {{ model.packageName }}/assets/ {{ model.packageName }}-examples_2.11-2.3.2.jar 100"
```

If the hosts in your cluster have a UID for `nobody` other than 65534 (see Customize {{ model.packageName }} user), you will need to provide a valid UID as a parameter to Docker containerizer via `--conf  {{ model.packageName }}.mesos.executor.docker.parameters=user=UID`:

```bash
dcos  {{ model.packageName }} run --verbose --submit-args="\
--conf  {{ model.packageName }}.mesos.driverEnv.{{ model.packageName }}_USER=nobody \
--conf  {{ model.packageName }}.mesos.executor.docker.parameters=user=99 \
--class org.apache. {{ model.packageName }}.examples.{{ model.packageName }}Pi http://downloads.mesosphere.com/ {{ model.packageName }}/assets/ {{ model.packageName }}-examples_2.11-2.3.2.jar 100"
```

<p class="message--note"><strong>NOTE: </strong>The UID should typically be set to 99 when running as <t>nobody</tt> (default) on RHEL/CentOS.</p>

# Running jobs in a virtual network

To run a job in a virtual network and/or with network plugin labels assigned, you need to specify the network name and labels in submit arguments:
```bash
dcos  {{ model.packageName }} run --verbose --submit-args="\
--conf  {{ model.packageName }}.mesos.network.name=dcos \
--conf  {{ model.packageName }}.mesos.network.labels=key_1:value_1,key_2:value_2 \
--class org.apache. {{ model.packageName }}.examples.GroupByTest http://downloads.mesosphere.com/ {{ model.packageName }}/assets/ {{ model.packageName }}-examples_2.11-2.3.2.jar"
```

