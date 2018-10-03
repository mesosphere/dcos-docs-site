---
layout: layout.pug
title: Authenticating DC/OS Services
menuWeight: 100
excerpt:

enterprise: true
---

This topic details how to configure authentication for custom apps and pods launched on DC/OS.

**Prerequisites:** 

- [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/1.10/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created using the DC/OS Enterprise CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```
    
**Tip:** You can use the [DC/OS Secret Store](/1.10/security/ent/secrets/) to secure the key pair. 

# <a name="create-a-service-account"></a>Create a Service Account
You can use either the DC/OS Enterprise CLI or the DC/OS GUI to create a service account.

## Using the DC/OS Enterprise CLI

From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "<description>" <service-account-id>
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

## Using the GUI

1. In the DC/OS GUI, navigate to the **Organization** -> **Service Accounts** tab.
1. Click the **+** icon in the top right.

   ![Click the service account create button](/1.10/img/new-service-account-button.png)
   
1. Enter a description and type the Service Account ID in the **ID** field.
1. Paste the public key associated with the account into the **PUBLIC KEY** field.
   
   ![Create service account UI](/1.10/img/create-service-account.png)
   
<!-- # Create a Secret -->
# Create a Secret
Create a secret (`<secret-name>`) with your service account (`service-account-id>`) and private key specified (`<private-key>.pem`). 

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <secret-name>
```

## Strict
In strict mode, the service account name (`<service-account-id>`) must match the name specified in the framework `principal`. 
```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> <secret-name>
```

**Tip:** 
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
                                     
## Determine the Required Permissions
You can determine what access your service account requires by using this procedure. This will allow you to rule out any functional issues that might be caused by incorrect permissions. 

1.  [SSH to your node](/1.10/administering-clusters/sshcluster/).

    ```bash
    dcos node ssh --master-proxy --mesos-id=<mesos-id>
    ```

1.  Run this grep command to view the `deny` logs for your service account (`<service-account-id>`).

    ```bash
    journalctl -u "dcos-*" |grep "audit" |grep "<service-account-id>" |grep "deny"
    ```
    
    This command will return a list of the audit logs that are generated when your service was denied access due to insufficient permissions or a bad token. The rejection messages should include the permission that was missing. You might need to repeat this process several times to determine the full list of required permissions.
    

**Troubleshooting:** 

-  You can grant your service superuser permission to rule out any functional issues. All valid services should be able to run as superuser.

   ```bash
   curl -x put --cacert dcos-ca.crt \
   -h "authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:superuser/users/<service-account-id>/full
   ```

For more information, see the [permissions reference](/1.10/security/ent/perms-reference/). 

## Assign the Permissions
Using the [permissions reference](/1.10/security/ent/perms-reference/) and the log output, assign permissions to your service. 

All CLI commands can also be executed via the [IAM API](/1.10/security/ent/iam-api/).

### Using the CLI

You can assign permissions using the CLI.
For example, to authorize the [Cassandra service](/services/cassandra/cass-auth/) to be uninstalled on DC/OS:

1.  Grant the permissions (`dcos:mesos:master:framework:role:cassandra-role`) and the allowed actions (`create`).

    ```bash
    dcos security org users grant <service-account-id> dcos:mesos:master:framework:role:cassandra-role create --description "Controls the ability of cassandra-role to register as a framework with the Mesos master"
    ```

### Using the GUI

1.  Log into the DC/OS GUI as a user with the superuser permission.
1.  Select **Organization > Service Accounts**.
1.  Select the name of the service account to grant the permission to.

    ![Select service acccount](/1.10/img/add-service-account-permission.png)
    
1.  From the **Permissions** tab, click **ADD PERMISSION**.
1.  Click **INSERT PERMISSION STRING** to toggle the dialog.
1.  Copy and paste the permission in the **Permissions Strings** field.

    ![Service account permission string](/1.10/img/service-account-permission-string.png)

# <a name="req-auth-tok"></a>Request an Authentication Token

Generate a [service login token](/1.10/security/ent/service-auth/), where the service account (`<service-account-id>`) and private key (`<private-key>.pem`) are specified. 

```bash
dcos auth login --username=<service-account-id> --private-key=<private-key>.pem
```

# <a name="pass-tok"></a>Pass the Authentication Token in Subsequent Requests
After the service has successfully logged in, an [authentication token](/1.10/security/ent/service-auth/) is created. The authentication token should used in subsequent requests to DC/OS endpoints. You can reference the authentication token as a shell variable, for example:

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

# <a name="refresh-tok"></a>Refresh the Authentication Token
By default, authentication tokens expire after five days. Your service will need to renew its token either before or after it expires. The token itself contains the expiration, so your service can use this information to proactively refresh the token. Alternatively, you can wait to get a `401` from DC/OS and then refresh it.

To refresh your authentication token, just repeat the process discussed in [Request an authentication token](#req-auth-tok).
