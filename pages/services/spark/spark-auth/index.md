---
layout: layout.pug
title: Configuring DC/OS Access for Spark
menuWeight: 40
excerpt:
featureMaturity:
enterprise: true
---

This topic describes how to configure DC/OS access for Spark. Depending on your [security mode](/docs/1.9/overview/security/security-modes/), Spark requires [service authentication](/docs/1.9/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in disabled mode, it will use the default `dcos_anonymous` account to authenticate. The `dcos_anonymous` account has the [superuser permission](/docs/1.9/security/ent/perms-reference/#superuser).

**Prerequisites:**

- [DC/OS CLI installed](/docs/1.9/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/docs/1.9/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/docs/1.9/overview/security/security-modes/) is `permissive` or `strict`, you must [get the root cert](/docs/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created uses the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**Tip:** You can use the [DC/OS Secret Store](/docs/1.9/security/ent/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

## Permissive
From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

## Strict
In strict mode, the service account name must match the name specified in the framework `principal`. By default, the Spark package uses `spark-principal` and the service account name must match this. For more information about principals, see the [Mesos documentation](http://mesos.apache.org/documentation/latest/authorization/).

From a terminal prompt, create a new service account (`spark-principal`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" spark-principal
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show spark-principal
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`spark/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and path are `spark`), then only the service named `spark` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> spark/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem spark-principal spark/<secret-name>
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
Use the following curl commands to rapidly provision the Spark service account with the required permissions.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permission.

    **Important:** Spark does not use reservations or volumes. It runs by default under the [Mesos default role](http://mesos.apache.org/documentation/latest/roles/), which is represented by the `*` symbol. You can deploy multiple instances of Spark without modifying this default. If you want to override the default Spark role, you must modify these code samples accordingly.

    ## Permissive

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root \
    -d '{"description":"Allows Linux user root to execute tasks"}' \
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

    ## Strict

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root \
    -d '{"description":"Allows Linux user root to execute tasks"}' \
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


1.  Grant the permissions and the allowed actions to the service account using the following commands.

    ## Permissive
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/spark-principal/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark/users/spark-principal/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root/users/spark-principal/create

   ```

   ## Strict
   Run these commands with your service account name (`spark-principal`) specified.
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/spark-principal/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark/users/spark-principal/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root/users/spark-principal/create
   ```   


   **Note:** At this time, Spark tasks other than the dispatcher must run under the `root` user.


# <a name="create-json"></a>Create a Configuration File
Create a custom configuration file that will be used to install Spark and save as `config.json`.

## Permissive
Specify the service account (`<service-account-id>`) and secret (`spark/<secret-name>`).

```json
{
    "service": {
            "service_account": "<service-account-id>",
            "user": "root",
            "service_account_secret": "spark/<secret_name>"
    }
}
```

## Strict
Specify the service account (`spark-principal`), secret (`spark/<secret-name>`), and Linux user (`nobody`). In strict mode, Spark can run under the `root` Linux account, but it is recommended that you override this default by specifying user `nobody`. This ensures that the dispatcher runs under the `nobody` account.

```json
{
    "service": {
            "service_account": "<service-account-id>",
            "user": "root",
            "service_account_secret": "spark/<secret_name>"
    }
}
```

## <a name="install-spark"></a>Install Spark

**Note** The Spark Mesos Dispatcher runs as `root`, so Marathon must be given permissions if you are running a strict mode cluster. Use the following command to give Marathon the appropriate permissions:

```bash
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root/users/dcos_marathon/create
``` 

Now, Spark can be installed with this command:


```bash
dcos package install --options=config.json spark
```
