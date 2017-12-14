---
layout: layout.pug
navigationTitle:  Provisioning HDFS
title: Provisioning HDFS
menuWeight: 500
excerpt: >
  This topic describes when and how to
  provision HDFS with a service account.
preview: true
enterprise: true
---


# About provisioning HDFS with a service account

The ability to provision HDFS with a service account varies by [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security).

- `disabled`: not possible
- `permissive`: optional
- `strict`: required

To increase the security of your cluster and conform to the principle of least privilege, we recommend provisioning HDFS with a service account in `permissive` mode. Otherwise, HDFS will use the default `dcos_anonymous` account to authenticate and the `dcos_anonymous` account has the `superuser` permission.

To set up a service account for HDFS, complete the following steps.

1. [Create a key pair.](#create-a-keypair)
1. [Create a service account.](#create-a-service-account)
1. [Create a service account secret.](#create-an-sa-secret)
1. [Provision the service account with the necessary permissions.](#give-perms)
1. [Create a config.json file.](#create-json)

**Requirement:** In `strict` mode, the name of the service account must match the name that the service uses as its `principal`. By default, HDFS uses `hdfs-principal` as its principal name. That's the value that we use in the following procedures. Should you modify the default, you must change `hdfs-principal` throughout to match.

**Note:** We will use `hdfs-secret` as the name of the secret, `hdfs-private-key.pem` as the name of the file containing the private key, and `hdfs-public-key.pem` as the name of the file containing the public key. We recommend sticking to these names as it will make it easier to copy and paste the commands. If you do decide to change the names, make sure to modify the commands before issuing them.

**Important:** We store the secret in the `hdfs` path. This protects it from other services, so we do not recommend changing this.


# <a name="create-a-keypair"></a>Create a key pair

First, you'll need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the DC/OS Enterprise CLI is the most convenient because it returns the keys in the exact format required.

**Prerequisite:** You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and the [DC/OS Enterprise CLI 0.4.14 or later installed](/1.8/usage/cli/enterprise-cli/#ent-cli-install).


1.  Use the following command to create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair hdfs-private-key.pem hdfs-public-key.pem
    ```

1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

1. Continue to the [next section](#create-a-service-account).


# <a name="create-a-service-account"></a>Create a service account

## About creating a service account

Next, you must create a service account. This section describes how to use either the DC/OS Enterprise CLI or the web interface to accomplish this.

## Using the DC/OS Enterprise CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/1.8/usage/cli/install/), the [DC/OS Enterprise CLI 0.4.14 or later installed](/1.8/usage/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new service account called `hdfs-principal` containing the public key you just generated.

    ```bash
    dcos security org service-accounts create -p hdfs-public-key.pem -d "HDFS service account" hdfs-principal
    ```

1. Verify your new service account using the following command.

    ```bash
    dcos security org service-accounts show hdfs-principal
    ```

1. Continue to [Create a service account secret](#create-an-sa-secret).

## Using the web interface

1. In the DC/OS web interface, navigate to the **Organization** -> **Service Accounts** tab.

1. Click the **+** icon in the top right.

1. Enter a description and type `hdfs-principal` into the **ID** field.

1. Paste the public key associated with the account into the large text field.

1. Continue to the [next section](#create-an-sa-secret).

# <a name="create-an-sa-secret"></a>Create a service account secret

## About creating a service account secret

Next, you need to create a secret associated with the service account that contains the private key. This section describes how to use either the DC/OS Enterprise CLI or the web interface to accomplish this.

## Using the DC/OS Enterprise CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/1.8/usage/cli/install/), the [DC/OS Enterprise CLI 0.4.14 or later installed](/1.8/usage/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new secret called `hdfs-secret` in the `hdfs` path. Locating the secret inside the `hdfs` path will ensure that only the HDFS service can access it. The secret will contain the private key, the name of the service account, and other data.

    ```bash
    dcos security secrets create-sa-secret --strict hdfs-private-key.pem hdfs-principal hdfs/hdfs-secret
    ```

1. Ensure the secret was created successfully:

    ```bash
    dcos security secrets list /
    ```

1. If you have [jq 1.5 or later](https://stedolan.github.io/jq/download) installed, you can also use the following command to retrieve the secret and ensure that it contains the correct service account ID and private key.

    ```bash
    dcos security secrets get /hdfs/hdfs-secret --json | jq -r .value | jq
    ```

1. Now that you have stored the private key in the Secret Store, we recommend deleting the private key file from your file system. This will prevent bad actors from using the private key to authenticate to DC/OS.

   ```bash
   rm -rf hdfs-private-key.pem
   ```

1. Continue to [Provision the service account with permissions](#give-perms).


## Using the web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **Security** -> **Secrets** tab.

1. Click the **+** icon in the top right.

1. Type `hdfs/hdfs-secret` into the **ID** field to create a new secret called `hdfs-secret` in the `hdfs` path. Locating the secret inside the `hdfs` path ensures that only the HDFS service can access it.

1. Paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "hdfs-principal",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
  }
  ```

1. Replace `<private-key-value>` with the value of the private key created in [Create a key pair](#create-a-keypair).

1. Click **Create**. Your secret has been stored!

1. Continue to the [next section](#give-perms).

# <a name="give-perms"></a>Provision the service account with permissions

## About the permissions

The permissions needed vary according to your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security). In `permissive` mode, the HDFS service account does not need any permissions. If you plan to upgrade at some point to `strict` mode, we recommending assigning them the permissions needed in `strict` mode to make the upgrade easier. The permissions will not have any effect until the cluster is in `strict` mode. If you plan to remain in `permissive` mode indefinitely, skip to [Create a config.json file](#create-json).

If you are in `strict` mode or want to be ready to upgrade to `strict` mode, continue to the next section.

## Creating and assigning the permissions

With the following curl commands you can rapidly provision the HDFS service account with the permissions required in `strict` mode. These commands can be executed from outside of the cluster. All you will need is the DC/OS CLI installed. You must also log in via `dcos auth login` as a superuser.

**Prerequisite:** If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. In `permissive` mode, issue the following command to add the necessary permission. It may already exist. If so, you'll get an informative message and can continue to the next step. This permission will already exist in `strict` mode. If you're running in `strict` mode, you don't need to issue this command and can skip to the next step.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody -d '{"description":"Allows Linux user nobody to execute tasks"}' -H 'Content-Type: application/json'
   ```

1. In both `strict` and `permissive` modes, you must create the following permissions.

   **Note:** There is always a chance that the permission has already been added. If so, the API returns an informative message. Consider this a confirmation and continue to the next one.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role -d '{"description":"Controls the ability of hdfs-role to register as a framework with the Mesos master"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role -d '{"description":"Controls the ability of hdfs-role to reserve resources"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role -d '{"description":"Controls the ability of hdfs-role to access volumes"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:hdfs-principal -d '{"description":"Controls the ability of hdfs-principal to reserve resources"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:hdfs-principal -d '{"description":"Controls the ability of hdfs-principal to access volumes"}' -H 'Content-Type: application/json'
   ```

   **Important:** If you're running more than one instance of HDFS, you will need to override the default `role` value and you'll need to replace the instances of `hdfs-role` throughout these curl samples with the correct role name.

1. Grant the permissions and the allowed actions to the service account using the following commands.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:hdfs-role/users/hdfs-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:hdfs-role/users/hdfs-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:hdfs-role/users/hdfs-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/hdfs-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:hdfs-principal/users/hdfs-principal/delete
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:hdfs-principal/users/hdfs-principal/delete
   ```

1. Continue to the [next section](#create-json).



# <a name="create-json"></a>Create a config.json file

If you have used all of the values shown in the previous sections, you can just copy and paste the following JSON into a new file and save it as `config.json`. Otherwise, change the values in the following JSON as appropriate.


```json
{
  "service": {
    "principal": "hdfs-principal",
    "secret_name": "hdfs/hdfs-secret",
    "user": "nobody"
  }
}
```

**Note:** In `strict` mode, services cannot run under the `root` Linux account. Because HDFS defaults to running under `root`, if you are deploying HDFS in a `strict` cluster, you must  override the default to `nobody`, as shown above. If you are running in a `permissive` cluster, you can omit the `"user": "nobody"` line.

Continue to the [next section](#install-hdfs).


## <a name="install-hdfs"></a>Install HDFS


To install the service, use the following command.

```bash
dcos package install --options=config.json hdfs
```

You can also provide the `config.json` file to someone else to install HDFS. Please see the [HDFS documentation](/service-docs/hdfs/vhdfs_1.3.0-2.6.0-cdh5.9.1/install/) for more information about how to use the JSON file to install the service.
