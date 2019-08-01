---
layout: layout.pug
title: Configuring DC/OS Access for Spark
menuWeight: 1010
excerpt:
featureMaturity:
enterprise: true
---
# Versions

In Spark 2.3.1-2.2.1-2 and later, these topics have been divided up among the Getting Started and Security sections. Previous versions will still need the information below.

# Configuring DC/OS Access

This topic describes how to configure DC/OS access for Spark. Depending on your [security mode](/mesosphere/dcos/1.12/security/ent/#security-modes/), Spark requires [service authentication](/mesosphere/dcos/1.12/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in `permissive` mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the [superuser permission](/mesosphere/dcos/1.12/security/ent/perms-reference/#superuser).

## Prerequisites

- [DC/OS CLI installed](/mesosphere/dcos/1.12/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/mesosphere/dcos/1.12/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/mesosphere/dcos/1.12/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/mesosphere/dcos/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.

<a name="SetPermsOutsideCluster"></a>

## Set permissions 
You must set the following permissions if you want to execute a Spark job (`dcos spark run`) from outside of the DC/OS cluster:

 ```
 dcos:adminrouter:service:marathon full 
 dcos:adminrouter:service:spark full 
 dcos:service:marathon:marathon:services:/spark read 
 ```

Replace `spark` when setting these permissions with the appropriate service name if you are not using the default service name.

<a name="create-a-keypair"></a>

# Create a key pair
In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI (install with `dcos package install dcos-enterprise-cli` if you haven't already).

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

<p class="message--note"><strong>NOTE: </strong>You can use the <a href="https://docs.mesosphere.com/1.12/security/ent/secrets/">DC/OS Secret Store</a> to secure the key pair.</p>

<a name="create-a-service-account"></a>

# Create a service account

From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" <service-account-id>
```

Use the following command to verify your new service account.

```bash
dcos security org service-accounts show <service-account-id>
```

<a name="create-an-sa-secret"></a>

# Create a secret
Create a secret (`spark/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

<p class="message--note"><strong>NOTE: </strong>If you store your secret in a path that matches the service name (for example, the service name and secret path are both `spark`), then only the service named `spark` can access the secret.</p>

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> spark/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> spark/<secret-name>
```


Use the following command to list the secrets.

```bash
dcos security secrets list /
```

<a name="give-perms"></a>

# Create and assign permissions
Use the following curl commands to rapidly provision the Spark service account with the required permissions. This can also be done through the UI.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permissions and then assign them. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can consider this as a confirmation and continue to the next command.

1.  Create the permissions. Some of these permissions may exist already.

<p class="message--important"><strong>IMPORTANT: </strong>Spark runs by default under the <a href="http://mesos.apache.org/documentation/latest/roles/">Mesos default role</a>, which is represented by the `*` symbol. You can deploy multiple instances of Spark without modifying this default.</p>

If you want to override the default Spark role, you must modify these code samples accordingly.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
    -d '{"description":"Allows Linux user nobody to execute tasks"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* \
    -d '{"description":"Allows a framework to register with the Mesos master using the Mesos default role"}' \
    -H 'Content-Type: application/json'
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark" \
    -d '{"description":"Allow to read the task state"}' \
    -H 'Content-Type: application/json'

    ```

<p class="message--warning"><strong>WARNING: </strong>If these commands return a `307 Temporary Redirect` error it can be because your cluster url (`dcos config show core.dcos_url`) is not set as Hyper Text Transfer Protocol Secure (`https://`).</p>

1.  Grant the permissions and the allowed actions to the service account using the following commands.

    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    ```

If you are setting permissions to execute Spark jobs from outside of the DC/OS cluster, see [Set permissions for jobs running outside of the cluster](#SetPermsOutsideCluster).

<a name="create-json"></a>

# Create a configuration file
Create a custom configuration file that will be used to install Spark and save as `config.json`.

Specify the service account (`<service-account-id>`) and secret (`spark/<secret-name>`).

```json
{
    "service": {
            "service_account": "<service-account-id>",
            "user": "nobody",
            "service_account_secret": "spark/<secret_name>"
    }
}
```

<a name="install-spark"></a>

## Install Spark

Now, Spark can be installed with this command:

```bash
dcos package install --options=config.json spark
```

<p class="message--note"><strong>NOTE: </strong>You can install the Spark Mesos Dispatcher to run as `root` by substituting `root` for `nobody` above. If you are running a strict mode cluster, you must give Marathon the necessary permissions to launch the Dispatcher task.</p>

Use the following command to give Marathon the appropriate permissions.

```bash
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root/users/dcos_marathon/create
```

<a name="Run a Job"></a>

## Run Spark jobs

To run a job on a strict mode cluster, you must add the `principal` to the command line. 

For example:
```bash
dcos spark run --verbose --submit-args=" \
--conf spark.mesos.principal=spark-principal \
--conf spark.mesos.containerizer=mesos \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```

If you want to use the [Docker Engine](/mesosphere/dcos/1.10/deploying-services/containerizers/docker-containerizer/) instead of the [Universal Container Runtime](/mesosphere/dcos/1.10/deploying-services/containerizers/ucr/), you must specify the user through the `SPARK_USER` environment variable:

```bash
dcos spark run --verbose --submit-args="\
--conf spark.mesos.principal=spark-principal \
--conf spark.mesos.driverEnv.SPARK_USER=nobody \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```
