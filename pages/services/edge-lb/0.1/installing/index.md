---
layout: layout.pug
navigationTitle:  Installing Edge-LB
title: Installing Edge-LB
menuWeight: 10
excerpt:

enterprise: false
---

Configure a service account and install the Edge-LB package using the instructions below.

**Prerequisites:**

- [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.
- The [DC/OS Enterprise CLI installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/).
- Access to [the remote Edge-LB repositories](https://support.mesosphere.com/hc/en-us/articles/213198586).

**Limitations**
- Currently, Edge-LB works only with DC/OS Enterprise in permissive [security mode](/latest/security/ent/#security-modes). It does not work with strict or disabled.

# Add Edge-LB package repositories
The Edge-LB package is composed of two components: the Edge-LB API server and the Edge-LB pools. You must install universe repos for the Edge-LB API server and the Edge-LB pool in order to install Edge-LB. The Edge-LB API server is a restful API that manages one or more Edge-LB pools. Each Edge-LB pool is a collection of load balancers. An Edge-LB pool can be used to launch one or more instances of a load balancer to create a single highly available load balancer. Currently the Edge-LB pool supports only HAProxy as a load balancer.

Download the artifacts for each of the repos from the [Mesosphere support page](https://support.mesosphere.com/hc/en-us/articles/213198586).

Once you have the links to the artifacts for the Edge-LB API server and Edge-LB pool repos, use the following command to add them to the universe package repository:

```bash
dcos package repo add --index=0 edgelb-aws \
  https://<AWS S3 bucket>/stub-universe-edgelb.json
dcos package repo add --index=0 edgelb-pool-aws \
  https://<AWS S3 bucket>/stub-universe-edgelb-pool.json
```

# Create a service account
The Edge-LB API server needs to be associated with a service account so that it can launch Edge-LB pools on public and private nodes, based on user requests.

[Service accounts](/latest/security/ent/service-auth/) are used in conjunction with public-private key pairs, secrets, permissions, and authentication tokens to provide access for DC/OS services to DC/OS. Service accounts control the communications and DC/OS API actions that the services are permitted to make.

Follow the steps below to create a service account, a principal associated with the service account, assign permissions to this principle, and associate a secret store with this service account. The secret store is used by Edge-LB to retrieve and install TLS certificates on the Edge-LB pools in order to enable TLS for all HTTP traffic between client and service backends.

## <a name="create-a-keypair"></a>Create a key pair
In this step, a 2048-bit RSA public-private key pair is created using the DC/OS Enterprise CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
```

**Tip:** You can use the [DC/OS Secret Store](/latest/security/ent/secrets/) to secure the key pair.

## Create the principal
From a terminal prompt, create a new service account (`edge-lb-principal`) containing the public key (`edge-lb-public-key.pem`).

```bash
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
```

**Tip:** Verify your new service account using the following command.

```bash
dcos security org service-accounts show edge-lb-principal
```

## <a name="create-an-sa-secret"></a>Create a secret
Create a secret (`dcos-edgelb/edge-lb-secret`) with your service account (`edge-lb-principal`) and private key specified (`edge-lb-private-key.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and path are `edge-lb`), then only the service named `edge-lb` can access it.

```bash
dcos security secrets create-sa-secret edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```

**Tip:** List the secrets with this command.

```bash
dcos security secrets list /
```

## <a name="give-perms"></a>Create and Assign Permissions

Use the following CLI commands to provision the Edge-LB service account with the required permissions.

All CLI commands can also be executed via the [IAM API](/latest/security/ent/iam-api/).

1.  Grant the permissions and the allowed actions to the service account using the following commands. The commands below allow your Edge-LB service to manage DC/OS packages, Marathon tasks, Edge-LB pools and tasks.

    ```bash
    dcos security org users grant edge-lb-principal dcos:adminrouter:package full --description "Allow access to manage DC/OS packages"
    dcos security org users grant edge-lb-principal dcos:adminrouter:service:marathon full --description "Allow access to manage marathon tasks"
    dcos security org users grant edge-lb-principal dcos:service:marathon:marathon:services:/dcos-edgelb full --description "Allow access to manage dcos-edgelb tasks"
    dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools full --description "Allow access to update pools"
    ```

For more information about required permissions, please see the [Edge-LB Permissions](/services/edge-lb/0.1/permissions)

# <a name="create-json"></a>Create a configuration file for service authentication
After configuring service authentication, you must create a JSON options file with your credentials. This file will be passed to DC/OS when you install Edge-LB.

In the file, specify the service account secret (`dcos-edgelb/edge-lb-secret`) that you created earlier.

```json
{
  "service": {
    "secretName": "dcos-edgelb/edge-lb-secret"
  }
}
```

Save the file with a meaningful name, such as `edge-lb-options.json`. Keep this file in source control so that you can quickly update configuration at a later time.

# <a name="install-edge-lb"></a>Install Edge-LB
Install Edge-LB with this command.

```bash
dcos package install --options=edge-lb-options.json edgelb
```

Run this command and wait for the Edge-LB service to be ready.

```bash
until dcos edgelb ping; do sleep 1; done
```

You should receive this message when ready:

```bash
pong
```

- For more information about configuring Edge-LB, see the [Edge-LB Configuration](/services/edge-lb/0.1/pool-configuration) section.
- For more information about the available Edge-LB commands, see the [Edge-LB Command Reference](/services/edge-lb/0.1/cli-reference).
