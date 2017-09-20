---
layout: layout.pug
title: Provisioning Confluent
menuWeight: 300
excerpt: >
  This topic describes when and how to
  provision Confluent with a service
  account.
featureMaturity: preview
enterprise: true
navigationTitle:  Provisioning Confluent
---


# About provisioning Confluent with a service account

The ability to provision Confluent with a service account varies by [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security).

- `disabled`: not possible
- `permissive`: optional
- `strict`: service cannot be installed

To increase the security of your cluster and conform to the principle of least privilege, we recommend provisioning Confluent with a service account in `permissive` mode. Otherwise, Confluent will use the default `dcos_anonymous` account to authenticate and the `dcos_anonymous` account has the `superuser` permission.

To set up a service account for Confluent, complete the following steps.

1. [Create a key pair.](#create-a-keypair)
1. [Create a service account.](#create-a-service-account)
1. [Create a service account secret.](#create-an-sa-secret)
1. [Provision the service account with the necessary permissions.](#give-perms)
1. [Create a config.json file.](#create-json)


**Note:** We will use `confluent-secret` as the name of the secret, `confluent-private-key.pem` as the name of the file containing the private key, and `confluent-public-key.pem` as the name of the file containing the public key. We recommend sticking to these names as it will make it easier to copy and paste the commands. If you do decide to change the names, make sure to modify the commands before issuing them.

**Important:** We store the secret in the `confluent-kafka` path. This protects it from other services, so we do not recommend changing this.


# <a name="create-a-keypair"></a>Create a key pair

First, you'll need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the Enterprise DC/OS CLI is the most convenient because it returns the keys in the exact format required.

**Prerequisite:** You must have the [DC/OS CLI installed](/docs/1.8/usage/cli/install/) and the [Enterprise DC/OS CLI 0.4.14 or later installed](/docs/1.8/usage/cli/enterprise-cli/#ent-cli-install).

1. From a terminal prompt, use the following command to create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair confluent-private-key.pem confluent-public-key.pem
    ```

1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

1. Continue to the [next section](#create-a-service-account).


# <a name="create-a-service-account"></a>Create a service account

## About creating a service account

Next, you must create a service account. This section describes how to use either the Enterprise DC/OS CLI or the web interface to accomplish this.

## Using the Enterprise DC/OS CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/docs/1.8/usage/cli/install/), the [Enterprise DC/OS CLI 0.4.14 or later installed](/docs/1.8/usage/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new service account called `confluent-kafka-principal` containing the public key you just generated.

    ```bash
    dcos security org service-accounts create -p confluent-public-key.pem -d "Confluent service account" confluent-kafka-principal
    ```

1. Verify your new service account using the following command.

    ```bash
    dcos security org service-accounts show confluent-kafka-principal
    ```

1. Continue to [Create a service account secret](#create-an-sa-secret).

## Using the web interface

1. In the DC/OS web interface, navigate to the **Organization** -> **Service Accounts** tab.

1. Click the **+** icon in the top right.

1. Enter a description and type `confluent-kafka-principal` into the **ID** field.

1. Paste the public key associated with the account into the large text field.

1. Continue to the [next section](#create-an-sa-secret).

# <a name="create-an-sa-secret"></a>Create a service account secret

## About creating a service account secret

Next, you need to create a secret associated with the service account that contains the private key. This section describes how to use either the Enterprise DC/OS CLI or the web interface to accomplish this.

## Using the Enterprise DC/OS CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/docs/1.8/usage/cli/install/), the [Enterprise DC/OS CLI 0.4.14 or later installed](/docs/1.8/usage/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new secret called `confluent-secret` in the `confluent-kafka` path. Locating the secret inside the `confluent-kafka` path will ensure that only the Confluent service can access it. The secret will contain the private key, the name of the service account, and other data.

    ```bash
    dcos security secrets create-sa-secret --strict confluent-private-key.pem confluent-kafka-principal confluent-kafka/confluent-secret
    ```

1. Ensure the secret was created successfully with the following command.

    ```bash
    dcos security secrets list /
    ```

1. If you have [jq 1.5 or later](https://stedolan.github.io/jq/download) installed, you can also use the following command to retrieve the secret and ensure that it contains the correct service account ID and private key.

    ```bash
    dcos security secrets get /confluent-kafka/confluent-secret --json | jq -r .value | jq
    ```

1. Now that you have stored the private key in the Secret Store, we recommend deleting the private key file from your file system. This will prevent bad actors from using the private key to authenticate to DC/OS.

   ```bash
   rm -rf confluent-private-key.pem
   ```

1. Continue to [Provision the service account with permissions](#give-perms).

## Using the web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **Security** -> **Secrets** tab.

1. Click the **+** icon in the top right.

1. Type `confluent-kafka/confluent-secret` into the **ID** field to create a new secret called `confluent-secret` in the `confluent-kafka` path. Locating the secret inside the `confluent-kafka` path will ensure that only the Confluent service can access it.

1. Paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "confluent-kafka-principal",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
  }
  ```

1. Replace `<private-key-value>` with the value of the private key created in [Create a key pair](#create-a-keypair).

1. Click **Create**. Your secret has been stored!

1. Continue to the [next section](#give-perms).

# <a name="give-perms"></a>Provision the service account with permissions

## About the permissions

In `permissive` mode, the Confluent service account does not need any permissions.

While Confluent cannot be deployed in `strict` [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security), we do plan to release a version that supports `strict` mode. If you plan to upgrade to `strict` at some point in the future, we recommending assigning the Confluent service account the permissions needed in `strict` mode to make the upgrade easier. The permissions will not have any effect until the cluster is in `strict` mode. If you plan to remain in `permissive` mode indefinitely, skip to [Create a config.json file](#create-json).

If you are in `strict` mode or want to be ready to upgrade to `strict` mode, continue to the next section.

## Creating and assigning the permissions

With the following curl commands you can rapidly provision the Confluent service account with the permissions required in `strict` mode. These commands can be executed from outside of the cluster. All you will need is the DC/OS CLI installed. You must also log in via `dcos auth login` as a superuser.

**Prerequisite:** If your [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/docs/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Issue the following commands to create the permissions.

   **Note:** There is always a chance that the permission has already been added. If so, the API returns an informative message. Consider this a confirmation and continue to the next one.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:confluent-kafka-role -d '{"description":"Controls the ability of confluent-kafka-role to register as a framework with the Mesos master"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:confluent-kafka-role -d '{"description":"Controls the ability of confluent-kafka-role to reserve resources"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:confluent-kafka-role -d '{"description":"Controls the ability of confluent-kafka-role to access volumes"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:confluent-kafka-principal -d '{"description":"Controls the ability of confluent-kafka-principal to reserve resources"}' -H 'Content-Type: application/json'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:confluent-kafka-principal -d '{"description":"Controls the ability of confluent-kafka-principal to access volumes"}' -H 'Content-Type: application/json'
   ```

   **Important:** Confluent generates its role name automatically by appending `-role` to the `name` value. By default, Confluent uses `confluent-kafka` as its `name`. The default `role` value will be `confluent-kafka-role`, as shown in the curl code samples. If you're running more than one instance of Confluent, you will need to override the default `name` value and you'll need to replace the instances of `confluent-kafka-role` throughout these curl samples with the correct role name. For example, if you change the `name` value to `confluent-kafka2` for your second instance, you must replace each `role` value in the code samples to `confluent-kafka2-role`.

1. Grant the permissions and the allowed actions to the service account using the following commands.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:confluent-kafka-role/users/confluent-kafka-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:confluent-kafka-role/users/confluent-kafka-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:confluent-kafka-role/users/confluent-kafka-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/confluent-kafka-principal/create
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:confluent-kafka-principal/users/confluent-kafka-principal/delete
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:confluent-kafka-principal/users/confluent-kafka-principal/delete
   ```

1. Continue to the [next section](#create-json).




# <a name="create-json"></a>Create a config.json file

If you have used all of the values shown in the previous sections, you can just copy and paste the following JSON into a new file and save it as `config.json`. Otherwise, change the values in the following JSON as appropriate.


```json
{
  "service": {
    "principal": "confluent-kafka-principal",
    "secret_name": "confluent-kafka/confluent-secret"
  }
}
```

Continue to the [next section](#install-conf).


## <a name="install-conf"></a>Install Confluent


To install the service, use the following command.

```bash
dcos package install --options=config.json confluent-kafka
```

You can also provide the `config.json` file to someone else to install Confluent. Please see the [documentation](/docs/1.8/usage/managing-services/install/) for more information about how to use JSON files to install services.
