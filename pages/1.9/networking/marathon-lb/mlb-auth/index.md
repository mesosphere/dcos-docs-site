---
layout: layout.pug
navigationTitle:  Provisioning Marathon-LB
title: Provisioning Marathon-LB
menuWeight: 700
excerpt:

enterprise: true
---

This topic describes how to configure DC/OS access for Marathon-LB. Depending on your [security mode](/1.9/security/ent/#security-modes), Marathon-LB requires [service authentication](/1.9/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

**Prerequisites:**

- [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.9/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created using the DC/OS Enterprise CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**Tip:** You can use the [DC/OS Secret Store](/1.9/security/ent/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

## Permissive
From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Marathon-LB service account" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

## Strict
In strict mode, the service account name must match the name specified in the framework `principal`. By default, the Marathon-LB package uses `mlb-principal` and the service account name must match this. For more information about principals, see the [Mesos documentation](http://mesos.apache.org/documentation/latest/authorization/).

From a terminal prompt, create a new service account (`mlb-principal`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Marathon-LB service account" mlb-principal
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show mlb-principal
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`marathon-lb/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and path are `marathon-lb`), then only the service named `marathon-lb` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> marathon-lb/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem mlb-principal marathon-lb/<secret-name>
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```
# <a name="give-perms"></a>Create and Assign Permissions
Use the following curl commands to rapidly provision the Marathon-LB service account with the required permissions.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permission.

    ## Permissive

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H 'Content-Type: application/json' \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
    -d '{"description":"Allows access to any service launched by the native Marathon instance"}' \
    curl -X PUT --cacert dcos-ca.crt \
    -H 'Content-Type: application/json' \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:admin:events \
    -d '{"description":"Allows access to Marathon events"}' 
    ```
    
    ## Permissive

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H 'Content-Type: application/json' \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
    -d '{"description":"Allows access to any service launched by the native Marathon instance"}' \
    curl -X PUT --cacert dcos-ca.crt \
    -H 'Content-Type: application/json' \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:admin:events \
    -d '{"description":"Allows access to Marathon events"}' 
    ```    


1.  Grant the permissions and the allowed actions to the service account using the following commands.

    ## Permissive
    Run these commands.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/mlb-principal/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:admin:events/users/mlb-principal/read
    ```

   ## Strict
   Run these commands.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/mlb-principal/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:admin:events/users/mlb-principal/read
    ``` 


# <a name="create-json"></a>Create a Configuration File
Create a custom configuration file that will be used to install Marathon-LB and save as `config.json`.

## Permissive
Specify the service account (`<service-account-id>`) and secret (`marathon-lb/<secret-name>`).

```json
{
  "service": {
    "principal": "<service-account-id>",
    "secret_name": "marathon-lb/<secret-name>"
  }
}
```

## Strict
Specify the service account (`mlb-principal`), secret (`marathon-lb/<secret-name>`), and Linux user (`nobody`). In strict mode, Marathon-LB can run under the `root` Linux account, but it is recommended that you override this default by specifying user `nobody`. This ensures that the dispatcher runs under the `nobody` account.

```json
{
  "service": {
    "principal": "mlb-principal",
    "secret_name": "marathon-lb/<secret-name>",
    "user": "nobody"
  }
}
```

## <a name="install-marathon-lb"></a>Install Marathon-LB
Install Marathon-LB with this command:

```bash
dcos package install --options=config.json marathon-lb
```
