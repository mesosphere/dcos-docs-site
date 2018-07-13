---
layout: layout.pug
navigationTitle:  Installing Edge-LB
title: Installing Edge-LB
menuWeight: 10
excerpt: Configuring a service account and installing Edge-LB
enterprise: false
---

Configure a service account and install the Edge-LB package using the instructions below.

**Prerequisites:**

- [DC/OS CLI is installed](/latest/cli/install/)
- You are logged in as a superuser
- The [DC/OS Enterprise CLI is installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/).
- You have access to [the remote Edge-LB repositories](https://support.mesosphere.com/hc/en-us/articles/213198586).

**Limitations**
- Currently, Edge-LB works only with DC/OS Enterprise in permissive mode on DC/OS 1.10, and permissive or strict mode on DC/OS 1.11 [security mode](/latest/security/ent/#security-modes). It does not work with disabled mode.

# Add Edge-LB package repositories
The Edge-LB package is composed of two components: the Edge-LB API server and the Edge-LB pools. You must install universe repos for the Edge-LB API server and the Edge-LB pool in order to install Edge-LB. The Edge-LB API server is a restful API that manages one or more Edge-LB pools. Each Edge-LB pool is a collection of load balancers. An Edge-LB pool can be used to launch one or more instances of a load balancer to create a single highly available load balancer. Currently the Edge-LB pool supports only HAProxy as a load balancer.

**Note** If your environment is behind a firewall or otherwise not able to access the public catalog, then you must use a local catalog.

1. Download the artifacts for each of the repos from the [Mesosphere support page](https://support.mesosphere.com/hc/en-us/articles/213198586).

**Note:** You must have a service account to do this.

2. Once you have the links to the artifacts for the Edge-LB API server and Edge-LB pool repos, use the following command to add them to the universe package repository:

```bash
dcos package repo add --index=0 edgelb-aws \
  https://<insert download link>/stub-universe-edgelb.json
```

```bash
dcos package repo add --index=0 edgelb-pool-aws \
  https://<insert download link>/{{stub-universe-edgelb-pool.json}}
```

[enterprise]
# Build your own local Universe
[/enterprise]

## Adding Stub Universes (Custom Universe Packages)
If you've been provided stub universe json files (such as for Edge-LB), you can add them to the local universe with the `add-stub-universe.sh` script.

You can specify a local stub universe json definition with `-j <path-to-json-file>` or a URL for stub universe json definition with `-u <url-for-json-file>`

Each run of the add-stub-universe.sh will process the json file and generate the necessary json and mustache files, and add them to `stub-repo/packages/<X>/<packagename>`.  Once all of your stub universe packages have been added into `stub-repo`, you can merge them into the primary `universe/repo/packages` and specify them in any of the standard local universe scripts.

For example:
```bash
bash add-stub-universe.sh -j stub-universe-custom.json
bash add-stub-universe.sh -u https://<url-path>/online-stub-universe.json
```

From there, they can be merged into the primary `universe/repo/packages` directory:

```bash
cp -rpv stub-repo/packages/* ../../repo/packages
```

Then, you could potentially build the rest of your universe with the regular workflow:

```bash
sudo make DCOS_VERSION=<your DC/OS version> DCOS_PACKAGE_INCLUDE="<custom-package>:0.1,<other-custom-package>:0.5" local-universe
```

Here's a full example:
```bash
# bash add-stub-universe.sh -j stub-universe-custom.json
Building repo structure for custom...

Full stub-repo contents:
total 40
drwxr-xr-x  7 justin  staff   238B Jan 18 23:31 .
drwxr-xr-x  3 justin  staff   102B Jan 18 23:31 ..
-rw-r--r--  1 justin  staff   144B Jan 18 23:31 command.json
-rw-r--r--  1 justin  staff   1.7K Jan 18 23:31 config.json
-rw-r--r--  1 justin  staff   1.5K Jan 18 23:31 marathon.json.mustache
-rw-r--r--  1 justin  staff   384B Jan 18 23:31 package.json
-rw-r--r--  1 justin  staff   1.7K Jan 18 23:31 resource.json

# bash add-stub-universe.sh -u https://<url-path>/online-stub-universe.json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 13449  100 13449    0     0  22012      0 --:--:-- --:--:-- --:--:-- 22011
Building repo structure for custom-online...

Full stub-repo contents:
stub-repo/packages/C/custom-online/0:
total 48
drwxr-xr-x  7 justin  staff   238B Jan 18 23:31 .
drwxr-xr-x  3 justin  staff   102B Jan 18 23:31 ..
-rw-r--r--  1 justin  staff   149B Jan 18 23:31 command.json
-rw-r--r--  1 justin  staff   4.5K Jan 18 23:31 config.json
-rw-r--r--  1 justin  staff   3.4K Jan 18 23:31 marathon.json.mustache
-rw-r--r--  1 justin  staff   411B Jan 18 23:31 package.json
-rw-r--r--  1 justin  staff   2.2K Jan 18 23:31 resource.json

stub-repo/packages/C/custom/0:
total 40
drwxr-xr-x@ 7 justin  staff   238B Jan 18 23:31 .
drwxr-xr-x@ 3 justin  staff   102B Jan 18 23:31 ..
-rw-r--r--@ 1 justin  staff   144B Jan 18 23:31 command.json
-rw-r--r--@ 1 justin  staff   1.7K Jan 18 23:31 config.json
-rw-r--r--@ 1 justin  staff   1.5K Jan 18 23:31 marathon.json.mustache
-rw-r--r--@ 1 justin  staff   384B Jan 18 23:31 package.json
-rw-r--r--@ 1 justin  staff   1.7K Jan 18 23:31 resource.json

# cp -rpv stub-repo/packages/* ../../repo/packages
stub-repo/packages/C -> ../../repo/packages/E
stub-repo/packages/C/custom -> ../../repo/packages/C/custom
stub-repo/packages/C/custom/0 -> ../../repo/packages/C/custom/0
stub-repo/packages/C/custom/0/command.json -> ../../repo/packages/C/custom/0/command.json
stub-repo/packages/C/custom/0/config.json -> ../../repo/packages/C/custom/0/config.json
stub-repo/packages/C/custom/0/marathon.json.mustache -> ../../repo/packages/C/custom/0/marathon.json.mustache
stub-repo/packages/C/custom/0/package.json -> ../../repo/packages/C/custom/0/package.json
stub-repo/packages/C/custom/0/resource.json -> ../../repo/packages/C/custom/0/resource.json
stub-repo/packages/C/custom-online -> ../../repo/packages/C/custom-online
stub-repo/packages/C/custom-online/0 -> ../../repo/packages/C/custom-online/0
stub-repo/packages/C/custom-online/0/command.json -> ../../repo/packages/C/custom-online/0/command.json
stub-repo/packages/C/custom-online/0/config.json -> ../../repo/packages/C/custom-online/0/config.json
stub-repo/packages/C/custom-online/0/marathon.json.mustache -> ../../repo/packages/C/custom-online/0/marathon.json.mustache
stub-repo/packages/C/custom-online/0/package.json -> ../../repo/packages/C/custom-online/0/package.json
stub-repo/packages/C/custom-online/0/resource.json -> ../../repo/packages/C/custom-online/0/resource.json

# sudo make DCOS_VERSION=1.10.4 DCOS_PACKAGE_INCLUDE="custom:0.1,custom-online:0.5" local-universe
... Local universe build output here ...
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
dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```

**Tip:** List the secrets with this command.

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

* `service.name`: `"dcos-edgelb/api"`. The service path for the apiserver. `dcos-edgelb` corresponds to `pool.namespace` when [configuring pools](/services/edge-lb/1.0/pool-configuration/).
* `service.logLevel`: `"info"`. Can be one of `debug`, `info`, `warn`, or `error`
* `service.cpus`: `1.0`
* `service.mem`: `1024`

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

- For more information about configuring Edge-LB, see the [Edge-LB Configuration](/services/edge-lb/1.0/pool-configuration) section.
- For more information about the available Edge-LB commands, see the [Edge-LB Command Reference](/services/edge-lb/1.0/cli-reference).
