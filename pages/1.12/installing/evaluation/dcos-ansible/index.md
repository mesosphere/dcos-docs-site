---
layout: layout.pug
title: Managing a Mesosphere DC/OS clusters life cycle with Ansible
navigationTitle: DC/OS Ansible roles
menuWeight: 15
excerpt: Automated installation, upgrade and configuration of Enterprise and Open Source versions of DC/OS
---

## Introducing Mesosphere DC/OS Ansible roles

The Mesosphere DC/OS Ansible roles are now a supported life cycle management method for DC/OS alongside the Mesosphere Universal Installer. For users that are already using Ansible to manage their infrastructure and applications, the Ansible roles will be usable with only a few changes to their existing stack, as they have been developed with isolations and strict name spacing in mind. While they have been developed to work with infrastructure provisioned with the Mesosphere Universal Installer, they can be used in combination with any cloud and on-premise setups.


## About the Mesosphere DC/OS Ansibles roles

Use the [Mesosphere DC/OS Ansible roles](https://github.com/dcos/dcos-ansible) to install, upgrade and configure one or more DC/OS clusters using [Ansible](https://www.ansible.com/). The roles can be used in a both a new or existing Ansible setups and be downloaded from [the official Ansible Galaxy](https://galaxy.ansible.com/dcos/dcos_ansible).

<p class="message--note"><strong>NOTE: </strong>DC/OS Ansible roles are only available for CentOS and RHEL platforms at this time.</p>

## Using the Mesosphere DC/OS Ansible roles in combination with the Mesosphere Universal Installer

Mesosphere supports the use of a combination of the [Universal Installer](/1.12/installing/evaluation/mesosphere-supported-methods/) for infrastructure, a special [Terraform-Ansible-Bridge-module](https://github.com/dcos-terraform/terraform-localfile-dcos-ansible-bridge) and Ansible to manage the life cycle of the DC/OS software.

```hcl
module "dcos-ansible-bridge" {
  source  = "dcos-terraform/dcos-ansible-bridge/local_file"
  version = "~> 0.1"

  bootstrap_ip         = "${module.dcos-infrastructure.bootstrap.public_ip}"
  master_ips           = ["${module.dcos-infrastructure.masters.public_ips}"]
  private_agent_ips    = ["${module.dcos-infrastructure.private_agents.public_ips}"]
  public_agent_ips     = ["${module.dcos-infrastructure.public_agents.public_ips}"]

  bootstrap_private_ip = "${module.dcos-infrastructure.bootstrap.private_ip}"
  master_private_ips   = ["${module.dcos-infrastructure.masters.private_ips}"]
}

module "dcos-infrastructure" {
  source  = "dcos-terraform/infrastructure/aws"
  version = "~> 0.1"

  [...]

}
```

This will generate a local `hosts` file, which is an Ansbile compatible inventory file, that can be used to make Ansible aware of the cluster nodes as they are created by the Universal Installer. It will also generate a Ansbile compatible host vars file `dcos.yml` that will be populated by the clusters bootstrap and master nodes addresses. These two files can then be used to invoke any Ansible playbook against the cluster, such as [the provided example one](https://github.com/dcos/dcos-ansible/blob/master/dcos.yml), to roll out the roles to their respective nodes.

## Using the Mesosphere DC/OS Ansible roles for on-premise setups

Using Ansible to automate DC/OS installation, upgrades and configuration on on-premise setups is supported by Mesosphere. The [Mesosphere provided Ansible roles](https://galaxy.ansible.com/dcos/dcos_ansible) will work with any setup that follows the [Mesosphere DC/OS System Requirements](/1.12/installing/production/system-requirements/) and runs with CentOS/RHEL.