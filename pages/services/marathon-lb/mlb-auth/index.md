---
layout: layout.pug
navigationTitle:  Provisioning Marathon-LB
title: Provisioning Marathon-LB
menuWeight: 3
excerpt: Provisioning Marathon-LB with a service account

enterprise: true
---


Whether you can or must provision Marathon-LB with a service account varies by [security mode](/1.10/security/ent/#security-modes).

- `disabled`: optional
- `permissive`: optional
- `strict`: required

To increase the security of your cluster and conform to the principle of least privilege, we recommend provisioning Marathon-LB with a service account in `permissive` mode. Otherwise, Marathon and Metronome will act as if Marathon-LB was provisioned with a service account which has the `superuser` permission.

In addition, if you plan to upgrade to `strict` mode, provisioning Marathon-LB with a service account in `disabled` and `permissive` modes will make the upgrade easier. If you set up multiple Marathon-LB instances that interact with the same Marathon instance, you can use the same service account for each Marathon-LB instance.

This topic describes how to provision a Marathon-LB instance that interacts with the native Marathon instance. To set up a service account for Marathon-LB, complete the following steps.

1. [Create a key pair.](#create-a-keypair)
1. [Create a service account.](#create-a-service-account)
1. [Create a service account secret.](#create-an-sa-secret)
1. [Provision the service account with the necessary permissions.](#give-perms)
1. [Create a config.json file.](#create-json)

**Note:** This document assumes the following:
* `marathon-lb` as the `marathon-lb` `marathon` service name; if you are installing `marathon-lb` in a different location, you will have to change the secret location accordingly.
* `marathon-lb/service-account-secret` as the full path for the secret used to store the credentials for the Marathon-LB service account; if you change the `marathon-lb` service name, you will have to change this.
* `mlb-private-key.pem` as the name of the file containing the private key.
* `mlb-public-key.pem` as the name of the file containing the public key.

We recommend sticking to these names as it will make it easier to copy and paste the commands. If you do decide to change the names, make sure to modify the commands before issuing them.

**Note:** We store the secret in the `marathon-lb/service-account-secret` path. This protects it from other services, so we do not recommend changing this.

## <a name="create-a-keypair"></a>Create a key pair

First, you will need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the DC/OS Enterprise CLI is the most convenient because it returns the keys in the format needed by DC/OS.

**Prerequisites:**
- [DC/OS CLI installed](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.10/cli/enterprise-cli/#ent-cli-install)

1.  Use the following command to create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair mlb-private-key.pem mlb-public-key.pem
    ```

1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

1. Continue to the [next section](#create-a-service-account).

## <a name="create-a-service-account"></a>Create a service account

This section describes how to use either the DC/OS Enterprise CLI or the web interface to create a service account.

### Using the DC/OS Enterprise CLI

**Prerequisites:**
- [DC/OS CLI installed](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.10/cli/enterprise-cli/#ent-cli-install)
- Logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new service account called `marathon-lb-sa` containing the public key you just generated.

    ```bash
    dcos security org service-accounts create -p mlb-public-key.pem -d "Marathon-LB service account" marathon-lb-sa
    ```

1. Verify your new service account using the following command.

    ```bash
    dcos security org service-accounts show marathon-lb-sa
    ```

1. Continue to [Create a service account secret](#create-an-sa-secret).

### Using the web interface

1. In the DC/OS web interface, navigate to the **Organization** -> **Service Accounts** tab.

1. Click **New Service Account**.

1. Enter a description, the service account ID, and the public key associated with the account. Copy the contents of the relevant public key file into the **Public Key** field.

1. Continue to [Create a service account secret](#create-an-sa-secret).

## <a name="create-an-sa-secret"></a>Create a service account secret

This section describes how to use either the DC/OS Enterprise CLI or the web interface to create a secret associated with the service account that contains the private key.

### Using the DC/OS Enterprise CLI

**Prerequisite:**
- [DC/OS CLI installed](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.10/cli/enterprise-cli/#ent-cli-install)
- Logged in as a superuser via `dcos auth login`.

1. Depending on your security mode, use one of the following commands to create a new secret called `service-account-secret` in the `marathon-lb` path (the full secret path will be `marathon-lb/service-account-secret`. Locating the secret inside the `marathon-lb` path will ensure that only the Marathon-LB service can access it. The secret will contain the private key, the name of the service account, and other data.

    **strict or permissive:**

    ```bash
    dcos security secrets create-sa-secret --strict mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
    ```

    **disabled:**

    ```bash
    dcos security secrets create-sa-secret mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
    ```

1. Ensure the secret was created successfully:

    ```bash
    dcos security secrets list /
    ```

1. If you have [jq 1.5 or later](https://stedolan.github.io/jq/download) installed, you can also use the following command to retrieve the secret and ensure that it contains the correct service account ID and private key.

    ```bash
    dcos security secrets get /marathon-lb/service-account-secret --json | jq -r .value | jq
    ```

   **Important:** While reviewing the secret, ensure that the `login_endpoint` URL uses HTTPS if you're in `strict` or `permissive` mode and HTTP if you are in `disabled` mode. If the URL begins with `https` and you are in `disabled` mode, try [upgrading the DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/#ent-cli-upgrade), deleting the secret, and recreating it.

1. Now that you have stored the private key in the Secret Store, we recommend deleting the private key file from your file system. This will prevent bad actors from using the private key to authenticate to DC/OS.

   ```bash
   rm -rf mlb-private-key.pem
   ```

1. Continue to [Provision the service account with permissions](#give-perms).

### Using the web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **System** -> **Security** tab.

1. Click **New Secret**.

1. Type `marathon-lb/service-account-secret` into the **ID** field to create a new secret called `service-account-secret` in the `marathon-lb` path. Locating the secret inside the `marathon-lb` path will ensure that only the Marathon-LB service can access it.

1. If you have a `strict` or `permissive` cluster, paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
  }
  ```

  If you have a `disabled` cluster, paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "http://master.mesos/acs/api/v1/auth/login"
  }
  ```

6. Replace `<private-key-value>` with the value of the private key created in [Create a key pair](#create-a-keypair).

1. Click **Create**. Your secret has been stored!

   **Tip:** Be sure to copy the path to your secret into a text editor. You will need this later.

1. Continue to the [next section](#give-perms).

## <a name="give-perms"></a>Provision the service account with permissions

With the following commands you can rapidly provision the Marathon-LB service account with the required permissions. These commands can be executed from outside of the cluster.

**Prerequisites**
- [DC/OS CLI installed](/1.10/cli/install/)
- Logged in via `dcos auth login` as a superuser

All CLI commands can also be executed via the [IAM API](/1.10/security/ent/iam-api/).

1. Grant the permissions and the allowed action to the service account using the following commands.

   ```bash
   dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:services:/ read --description "Allows access to any service launched by the native Marathon instance"
   dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:admin:events read --description "Allows access to Marathon events"
   ```

1. Continue to the [next section](#create-json).

## <a name="create-json"></a>Create a config.json file

The necessary contents of the `config.json` file will vary according to your [security mode](/1.10/security/ent/#security-modes).

### Strict and permissive mode config.json

If you have called the secret `marathon-lb/service-account-secret`, you can copy and paste the following JSON into a new file and save it with the name `config.json`. Otherwise, change the name `marathon-lb/service-account-secret` as needed.

```json
{
    "marathon-lb": {
        "secret_name": "marathon-lb/service-account-secret",
        "marathon-uri": "https://marathon.mesos:8443"
    }
}
```

**Note:** While switching the port used to communicate with Marathon to `8443` is not required to install Marathon-LB in `permissive` mode, we do recommend it. This ensures that Marathon-LB's communications with Marathon occur over an encrypted channel.

Continue to [Install Marathon-LB](#install-mlb).

### Disabled mode config.json

If you have called the secret `marathon-lb/service-account-secret`, you can copy and paste the following JSON into a new file and save it with the name `config.json`. Otherwise, change the name `marathon-lb/service-account-secret` as needed.

```json
{
    "marathon-lb": {
        "secret_name": "marathon-lb/service-account-secret"
    }
}
```

Continue to the [next section](#install-mlb).

## <a name="install-mlb"></a>Install Marathon-LB

To install the service, use the following command.

```bash
dcos package install --options=config.json marathon-lb
```

You can also provide the `config.json` file to someone else to install Marathon-LB. Please see the [Marathon-LB documentation](/services/marathon-lb/usage-ee/) for more information.
