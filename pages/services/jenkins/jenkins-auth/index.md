---
layout: layout.pug
navigationTitle:  Provisioning Jenkins
title: Provisioning Jenkins
menuWeight: 15
excerpt: >
  This topic describes when and how to
  provision Jenkins with a service
  account.
featureMaturity:
enterprise: true
---


# About provisioning Jenkins with a service account

Whether you can or must provision Jenkins with a service account varies by [security mode](/latest/security/ent/#security-modes).

- `disabled`: not possible
- `permissive`: optional
- `strict`: required

To increase the security of your cluster and conform to the principle of least privilege, we recommend provisioning Jenkins with a service account in `permissive` mode. Otherwise, Marathon and Metronome will act as if Jenkins was provisioned with a service account which has the `superuser` permission.

To set up a service account for Jenkins, complete the following steps.

1. [Create a key pair.](#create-a-keypair)
1. [Create a service account.](#create-a-service-account)
1. [Create a service account secret.](#create-an-sa-secret)
1. [Provision the service account with the necessary permissions.](#give-perms)
1. [Create a config.json file.](#create-json)

**Requirement:** In `strict` mode, the name of the service account must match the name that the service uses as its `principal`. By default, Jenkins uses `jenkins-principal` as the name of its `principal`. That's the value that we use in the following procedures. Should you modify the default, you must change `jenkins-principal` throughout to match.

**Note:** We will use `jenkins-secret` as the name of the secret, `jenkins-private-key.pem` as the name of the file containing the private key, and `jenkins-public-key.pem` as the name of the file containing the public key. We recommend using these names, as it will make it easier to copy and paste the commands. If you change the names, make sure to modify the commands before issuing them.

**Important:** We store the secret in the `jenkins` path. This protects it from other services, so we do not recommend changing this.


# <a name="create-a-keypair"></a>Create a key pair

First, you'll need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the Enterprise DC/OS CLI is the most convenient because it returns the keys in the exact format required.

**Prerequisite:** You must have the [DC/OS CLI installed](/latest/cli/install/) and the [Enterprise DC/OS CLI 0.4.14 or later installed](/latest/cli/enterprise-cli/#ent-cli-install).


1. Create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    $ dcos security org service-accounts keypair jenkins-private-key.pem jenkins-public-key.pem
    ```

1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

1. Continue to the [next section](#create-a-service-account).


# <a name="create-a-service-account"></a>Create a service account

## About creating a service account

Next, you must create a service account. This section describes how to use either the Enterprise DC/OS CLI or the web interface to accomplish this.

## Using the Enterprise DC/OS CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/latest/cli/install/), the [Enterprise DC/OS CLI 0.4.14 or later installed](/latest/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Use the following command to create a new service account called `jenkins-principal` with the public key you just generated.

    ```bash
    $ dcos security org service-accounts create -p jenkins-public-key.pem -d "Jenkins service account" jenkins-principal
    ```

1. Verify your new service account using the following command.

    ```bash
    $ dcos security org service-accounts show jenkins-principal
    ```

1. Continue to [Create a service account secret](#create-an-sa-secret).

## Using the web interface

1. In the DC/OS web interface, navigate to the **Organization** -> **Service Accounts** tab.

1. Click the **+** icon in the top right.

1. Enter a description and type `jenkins-principal` into the **ID** field.

1. Paste the public key associated with the account into the large text field.

1. Continue to the [next section](#create-an-sa-secret).

# <a name="create-an-sa-secret"></a>Create a service account secret

## About creating a service account secret

Next, you need to create a secret associated with the service account that contains the private key. This section describes how to use either the Enterprise DC/OS CLI or the web interface to accomplish this.

## Using the Enterprise DC/OS CLI

**Prerequisite:** You must have the [DC/OS CLI installed](/latest/cli/install/), the [Enterprise DC/OS CLI 0.4.14 or later installed](/latest/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

1. Depending on your security mode, use one of the following commands to create a new secret called `jenkins-secret` in the `jenkins` path. Locating the secret inside the `jenkins` path will ensure that only the Jenkins service can access it. The secret will contain the private key, the name of the service account, and other data.

    **strict:**

    ```bash
    $ dcos security secrets create-sa-secret --strict jenkins-private-key.pem jenkins-principal jenkins/jenkins-secret
    ```

    **permissive:**

    ```bash
    $ dcos security secrets create-sa-secret jenkins-private-key.pem jenkins-principal jenkins/jenkins-secret
    ```

1. Ensure the secret was created successfully:

    ```bash
    $ dcos security secrets list /
    ```

1. If you have [jq 1.5 or later](https://stedolan.github.io/jq/download) installed, you can also use the following command to retrieve the secret and ensure that it contains the correct service account ID and private key.

    ```bash
    $ dcos security secrets get /jenkins/jenkins-secret --json | jq -r .value | jq
    ```

   **Important:** While reviewing the secret, ensure that the `login_endpoint` URL uses HTTPS if you are in `strict` mode and HTTP if you are in `permissive` mode. If the URL begins with `https` and you are in `permissive` mode, try [upgrading the Enterprise DC/OS CLI](/latest/cli/enterprise-cli/#ent-cli-upgrade), deleting the secret, and recreating it.

1. Now that you have stored the private key in the Secret Store, we recommend deleting the private key file from your file system. This will prevent bad actors from using the private key to authenticate to DC/OS.

   ```bash
   $ rm -rf jenkins-private-key.pem
   ```

1. Continue to [Provision the service account with permissions](#give-perms).



## Using the web interface

1. Log in to the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **Security** -> **Secrets** tab.

1. Click the **+** icon in the top right.

1. Type `jenkins/jenkins-secret` into the **ID** field to create a new secret called `jenkins-secret` in the `jenkins` path. Locating the secret inside the `jenkins` path will ensure that only the Jenkins service can access it.

1. If you have a `strict` cluster, paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "jenkins-principal",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
  }
  ```

  If you have a `permissive` cluster, paste the following JSON into the **Value** field.

  ```json
  {
      "scheme": "RS256",
      "uid": "jenkins-principal",
      "private_key": "<private-key-value>",
      "login_endpoint": "http://master.mesos/acs/api/v1/auth/login"
  }
  ```

1. Replace `<private-key-value>` with the value of the private key created in [Create a key pair](#create-a-keypair).

1. Click **Create**. Your secret has been stored!

1. Continue to the [next section](#give-perms).

# <a name="give-perms"></a>Provision the service account with permissions

## About the permissions

The permissions needed vary according to your [security mode](/latest/security/ent/#security-modes/). In `permissive` mode, the Jenkins service account does not need any permissions. If you plan to upgrade at some point to `strict` mode, we recommending assigning them the permissions needed in `strict` mode to make the upgrade easier. The permissions will not have any effect until the cluster is in `strict` mode. If you plan to remain in `permissive` mode indefinitely, skip to [Create a config.json file](#create-json).

If you are in `strict` mode or want to be ready to upgrade to `strict` mode, continue to the next section.

## Creating and assigning the permissions

With the following curl commands you can rapidly provision the Jenkins service account with the permissions required in `strict` mode. These commands can be executed from outside of the cluster. All you will need is the DC/OS CLI installed. You must also log in via `dcos auth login` as a superuser.

**Prerequisite:** If your [security mode](/latest/security/ent/#security-modes/) is `permissive` or `strict`, follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.11/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/latest/security/ent/#security-modes/) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Issue the following commands to create the necessary permissions.

   **Note:** There is always a chance that the permission has already been added. If so, the API returns an informative message. Consider this a confirmation and continue to the next one.

   ```bash
   $ curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody -d '{"description":"Allows Linux user nobody to execute tasks"}' -H 'Content-Type: application/json'
   $ curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* -d '{"description":"Controls the ability of jenkins-role to register as a framework with the Mesos master"}' -H 'Content-Type: application/json'
   ```

1. Grant the permissions and the allowed actions to the service account using the following commands.

   ```bash
   $ curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/jenkins-principal/create
   $ curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/jenkins-principal/create
   ```

1. Continue to the [next section](#create-json).




# <a name="create-json"></a>Create a config.json file

The contents of the `config.json` file will vary according to your security mode. We provide two examples below, one for each security mode. Locate the sample appropriate to your security mode, copy the JSON, paste it into a new file, and save it as `config.json`.

`strict` **mode**

```json
{
  "security": {
    "secret-name": "jenkins/jenkins-secret",
    "strict-mode": true
  },
  "service": {
    "user": "nobody"
  }
}
```

`permissive` **mode**

```json
{
  "security": {
    "secret-name": "jenkins/jenkins-secret"
  },
  "service": {
    "user": "nobody"
  }
}
```

If you have modified any of the values shown in the previous sections, change the values in the following JSON as appropriate.

Continue to the [next section](#install-jenkins).


## <a name="install-jenkins"></a>Install Jenkins

To install the service, complete the following steps.

1. Use the following command.

   ```bash
   $ dcos package install --options=config.json jenkins
   ```

1. Paste the following path into your browser, replacing `cluster-url` with your actual cluster URL: `https://<cluster-url>/service/jenkins/configure`.

1. Scroll to the **Mesos cloud** area.

1. Next to the **Framework credentials** field, click the **Add** button and select **Jenkins**.

1. In the **Username** field, type `jenkins-principal`.

1. In the **Password** field, type any value.

   ![Adding Jenkins credentials](/services/jenkins/img/add-jenkins-credential.png)

1. Once you have completed your entries, click **Add**.

1. Click **Apply** and then click **Save**.

1. Select the new **jenkins-principal** account in the **Framework credentials** list box.

1. Click **New item** in the side menu.

1. Click the **Freestyle project** button, type **Test service account** in the **Enter an item name** field, and press ENTER.

1. Scroll down to the **Build** area.

1. Click **Add build step** and select **Execute shell**.

1. Type `echo "hello world"` in the **Command** field.

1. Click **Save**.

1. The browser should display a **Project test service account** page.

1. Click **Build now** from the side menu.

1. After some time, the job should turn green in the **Build history** box. Congratulations! You have succeeded in setting Jenkins up with a service account.

You can also provide the `config.json` file to someone else to install Jenkins. Please see the [Jenkins documentation](/services/jenkins/quickstart/) for more information about how to use the JSON file to install the service.
