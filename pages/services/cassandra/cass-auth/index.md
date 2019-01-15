---
layout: layout.pug
title: Configuring DC/OS Access for Cassandra
menuWeight: 10
excerpt: Configuring DC/OS Access for versions before 2.3.0-3.0.16
featureMaturity:
enterprise: true
---
# Versions

In Cassandra 2.3.0-3.0.16 and later, these topics have been divided up among the Getting Started and Security sections. Previous versions will still need the information below.

# Configuring DC/OS Access

This topic describes how to configure DC/OS access for Cassandra. Depending on your [security mode](/1.9/security/ent/#security-modes/), Cassandra requires [service authentication](/1.10/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the [superuser permission](/1.11/security/ent/perms-reference/#superuser).

**Prerequisites:**

- [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/1.9/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/1.9/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created uses the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**Tip:** You can use the [DC/OS Secret Store](/1.10/security/ent/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Cassandra service account" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`cassandra/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and secret path are `cassandra`), then only the service named `cassandra` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> cassandra/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> cassandra/<secret-name>
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
Use the following curl commands to rapidly provision the Cassandra service account with the required permissions.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permissions and then assign them. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permission.

    **Important:** These commands use the default Cassandra `role` value of `cassandra-role`. If you're running multiple instances of Cassandra, replace the instances of `cassandra-role` with the correct name (`<name>-role`). For example, if you have a Cassandra instance named `cassandra2`, you would replace each role value in the code samples to `cassandra2-role`.

    ## Permissive
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
    -d '{"description":"Allows Linux user nobody to execute tasks"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to access volumes"}' \
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
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:cassandra-role \
    -d '{"description":"Controls the ability of cassandra-role to access volumes"}' \
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

1.  Grant the permissions and the allowed actions to the service account using the following commands.

    **Important:** These commands use the default Cassandra `role` value of `cassandra-role`. If you're running multiple instances of Cassandra, replace the instances of `cassandra-role` with the correct name (`<name>-role`). For example, if you have a Cassandra instance named `cassandra2`, you would replace each role value in the code samples to `cassandra2-role`.

    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:cassandra-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:cassandra-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:cassandra-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id>/users/<service-account-id>/delete
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id>/users/<service-account-id>/delete
    ```

# <a name="create-json"></a>Create a Configuration File
Create a custom configuration file that will be used to install Cassandra and save as `config.json`.

Specify the service account (`<service_account_id>`) and a secret path (`cassandra/<secret-name>`) .
```json
{
  "service": {
    "service_account": "<service_account_id>",
    "service_account_secret": "cassandra/<secret-name>"
  }
}
```

# <a name="install-cass"></a>Install Cassandra
Install Cassandra with this command:

```bash
dcos package install --options=config.json cassandra
```
