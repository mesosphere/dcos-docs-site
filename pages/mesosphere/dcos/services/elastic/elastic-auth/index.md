---
layout: layout.pug
title: Configuring DC/OS Access for Elastic
menuWeight: 290
excerpt:
enterprise: true
---

This topic describes how to configure DC/OS access for Elastic. Depending on your [security mode](/mesosphere/dcos/latest/security/ent/#security-modes/), Elastic requires [service authentication](/mesosphere/dcos/1.10/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the [superuser permission](/mesosphere/dcos/1.11/security/ent/perms-reference/#superuser).

**Prerequisites:**

- [DC/OS CLI installed](/mesosphere/dcos/latest/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/mesosphere/dcos/latest/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/mesosphere/dcos/latest/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/mesosphere/dcos/latest/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created uses the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**Tip:** You can use the [DC/OS Secret Store](/mesosphere/dcos/1.10/security/ent/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Elastic service account" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret path (`elastic/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and secret path are `elastic`), then only the service named `elastic` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> elastic/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> elastic/<secret-name>
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
Use the following curl commands to rapidly provision the Elastic service account with the required permissions.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permissions and then assign them. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permission.

    **Important:** These commands use the default Elastic `role` value of `elastic-role`. If you're running multiple instances of Elastic, replace the instances of `elastic-role` with the correct name (`<service_name>-role`). For example, if you have a Elastic instance named `elastic2`, you would replace each role value in the code samples to `elastic2-role`.

    ## Permissive
    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
    -d '{"description":"Allows Linux user nobody to execute tasks"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to access volumes"}' \
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
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to register as a framework with the Mesos master"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to reserve resources"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:elastic-role \
    -d '{"description":"Controls the ability of elastic-role to access volumes"}' \
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

    **Important:** These commands use the default Elastic `role` value of `elastic-role`. If you're running multiple instances of Elastic, replace the instances of `elastic-role` with the correct name (`<name>-role`). For example, if you have a Elastic instance named `elastic2`, you would replace each role value in the code samples to `elastic2-role`.

    Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:elastic-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:elastic-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:elastic-role/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id>/users/<service-account-id>/delete
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id>/users/<service-account-id>/delete
    ```

# <a name="create-json"></a>Create a Configuration File
Create a custom configuration file that will be used to install Elastic and save as `config.json`.

Specify the service account (`<service_account_id>`) and a secret path (`elastic/<secret-name>`) .
```json
{
  "service": {
    "service_account": "<service_account_id>",
    "service_account_secret": "elastic/<secret-name>"
  }
}
```

# <a name="install-cass"></a>Install Elastic
Install Elastic with this command:

```bash
dcos package install --options=config.json elastic
```
