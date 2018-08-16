---
layout: layout.pug
navigationTitle:  Installing Edge-LB
title: Installing Edge-LB
menuWeight: 10
excerpt: Configuring a service account and installing Edge-LB
enterprise: false
---

To configure a service account and install the Edge-LB package, use the instructions below.

**Prerequisites:**

- [DC/OS CLI is installed](/latest/cli/install/)
- You are logged in as a superuser.
- The [DC/OS Enterprise CLI is installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/).
- You have access to [the remote Edge-LB repositories](https://support.mesosphere.com/hc/en-us/articles/213198586).

**Limitations**
- Currently, Edge-LB works only with DC/OS Enterprise in permissive mode on DC/OS 1.10, and permissive or strict mode on DC/OS 1.11 [security mode](/latest/security/ent/#security-modes). It does not work in disabled mode.

# Add Edge-LB package repositories
The Edge-LB package comprises two components:
- Edge-LB API server
- Edge-LB pools

In order to install Edge-LB, you must install universe repositories for the Edge-LB API server and the Edge-LB pool. The Edge-LB API server is a RESTful API that manages one or more Edge-LB pools. Each Edge-LB pool is a collection of load balancers. An Edge-LB pool can be used to launch one or more instances of a load balancer to create a single highly available load balancer. Currently the Edge-LB pool supports only HAProxy as a load balancer.

**Note** If your environment is behind a firewall or otherwise not able to access the public catalog, then you must use a local catalog.

1. Download the artifacts for each of the repos from the [Mesosphere support page](https://support.mesosphere.com/hc/en-us/articles/213198586).

**Note:** You must have a service account to do this.

2. Once you have the links to the artifacts for the Edge-LB API server and Edge-LB pool repositories, use the following command to add them to the universe package repository:

```bash
dcos package repo add --index=0 edgelb  https://<insert download link>/stub-universe-edgelb.json
```

```bash
dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
```

[enterprise]
## <a name="build"></a>Deploying a local Universe containing Edge-LB
[/enterprise]

If you need to deploy a local Universe containing your own set of packages, you must build a customized local Universe Docker image. The following instructions are based on the [DC/OS universe deployment instructions](https://docs.mesosphere.com/1.11/administering-clusters/deploying-a-local-dcos-universe/#certified).

**Prerequisite:** [Git](https://git-scm.com/). On Unix/Linux, see these [Getting Started instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1.  Clone the Universe repository:

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

2.  Build the `universe-base` image:

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

3. Obtain the Edge-LB stub universe JSON files from the support downloads site. Note that there are two files required:
- `stub-universe-edgelb.json`
- `stub-universe-edgelb-pool.json`

4. To add the JSON definitions to the universe, use the `add-stub-universe.sh` script.  Each run of the `add-stub-universe.sh` script will process the JSON file, generate the necessary JSON and Mustache files, and add them to `stub-repo/packages/<X>/<packagename>`.  

```bash
bash add-stub-universe.sh -j stub-universe-edgelb.json
```
```bash
bash add-stub-universe.sh -j stub-universe-edgelb-pool.json
```

5. From there, they can be merged into the primary `universe/repo/packages` directory:

```bash
cp -rpv stub-repo/packages/* ../../repo/packages
```

6. You can then build the `mesosphere/universe` Docker image and compress it to the `local-universe.tar.gz` file. Specify a comma-separated list of package names and versions using the `DCOS_PACKAGE_INCLUDE` variable. To minimize the container size and download time, you can select only what you need. If you do not use the `DCOS_PACKAGE_INCLUDE` variable, all Certified Universe packages are included. To view which packages are Certified, click the **Catalog** tab in the DC/OS web interface.

    ```bash
    sudo make DCOS_VERSION=1.11 DCOS_PACKAGE_INCLUDE=“edgelb:v1.0.3,edgelb-pool:stub-universe,<other-package>:<version>” local-universe
    ```

7.  Perform all of the steps as described in [Deploying a local Universe containing Certified Universe packages](https://docs.mesosphere.com/1.11/administering-clusters/deploying-a-local-dcos-universe/#deploying-a-local-universe-containing-certified-universe-packages).


# Create a service account
The Edge-LB API server must be associated with a service account so that it can launch Edge-LB pools on public and private nodes, based on user requests.

[Service accounts](/latest/security/ent/service-auth/) are used in conjunction with public-private key pairs, secrets, permissions, and authentication tokens to provide access for DC/OS services to DC/OS. Service accounts control the communications and DC/OS API actions that the services are permitted to make.

Follow the steps below to create a service account, a principal associated with the service account, assign permissions to this principle, and associate a secret store with this service account. The secret store is used by Edge-LB to retrieve and install TLS certificates on the Edge-LB pools in order to enable TLS for all HTTP traffic between client and service backends.

## <a name="create-a-keypair"></a>Create a key pair
In this step, a 2048-bit RSA public-private key pair is created using the DC/OS Enterprise CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
```

**Note:** You can use the [DC/OS Secret Store](/latest/security/ent/secrets/) to secure the key pair.

## Create the principal
From a terminal prompt, create a new service account (`edge-lb-principal`) containing the public key (`edge-lb-public-key.pem`).

```bash
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
```

**Note:** Verify your new service account using the following command.

```bash
dcos security org service-accounts show edge-lb-principal
```

## <a name="create-an-sa-secret"></a>Create a secret
Create a secret (`dcos-edgelb/edge-lb-secret`) with your service account (`edge-lb-principal`) and private key specified (`edge-lb-private-key.pem`).

**Note:** If you store your secret in a path that matches the service name (for example, service name and path are both `edge-lb`), then only the service named `edge-lb` can access it.

```bash
dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```

**Note:** List the secrets with this command.

```bash
dcos security secrets list /
```

## <a name="give-perms"></a>Create and Assign Permissions

Use the following CLI commands to provision the Edge-LB service account with the required permissions. All CLI commands can also be executed via the [IAM API](/latest/security/ent/iam-api/).

One of two methods can be used to securely provision the Edge-LB service account with the required permissions:

1. Add `edge-lb-principal` to the `superusers` group
2. Grant actions which are limited to Edge-LB related tasks

### Add service account to superusers

Adding `edge-lb-principal` to the `superusers` group will ensure that the service account is sufficiently provisioned as pools are created. As new features are added to Edge-LB in future releases, having elevated permissions will also make upgrades simpler.

```bash
dcos security org groups add_user superusers edge-lb-principal
```

### Grant limited actions to service account

**Note:** These steps are not necessary if you added `edge-lb-principal` to the `superusers` group.

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

**Note:** Additionally, this permission needs to be granted **for each Edge-LB pool created**:

```bash
dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME> full
```

For more information about required permissions, please see the [Edge-LB Permissions](/services/edge-lb/1.0/permissions)

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

Other useful configurable service parameters include:

* `service.name`: `"dcos-edgelb/api"`. The service path for the `apiserver`. `dcos-edgelb` corresponds to `pool.namespace` when [configuring pools](/services/edge-lb/1.0/pool-configuration/).
* `service.logLevel`: `"info"`. Can be one of `debug`, `info`, `warn`, or `error`
* `service.cpus`: `1.0`
* `service.mem`: `1024`
* `service.mesosProtocol`: `"https"` (default) for Permissive and Strict security modes, `"http"` for Disabled security mode

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

- For more information about configuring Edge-LB, see the [Edge-LB Configuration](/services/edge-lb/1.0/pool-configuration) section.
- For more information about the available Edge-LB commands, see the [Edge-LB Command Reference](/services/edge-lb/1.0/cli-reference).
