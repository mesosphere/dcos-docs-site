---
layout: layout.pug
navigationTitle:  Installing
title: Installing
menuWeight: 10
excerpt: Configuring a service account and installing Edge-LB
enterprise: false
---

To configure a service account and install the Edge-LB package, use the instructions below.

# Prerequisites

- [DC/OS CLI is installed](/1.12/cli/install/)
- You are logged in as a superuser.
- The [DC/OS Enterprise CLI is installed](/1.12/cli/enterprise-cli/).
- You have access to [the remote Edge-LB repositories](https://support.mesosphere.com/hc/en-us/articles/213198586).

<p class="message--important"><strong>IMPORTANT: </strong>You must have a customer service account to log in as a superuser and download the remote Edge-LB repositories.</p>

## Limitations

- Edge-LB supports all [security modes](/1.12/security/ent/#security-modes) in DC/OS 1.11 and later. It supports Permissive, Disabled in DC/OS 1.10. DC/OS 1.9 or earlier is not supported.

# Add Edge-LB package repositories
The Edge-LB package comprises two components:

- The **Edge-LB API server** is a restful API that manages one or more Edge-LB pools. Each Edge-LB pool is a collection of load balancers.

- An **Edge-LB pool** can be used to launch one or more instances of a load balancer to create a single highly available load balancer. Currently the Edge-LB pool supports only HAProxy as a load balancer.

You must install Universe repositories for the Edge-LB API server and the Edge-LB pool in order to install Edge-LB.

<p class="message--note"><strong>NOTE: </strong>If your environment is behind a firewall or otherwise not able to access the public catalog, then you must use a local catalog.</p>


## Obtaining package artifacts


In order to install both packages, you need to obtain package artifacts. They can be downloaded from <a href="https://support.mesosphere.com/hc/en-us/articles/213198586">Mesosphere customer support site</a>.

<p class="message--note"><strong>NOTE: </strong>You will get a "page not found" message if you attempt to download the artifacts without logging in using your customer service account.</p>

Once you have these artifacts, they need to be made accesible to the cluster via an HTTP server. The address of the HTTP server will be used in the next step.


## Add them to the package repository

Having the address where the artifacts for the Edge-LB API server and Edge-LB pool repos are available, use the following command to add them to the universe package repository:


```bash
dcos package repo add --index=0 edgelb  https://<insert download link>/stub-universe-edgelb.json
```

```bash
dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
```

[enterprise]
## <a name="build"></a>Deploying a local Universe containing Edge-LB
[/enterprise]

If you need to deploy a local Universe containing your own set of packages, you must build a customized local Universe Docker image. The following instructions are based on the [DC/OS universe deployment instructions](https://docs.mesosphere.com/1.12/administering-clusters/deploying-a-local-dcos-universe/#certified).

**Prerequisite:** [Git](https://git-scm.com/). On Unix/Linux, see these [Getting Started instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1.  Clone the Universe repository:

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

1.  Build the `universe-base` image:

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

1. Use `add-stub-universe.sh` script to add to the Universe the JSON definitions obtained in [Obtaining package artifacts](https://docs.mesosphere.com/services/edge-lb/1.2/installing/#obtaining-package-artifacts) section.  Each run of the `add-stub-universe.sh` script will process the JSON file, generate the necessary JSON and Mustache files, and add them to `stub-repo/packages/<X>/<packagename>`.

```bash
bash add-stub-universe.sh -j stub-universe-edgelb.json
```

```bash
bash add-stub-universe.sh -j stub-universe-edgelb-pool.json
```

1. From there, they can be merged into the primary `universe/repo/packages` directory:

```bash
cp -rpv stub-repo/packages/* ../../repo/packages
```

1. You can then build the `mesosphere/universe` Docker image and compress it to the `local-universe.tar.gz` file. Specify a comma-separated list of package names and versions using the `DCOS_PACKAGE_INCLUDE` variable. To minimize the container size and download time, you can select only what you need. If you do not use the `DCOS_PACKAGE_INCLUDE` variable, all Certified Universe packages are included. To view which packages are Certified, click the **Catalog** tab in the DC/OS web interface.

    ```bash
    sudo make DCOS_VERSION=1.12 DCOS_PACKAGE_INCLUDE=“edgelb:v1.2.1,edgelb-pool:v1.2.1,<other-package>:<version>” local-universe
    ```

1.  Perform all of the steps as described in [Deploying a local Universe containing Certified Universe packages](/latest/administering-clusters/deploying-a-local-dcos-universe/#deploying-a-local-universe-containing-certified-universe-packages).


# Create a service account
The Edge-LB API server must be associated with a service account so that it can launch Edge-LB pools on public and private nodes, based on user requests.

[Service accounts](/1.12/security/ent/service-auth/) are used in conjunction with public-private key pairs, secrets, permissions, and authentication tokens to provide access for DC/OS services to DC/OS. Service accounts control the communications and DC/OS API actions that the services are permitted to make.

Follow the steps below to create a service account, a principal associated with the service account, assign permissions to this principle, and associate a secret store with this service account. The secret store is used by Edge-LB to retrieve and install TLS certificates on the Edge-LB pools in order to enable TLS for all HTTP traffic between client and service backends.

The steps below require [DC/OS Enterprise CLI to be installed](/1.12/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)

## <a name="create-a-keypair"></a>Create a key pair
In this step, a 2048-bit RSA public-private key pair is created using the DC/OS Enterprise CLI. Create a public-private key pair and save each value into a separate file within the current directory. 

```bash
dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
```

<p class="message--note"><strong>NOTE: </strong>You can use the <a href="/1.12/security/ent/secrets/">DC/OS Secret Store</a> to secure the key pair.</p>

## Create the principal
From a terminal prompt, create a new service account (`edge-lb-principal`) containing the public key (`edge-lb-public-key.pem`).

```bash
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
```

Verify your new service account using the following command.

```bash
dcos security org service-accounts show edge-lb-principal
```

## <a name="create-an-sa-secret"></a>Create a secret
Create a secret (`dcos-edgelb/edge-lb-secret`) with your service account (`edge-lb-principal`) and private key specified (`edge-lb-private-key.pem`).

<p class="message--important"><strong>NOTE: </strong>If you store your secret in a path that matches the service name (for example, service name and path are both <code>edge-lb</code>), then only the service named <code>edge-lb</code> can access it.</p>

```bash
dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```
If you are installing Edge-LB on a cluster in security mode **disabled**, remove the `--strict` parameter:

```bash
dcos security secrets create-sa-secret edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```
List the secrets with this command and confirm that the secret was created.

```bash
dcos security secrets list /
```

## <a name="give-perms"></a>Create and Assign Permissions

Use the following CLI commands to provision the Edge-LB service account with the required permissions. All CLI commands can also be executed via the [IAM API](/1.12/security/ent/iam-api/).

One of two methods can be used to securely provision the Edge-LB service account with the required permissions:

1. Add `edge-lb-principal` to the `superusers` group
2. Grant actions which are limited to Edge-LB related tasks

### Add service account to superusers

Adding `edge-lb-principal` to the `superusers` group will ensure that the service account is sufficiently provisioned as pools are created. As new features are added to Edge-LB in future releases, having elevated permissions will also make upgrades simpler.

```bash
dcos security org groups add_user superusers edge-lb-principal
```

### Grant limited actions to service account

<p class="message--note"><strong>NOTE: </strong>These steps are not necessary if you added <code>edge-lb-principal</code> to the <code>superusers</code> group.</p>

These more limited permissions include management of DC/OS packages, Marathon tasks, Edge-LB pools and tasks. They also enable Edge-LB pool framework schedulers to register with mesos master and launch load-balancer tasks.

```bash
dcos security org users grant edge-lb-principal dcos:adminrouter:service:marathon full
dcos security org users grant edge-lb-principal dcos:adminrouter:package full
dcos security org users grant edge-lb-principal dcos:adminrouter:service:edgelb full
dcos security org users grant edge-lb-principal dcos:service:marathon:marathon:services:/dcos-edgelb full
dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1 full
dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1/scheduler full
dcos security org users grant edge-lb-principal dcos:mesos:master:framework:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:framework:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:volume:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:volume:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:task:user:root full
dcos security org users grant edge-lb-principal dcos:mesos:master:task:app_id full
```

<p class="message--note"><strong>NOTE: </strong>This permission needs to be granted <strong>for each Edge-LB pool created</strong>.</p>

```bash
dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME> full
```

For more information about required permissions, please see the [Edge-LB Permissions](/services/edge-lb/1.2/permissions/)

# <a name="create-json"></a>Create a configuration file for service authentication
After configuring service authentication, you must create a JSON options file with your credentials. This file will be passed to DC/OS when you install Edge-LB.

In the file, specify the service account secret (`dcos-edgelb/edge-lb-secret`) that you created earlier.

```json
{
  "service": {
    "secretName": "dcos-edgelb/edge-lb-secret",
    "principal": "edge-lb-principal",
    "mesosProtocol": "https"
  }
}
```
EdgeLB also needs the following options to be specified. Their values depend on the security mode of the cluster it is running on:

* `service.mesosProtocol`: `"https"` for Permissive and Strict security modes, `"http"` (default) for Disabled security mode
* `service.mesosAuthNZ`: `true` (default) for Permissive and Strict security modes, `false` for Disabled security mode. Parameter is available begining version v1.1.

Other useful configurable service parameters include:

* `service.name`: `"dcos-edgelb/api"`. The service path for the `apiserver`. `dcos-edgelb` corresponds to `pool.namespace` when [configuring pools](/services/edge-lb/1.2/pool-configuration/).
* `service.logLevel`: `"info"`. Can be one of `debug`, `info`, `warn`, or `error`
* `service.cpus`: `1.1`
* `service.mem`: `1024`

Save the file with a meaningful name, such as `edge-lb-options.json`. Keep this file in source control so that you can quickly update your configuration at a later time.

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

- For more information about configuring Edge-LB, see the [Edge-LB Configuration](/services/edge-lb/1.2/pool-configuration/) section.
- For more information about the available Edge-LB commands, see the [Edge-LB Command Reference](/services/edge-lb/1.2/cli-reference/).
