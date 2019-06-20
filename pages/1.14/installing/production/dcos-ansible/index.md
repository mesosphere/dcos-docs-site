---
layout: layout.pug
title: Installing and Managing DC/OS using Ansible
navigationTitle: DC/OS with Ansible
menuWeight: 16
excerpt: Creating and managing your infrastructure and installation using Ansible modules.
---

The Mesosphere DC/OS Ansible roles are now a supported life cycle management method for DC/OS alongside the Mesosphere Universal Installer. For users that are already using Ansible to manage their infrastructure and applications, the Ansible roles will be usable with only a few changes to their existing stack, as they have been developed with isolations and strict name spacing in mind. While they have been developed to work with infrastructure provisioned with the Mesosphere Universal Installer, they can be used in combination with any cloud and on-premise setups.

We have broken down the lifecycle management of DC/OS into 4 roles to handle the different management aspects of DC/OS such as cluster prerequisites, bootstrap tasks, master tasks, private agent tasks and public agent tasks. Each role can be read about more below:

- Prerequisites - This roles handles all of the [requirements to run DC/OS](/1.14/installing/production/system-requirements/#software-prerequisites).
- Bootstrap - The Boostrap role handles all tasks associated with downloading, generating and serving the DC/OS install and upgrade scripts to all nodes in the cluster.
- Master - These tasks include downloading install and upgrade files from the Bootstrap node as well as handling some checks to ensure that upgrade has gone accordingly. It will back out upgrades if there problems keeping the cluster from going into an undesired state.
- Agents - These task handle all upgrade and installation tasks for ALL agent types.


## About the Mesosphere DC/OS Ansibles roles

Use the [Mesosphere DC/OS Ansible roles](https://github.com/dcos/dcos-ansible) to install, upgrade and configure one or more DC/OS clusters using [Ansible](https://www.ansible.com/). The roles can be used in a both a new or existing Ansible setups and be downloaded from [the official Ansible Galaxy](https://galaxy.ansible.com/dcos/dcos_ansible).

<p class="message--note"><strong>NOTE: </strong>DC/OS Ansible roles are only available for CentOS and RHEL platforms at this time.</p>

## Creating test instances on AWS with terraform
If you would like to test out our Ansible solutions using pre-configured instances on AWS and are familiar with terraform, please [download and use this terraform script](https://gist.github.com/geekbass/45eb978fb420ae0da13f00fdfa0cd1c5) to deploy a sample infrastructure so that you can deploy DC/OS on it using the ansible script above. The script is not officially supported by Mesosphere and is provided only for testing purposes.

To deploy the infra using the script:

1. Create a new folder
2. Copy the above script to a file named main.tf
3. Initialize terraform: terraform init
4. Deploy the infrastructure using terraform apply

Final output should be something like this:

```bash
Apply complete! Resources: 32 added, 0 changed, 0 destroyed.

Outputs:

bootstrap_private_ip = 172.12.15.101
bootstraps = 3.87.63.8
cluster-address = dcosansible-660064571.us-east-1.elb.amazonaws.com
masters = 100.27.19.199
54.196.221.181
35.168.16.40
masters_private_ips = 172.12.6.95
172.12.29.65
172.12.42.160
private_agents = 34.207.192.11
3.80.226.211
3.85.31.136
public-agents-loadbalancer = ext-dcosansible-1616099901.us-east-1.elb.amazonaws.com
public_agents = 3.86.34.141
```

To learn more about using Terraform as your deployment manager visit the [Universal Installer page](/1.14/installing/evaluation/).

## Using the Mesosphere DC/OS Ansible roles in combination with the Mesosphere Universal Installer

Mesosphere supports the use of a combination of the [Universal Installer](/1.14/installing/evaluation/mesosphere-supported-methods/) for infrastructure, a special [Terraform-Ansible-Bridge-module](https://github.com/dcos-terraform/terraform-localfile-dcos-ansible-bridge) and Ansible to manage the life cycle of the DC/OS software.

```hcl
module "dcos-ansible-bridge" {
  source  = "dcos-terraform/dcos-ansible-bridge/local_file"
  version = "~> 0.1.0"

  bootstrap_ip         = "${module.dcos-infrastructure.bootstrap.public_ip}"
  master_ips           = ["${module.dcos-infrastructure.masters.public_ips}"]
  private_agent_ips    = ["${module.dcos-infrastructure.private_agents.public_ips}"]
  public_agent_ips     = ["${module.dcos-infrastructure.public_agents.public_ips}"]

  bootstrap_private_ip = "${module.dcos-infrastructure.bootstrap.private_ip}"
  master_private_ips   = ["${module.dcos-infrastructure.masters.private_ips}"]
}

module "dcos-infrastructure" {
  source  = "dcos-terraform/infrastructure/aws"
  version = "~> 0.1.0"

  [...]

}
```

This will generate a local `hosts` file, which is an Ansbile compatible inventory file, that can be used to make Ansible aware of the cluster nodes as they are created by the Universal Installer. It will also generate a Ansbile compatible host vars file `dcos.yml` that will be populated by the clusters bootstrap and master nodes addresses. These two files can then be used to invoke any Ansible playbook against the cluster, such as [the provided example one](https://github.com/dcos/dcos-ansible/blob/master/dcos.yml), to roll out the roles to their respective nodes.

## Using the Mesosphere DC/OS Ansible roles for on-premise setups

Using Ansible to automate DC/OS installation, upgrades and configuration on on-premise setups is supported by Mesosphere. The [Mesosphere provided Ansible roles](https://galaxy.ansible.com/dcos/dcos_ansible) will work with any setup that follows the [Mesosphere DC/OS System Requirements](/1.14/installing/production/system-requirements/) and runs with CentOS/RHEL.
