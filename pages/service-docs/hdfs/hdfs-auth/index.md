---
layout: layout.pug
title: Configuring DC/OS Access for HDFS
menuWeight: 500
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  Configuring DC/OS Access for HDFS
---

This topic describes how to configure DC/OS access for HDFS. Depending on your [security mode](/docs/1.9/overview/security/security-modes/), HDFS requires [service authentication](/docs/1.9/security/service-auth/) for access to DC/OS.

| Security mode | Service Account |
navigationTitle:  Configuring DC/OS Access for HDFS
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in disabled mode, it will use the default `dcos_anonymous` account to authenticate. The `dcos_anonymous` account has the [superuser permission](/docs/1.9/security/perms-reference/#superuser).

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

**Tip:** You can use the [DC/OS Secret Store](/docs/1.9/security/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

## Permissive
From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "HDFS service account" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

## Strict
In strict mode, the service account name must match the name specified in the framework `principal`. By default, the HDFS package uses `hdfs-principal` and the service account name must match this. For more information about principals, see the [Mesos documentation](http://mesos.apache.org/documentation/latest/authorization/).

From a terminal prompt, create a new service account (`hdfs-principal`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "HDFS service account" hdfs-principal
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show hdfs-principal
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`hdfs/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and path are `hdfs`), then only the service named `hdfs` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> hdfs/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem hdfs-principal hdfs/<secret-name>
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
Use the following curl commands to rapidly provision the HDFS service account with the required permissions.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permission.

    **Important:** These commands use the default HDFS `role` value of `hdfs-role`. If you're running multiple instances of HDFS, replace the instances of `hdfs-role` with the correct name (`<name>-role`). For example, if you have a HDFS instance named `hdfs2`, you would replace each role value in the code samples to `hdfs2-role`.

    ## Permissive
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
    -d '{"description":"Allows Linux user nobody to execute tasks"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to access volumes"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id> \
    -d '{"description":"Controls the ability of <service-account-id> to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id> \
    -d '{"description":"Controls the ability of <service-account-id> to access volumes"}' \
    -H 'Content-Type: application/json'
    ```    


    ## Strict
    Run these commands with your service account name (`hdfs-principal`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role \
    -d '{"description":"Controls the ability of hdfs-role to access volumes"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:hdfs-principal \
    -d '{"description":"Controls the ability of hdfs-principal to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:hdfs-principal \
    -d '{"description":"Controls the ability of hdfs-principal to access volumes"}' \
    -H 'Content-Type: application/json'
    ```    



1.  Grant the permissions and the allowed actions to the service account using the following commands.

    ## Permissive
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id>/users/<service-account-id>/delete
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id>/users/<service-account-id>/delete
    ```

    ## Strict
    Run these commands with your service account name (`hdfs-principal`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role/users/hdfs-principal/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role/users/hdfs-principal/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role/users/hdfs-principal/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/hdfs-principal/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:hdfs-principal/users/hdfs-principal/delete
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:hdfs-principal/users/hdfs-principal/delete    
    ```

# <a name="create-json"></a>Create a Configuration File
Create a custom configuration file that will be used to install HDFS and save as `config.json`.

## Permissive
Specify the service account (`<service-account-id>`) and secret (`hdfs/<secret-name>`).

```json
{
  "service": {
    "principal": "<service-account-id>",
    "secret_name": "hdfs/<secret-name>"
  }
}
```

## Strict
Specify the service account (`hdfs-principal`), secret (`hdfs/<secret-name>`), and Linux user (`nobody`). In strict mode, HDFS cannot run under the `root` Linux account. Because HDFS defaults to running under `root`, you must override this default by specifying user `nobody`.

```json
{
  "service": {
    "principal": "hdfs-principal",
    "secret_name": "hdfs/<secret-name>",
    "user": "nobody"
  }
}
```

## <a name="install-hdfs"></a>Install HDFS
Install HDFS with this command:

```bash
dcos package install --options=config.json hdfs
```
