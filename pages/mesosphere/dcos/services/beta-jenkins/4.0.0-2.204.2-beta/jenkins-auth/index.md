---
layout: layout.pug
navigationTitle:  Provisioning Jenkins for DC/OS
title: Provisioning Jenkins for DC/OS
menuWeight: 15
excerpt: This topic describes when and how to provision Jenkins with a service account.
beta: true
featureMaturity:
enterprise: true
---

# About provisioning Jenkins with a service account

Whether you can or must provision Jenkins with a service account varies by [security mode](/mesosphere/dcos/latest/security/ent/#security-modes).

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


# Create a key pair

First, you'll need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the Enterprise DC/OS CLI is the most convenient because it returns the keys in the exact format required.

**Prerequisite:** You must have the [DC/OS CLI installed](/mesosphere/dcos/latest/cli/install/) and the [Enterprise DC/OS CLI installed](/mesosphere/dcos/latest/cli/enterprise-cli/#ent-cli-install).


1. Create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair jenkins-private-key.pem jenkins-public-key.pem
    ```

1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

# Create a service account

## About creating a service account

Next, you must create a service account. This section uses the Enterprise DC/OS CLI to accomplish this.

**Prerequisite:** You must have the [DC/OS CLI installed](/mesosphere/dcos/latest/cli/install/), the [Enterprise DC/OS CLI installed](/mesosphere/dcos/latest/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

- Use the following command to create a new service account called `jenkins-principal` with the public key you just generated.

    ```bash
    dcos security org service-accounts create -p jenkins-public-key.pem -d "Jenkins service account" jenkins-principal
    ```

- Verify your new service account using the following command.

    ```bash
    dcos security org service-accounts show jenkins-principal
    ```

## About creating a service account secret

Next, you need to create a secret associated with the service account that contains the private key.

**Prerequisite:** You must have the [DC/OS CLI installed](/mesosphere/dcos/latest/cli/install/), the [Enterprise DC/OS CLI installed](/mesosphere/dcos/latest/cli/enterprise-cli/#ent-cli-install), and be logged in as a superuser via `dcos auth login`.

- Depending on your security mode, use one of the following commands to create a new secret called `jenkins-secret` in the `jenkins` path. Locating the secret inside the `jenkins` path will ensure that only the Jenkins service can access it. The secret will contain the private key, the name of the service account, and other data.

    **strict:**

    ```bash
    dcos security secrets create-sa-secret --strict jenkins-private-key.pem jenkins-principal jenkins-secret
    ```

    **permissive:**

    ```bash
    dcos security secrets create-sa-secret jenkins-private-key.pem jenkins-principal jenkins-secret
    ```

- Create a file based secret with the jenkins private key:
    
    **Note:** This step is required by the Jenkins master scheduler to authenticate with Mesos.
    ```bash
    dcos security secrets create -f ./jenkins-private-key.pem jenkins/private_key
    ```
- Ensure the secret was created successfully:

    ```bash
    dcos security secrets list /
    ```

- **Optional:** Now that you have stored the private key in the Secret Store, we recommend deleting the private key file from your file system. This will prevent bad actors from using the private key to authenticate to DC/OS. Skip this step if you want to try out [Quota Enforced Multi-Tenant Jenkins](#Quota-enforced-Multi-Tenant-Jenkins)

   ```bash
   rm -rf jenkins-private-key.pem
   ```

# Provision the service account with permissions

## About the permissions

The permissions needed vary according to your [security mode](/mesosphere/dcos/latest/security/ent/#security-modes/). In `permissive` mode, the Jenkins service account does not need any permissions. If you plan to upgrade at some point to `strict` mode, we recommending assigning them the permissions needed in `strict` mode to make the upgrade easier. The permissions will not have any effect until the cluster is in `strict` mode. If you plan to remain in `permissive` mode indefinitely, skip to [Create a config.json file](#create-json).

If you are in `strict` mode or want to be ready to upgrade to `strict` mode, continue to the next section.

## Creating and assigning the permissions

The DC/OS Enterprise CLI can be used to rapidly provision the Jenkins service account.  You must also log in via `dcos auth login` as a superuser.

**Note:** Replace `nobody` with the appropriate user for your deployment.
   ```bash
   
    dcos security org users grant jenkins-principal dcos:mesos:master:framework:role:* read
    dcos security org users grant jenkins-principal dcos:mesos:master:framework:role:* create
    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:role:* read
    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:role:* create
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:role:* read
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:role:* create
    
    dcos security org users grant jenkins-principal dcos:mesos:master:task:user:nobody create
    dcos security org users grant jenkins-principal dcos:mesos:agent:task:user:nobody create

    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:principal:jenkins-principal delete
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:principal:jenkins-principal delete
   ```

# Create a config.json file

The contents of the `config.json` file will vary according to your security mode. We provide two examples below, one for each security mode. Locate the sample appropriate to your security mode, copy the JSON, paste it into a new file, and save it as `config.json`.

`strict` **mode**

```json
{
  "service": {
    "name": "jenkins",
    "user": "nobody",
    "security": {
      "service-account": "jenkins-principal",
      "secret-name": "jenkins/private_key",
      "strict-mode": true
    }
  }
}
```

`permissive` **mode**

```json
{
  "service": {
    "name": "jenkins",
    "user": "nobody",
    "security": {
      "service-account": "jenkins-principal",
      "secret-name": "jenkins/private_key",
      "strict-mode": false
    }
  }
}
```

If you have modified any of the values shown in the previous sections, change the values in the following JSON as appropriate.


## Install Jenkins

To install the service, complete the following command.

```bash
dcos package install --options=config.json beta-jenkins
```
---
# Quota enforced Multi-Tenant Jenkins

The DC/OS Jenkins service starting with DC/OS 2.0 supports multi-tenancy. Users should familiarize themselves with [Quota](/mesosphere/dcos/latest/multi-tenancy/quota-management) and [Resource Managment Primitives](/mesosphere/dcos/latest/multi-tenancy/resource-mgmt-primitives/) in DC/OS.

**Note:** We will use `/dev/jenkins` as the name of the service for the quota enabled multi-tenant examples below.
- DC/OS 2.0 and later clusters
`dev` will be the group in which the Jenkins service will be deployed as well as the *role* which the service will use. In `strict` mode, the service will require permissions granted for this `dev` role.
- DC/OS 1.13 and older clusters
`dev` will be the group in which the Jenkins service will be deployed. The *role* used by the service can be configured with the default of `*`.  In `strict` mode, the service will require permissions granted for this `*` role.

### Role used by Jenkins Agents
- DC/OS 2.0 and later clusters - 
When quota is enforced on the group, the Jenkins agents will inherit the same role as the Jenkins master.
- DC/OS 1.13 and older clusters - 
The role used by the Jenkins agents can be configured via `service.roles.jenkins-agent-role` in the configuration options.


## Pre-requisites
1. [Create a Key-Pair](#Create-a-Key-Pair) if you haven't already done so.
1. [Create a service account](#Create-a-service-account) if you haven't already done so.


### Create a file based secret with the jenkins private key:

**Note:** This step is required by the Jenkins master scheduler to authenticate with Mesos.

**Note:** This step creates a key for `dev/jenkins` service.

```bash
dcos security secrets create -f ./jenkins-private-key.pem dev/jenkins/private_key
```

## Creating and assigning the permissions

The DC/OS Enterprise CLI can be used to rapidly provision the Jenkins service account.  You must also log in via `dcos auth login` as a superuser.

**Note:** Replace `dev` & `nobody` with the appropriate role and user for your deployment.
   ```bash
   
    dcos security org users grant jenkins-principal dcos:mesos:master:framework:role:dev read
    dcos security org users grant jenkins-principal dcos:mesos:master:framework:role:dev create
    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:role:dev read
    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:role:dev create
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:role:dev read
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:role:dev create
    
    dcos security org users grant jenkins-principal dcos:mesos:master:task:user:nobody create
    dcos security org users grant jenkins-principal dcos:mesos:agent:task:user:nobody create

    dcos security org users grant jenkins-principal dcos:mesos:master:reservation:principal:jenkins-principal delete
    dcos security org users grant jenkins-principal dcos:mesos:master:volume:principal:jenkins-principal delete
   ```

# Create a config.json file

The contents of the `config.json` file will vary according to your security mode. We provide two examples below, one for each security mode. Locate the sample appropriate to your security mode, copy the JSON, paste it into a new file, and save it as `config.json`.

- **Note**: `roles.jenkins-master-role` must  match the quota role which is `dev` in this example.

`strict` **mode**

```json
{
  "service": {
    "name": "dev/jenkins",
    "user": "nobody",
    "roles": {
      "jenkins-master-role": "dev"
    },
    "security": {
      "service-account": "jenkins-principal",
      "secret-name": "dev/jenkins/private_key",
      "strict-mode": true
    }
  }
}
```

`permissive` **mode**

```json
{
  "service": {
    "name": "dev/jenkins",
    "user": "nobody",
    "roles": {
      "jenkins-master-role": "dev"
    },
    "security": {
      "service-account": "jenkins-principal",
      "secret-name": "dev/jenkins/private_key",
      "strict-mode": false
    }
  }
}
```

## Install Jenkins

To install the service, complete the following command.

```bash
dcos package install --options=config.json beta-jenkins
```

Please see the [Jenkins documentation](/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/custom-install) for more information about how to use the JSON file to install the service.
