---
layout: layout.pug
title: Installing
menuWeight: 30
excerpt: Installing the Enterprise and Open Source versions of DC/OS
---

# DC/OS Installation

The installation of DC/OS involves configuring your infrastructure, and installing the software on a cluster of physical or virtual machines.

The DC/OS installation methods are as follows:

- **Local installation:** This method is used by first-time users or developers intending to build services or modify DC/OS. The Vagrant installer provides a quick, free way to deploy a virtual cluster on a single machine.

- **Cloud and On-Premise installation:** These methods are used for trials and proofs of concept (PoC) only. To test or demo DC/OS on Azure, AWS, GCE, Digital Ocean, or Packet, follow the [cloud installation instructions](#cloud-install). 

- **Production installation:** This method is used for fully functional clusters on any infrastructure.

# Overview of Installation Methods
This section describes an overview of the installation methods. Use the following installation methods based on your requirements.

## Development 
You can run a cluster using the [local installation method](/1.12/installing/development/). This method is for first-time users or developers intending to build services or modify DC/OS. The Vagrant installer provides a quick, free way to deploy a virtual cluster on a single machine.
 

## Evaluation 
You can [evaluate](/1.12/installing/evaluation/) the installation process using the following installation methods:

### <a name="cloud-install"></a>Cloud Installation 
This installation method is used for fast demos and proofs of concept. DC/OS CloudFormation templates are intended for reference only and are not recommended for production use.

Any of the following methods can be used to install DC/OS:
- [Provision DC/OS on Amazon Web Services](/1.12/installing/evaluation/cloud-installation/aws/) (AWS): Install your DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation. 
- [Provision DC/OS on Azure](/1.12/installing/evaluation/cloud-installation/azure/): Install your DC/OS cluster on Azure by using the Azure Resource Manager templates.
- [Provision DC/OS on DigitalOcean](/1.12/installing/evaluation/cloud-installation/digitalocean/): Install your DC/OS cluster on DigitalOcean by using Terraform templates that are configured to run Mesosphere DC/OS on DigitalOcean.
- [Provision DC/OS on Google Cloud Platform (GCE)](/1.12/installing/evaluation/cloud-installation/gce/): Install your DC/OS cluster on Google Compute Engine (GCE) by using installation scripts. Upgrades are not supported with this installation method.
- [Provision DC/OS on Packet bare metal](/1.12/installing/evaluation/cloud-installation/packet/): A bare metal environment is a computer system or network in which a virtual machine is installed directly on hardware rather than within the host operating system (OS). Install your DC/OS cluster on Packet bare metal using Terraform templates that are configured to run Mesosphere DC/OS on Packet.
 
 <p class="message--important"><strong>IMPORTANT: </strong> The recommended way to install production-ready DC/OS that can be upgraded in place is to use the <a href="/1.12/installing/production/deploying-dcos/installation/">production installation</a> method.</p>

### On-Premise Installation
The [on-premise installation](/1.12/installing/evaluation/on-premise-installation/) methods are described in the [DC/OS labs repo](https://github.com/dcos-labs). The different types of on-premise installation methods are:
- [Using Ansible](https://github.com/dcos-labs/ansible-dcos/blob/master/docs/INSTALL_ONPREM.md)
- [Using Chef](https://github.com/dcos-labs/dcos-chef)
- [Using Puppet](https://github.com/dcos-labs/dcos-puppet)


## <a name="production-install"></a>Production
The [production installation](/1.12/installing/production/) method is used to install production-ready DC/OS that can be upgraded. This method was previously called custom installation. It involves packaging the DC/OS distribution and connecting to every node manually to run the DC/OS installation commands. This method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster.
