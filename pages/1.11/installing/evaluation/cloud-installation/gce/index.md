---
layout: layout.pug
excerpt: Running a DC/OS cluster on Google Compute Engine using Terraform
title: Running DC/OS on Google Compute Engine
navigationTitle: GCE
menuWeight: 20
oss: true
---

# Terraform

The recommended way to deploy a OSS DC/OS cluster on GCE is by using [Terraform](#terraform).

**Disclaimer: Please note this is a [community driven project](https://github.com/dcos/terraform-dcos/tree/master/gcp) and not officially supported by Mesosphere.**

## Prerequisites
- [Terraform 0.11.x](https://www.terraform.io/downloads.html)
- Google Cloud Platform (GCP) Credentials [configured via: `gcloud auth login`](https://cloud.google.com/sdk/downloads)
- SSH Keys
- Existing Google Project. This is automated with Terraform using project creation as documented [here.](https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform)

## Authenticate to Google
Authenticate to the Google Cloud Platform using the credentials listed in the Prerequisites. Your credentials will be downloaded locally for Terraform to use. 

```bash
$ gcloud auth login
```

## Configure your GCP SSH Keys
You must set the private key that you will be using with `ssh-agent` and `set public key` in Terraform. Setting a private key will allow you to log in to to the cluster after DC/OS is deployed. A private key also helps Terraform set up your cluster at deployment time.

```bash
$ ssh-add ~/.ssh/your_private_key.pem
```

```bash
$ cat desired_cluster_profile.tfvars
gcp_ssh_pub_key_file = "INSERT_PUBLIC_KEY_PATH_HERE"
...
```

## Configure a Pre-existing Google Project

Currently `terraform-dcos` assumes that a project already exists in GCP, for you to start deploying your resources against. This repository will soon have support for Terraform to create projects on behalf of the user via this [document](https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform). For now, you will have to create this project ahead of time, or else use an existing project.

```bash
$ cat desired_cluster_profile.tfvars
gcp_project = "massive-bliss-781"
...
```

## Example of Terraform Deployments

### Quick Start

The typical defaults to experiment with DC/OS are listed as follows:

- Three agents will be deployed for you: two private agents and one public agent.
- It is not required to `git clone` this repository. Terraform does this for you.

 Run the following commands to deploy a multi-master setup in the cloud.

```bash
terraform init -from-module github.com/dcos/terraform-dcos//gcp
terraform apply -var gcp_project="your_existing_project"
```

### Custom `terraform-dcos` variables

The default variables are tracked in the [variables.tf](https://github.com/dcos/terraform-dcos/blob/master/gcp/variables.tf) file. However, if you run `terraform get --updates` when you want to fetch new releases of DC/OS upgrade to, this file may get overwritten. Therefore, it is best to use the [desired_cluster_profile.tfvars](https://github.com/dcos/terraform-dcos/blob/master/gcp/desired_cluster_profile.tfvars.example) and set your custom Terraform and DC/OS flags there. This way you can keep track of a single file that you can use to manage hroughout the lifecycle of your cluster.

For a list of supported operating systems for this repository, see the ones that DC/OS recommends [here](https://docs.mesosphere.com/1.10/installing/oss/custom/system-requirements/). You can find the list that Terraform supports [here](http://github.com/bernadinm/tf_dcos_core).

To apply the configuration file, run the following command:

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

#### Advanced YAML configuration

We have designed this task to be flexible. In the following example, the working variables allow customization using a single `tfvars` file.

For advanced users with stringent requirements, here are the DC/OS flag examples where you can simply paste your YAML configuration into your `desired_cluster_profile.tfvars`. The alternative to YAML is to convert it to JSON.

```bash
$ cat desired_cluster_profile.tfvars
dcos_version = "1.10.2"
os = "centos_7.3"
num_of_masters = "3"
num_of_private_agents = "2"
num_of_public_agents = "1"
expiration = "6h"
dcos_security = "permissive"
dcos_cluster_docker_credentials_enabled =  "true"
dcos_cluster_docker_credentials_write_to_etc = "true"
dcos_cluster_docker_credentials_dcos_owned = "false"
dcos_cluster_docker_registry_url = "https://index.docker.io"
dcos_overlay_network = <<EOF
# YAML
    vtep_subnet: 44.128.0.0/20
    vtep_mac_oui: 70:B3:D5:00:00:00
    overlays:
      - name: dcos
        subnet: 12.0.0.0/8
        prefix: 26
EOF
dcos_rexray_config = <<EOF
# YAML
  rexray:
    loglevel: warn
    modules:
      default-admin:
        host: tcp://127.0.0.1:61003
    storageDrivers:
    - ec2
    volume:
      unmount:
        ignoreusedcount: true
EOF
dcos_cluster_docker_credentials = <<EOF
# YAML
  auths:
    'https://index.docker.io/v1/':
      auth: Ze9ja2VyY3licmljSmVFOEJrcTY2eTV1WHhnSkVuVndjVEE=
EOF
gcp_ssh_pub_key_file = "INSERT_PUBLIC_KEY_PATH_HERE"
```
**Note:** The YAML comment is required for the DC/OS specific YAML settings.

## Upgrading DC/OS

You can upgrade your DC/OS cluster with a single command. This Terraform script was built to perform installs and upgrades. With the upgrade procedures below, you can also have finer control on how masters or agents upgrade at a given time. This will allow you to change the parallelism of master or agent upgrades.

### DC/OS Upgrades

#### Rolling upgrade

Supported upgrade by dcos.io

##### Masters sequential, agents parallel:
```bash
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade -target null_resource.bootstrap -target null_resource.master -parallelism=1
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade
```

##### All roles simultaneously
This command is not supported by dcos.io, but it works without `dcos_skip_checks` enabled.

```bash
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade
```

## Maintenance

If you would like to add or remove private or public agents from your cluster, you can do so by telling Terraform your desired state and it will make the required changes. For example, if you have two private agents and one public agent in your `-var-file`,  you can override that flag by specifying the `-var` flag. The `var` flag has higher priority than the `-var-file`.

### Adding agents

```bash
terraform apply \
-var-file desired_cluster_profile.tfvars \
-var num_of_private_agents=5 \
-var num_of_public_agents=3
```

### Removing agents
**Caution**: Always remember to save your desired state in your `desired_cluster_profile.tfvars` before removing an agent.

```bash
terraform apply \
-var-file desired_cluster_profile.tfvars \
-var num_of_private_agents=1 \
-var num_of_public_agents=1
```

## Redeploy an existing master

If you want to redeploy a problematic master (for example, your storage has filled up, the cluster is not responsive), you can tell Terraform to redeploy during the next cycle.

**Note:** This only applies to DC/OS clusters that have set their `dcos_master_discovery` to `master_http_loadbalancer` and not `static`.

### Master Node

#### Taint master node

```bash
terraform taint google_compute_instance.master.0 # The number represents the agent in the list.
```

#### Redeploy master node

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

## Redeploy an existing agent

If you want to redeploy a problematic agent, you can tell Terraform to redeploy during the next cycle.


### Private Agents

#### Taint private agent

```bash
terraform taint google_compute_instance.agent.0 # The number represents the agent in the list.
```

#### Redeploy agent

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```


### Public Agents

#### Taint private agent

```bash
terraform taint google_compute_instance.public-agent.0 # The number represents the agent in the list
```

#### Redeploy agent

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

### Experimental [experimental type="inline" size="large" /]

#### Adding GPU private agents

Coming soon!

### Destroying a cluster

You can shut down and/or destroy all resources from your environment by running the following command:

```bash
terraform destroy -var-file desired_cluster_profile.tfvars
```
