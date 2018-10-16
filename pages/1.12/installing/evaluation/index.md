---
layout: layout.pug
navigationTitle:  Evaluation
title: Evaluation
menuWeight: 10
excerpt: Installing DC/OS for evaluation using Terraform templates
---

This page explains about Terraform and the evaluation methods that are supported for both DC/OS OSS (default) and DC/OS Enterprise installation. You can evaluate the installation of DC/OS cluster based on your requirements.

# Overview of Terraform 
A number of different installation methods have emerged to manage the life-cycle of DC/OS on a set of nodes in a cluster. These installation methods include AWS CloudFormation templates, Azure ARM templates, Ansible Playbooks, dcos-launch, dcos-gcp, and terraform-dcos. Each of these methods were designed to solve a particular use case, and therefore had some limitations around supporting the full life-cycle of (provision, deploy, install, upgrade, decommission) of DC/OS. For example, both AWS CloudFormation and Azure ARM template solutions do not support the upgrade process in DC/OS after the cluster is deployed the first time. Likewise, `dcos-launch` and `dcos-gcp` were only designed to run well in a test environment, and are not usable in a production setting. Only `terraform-dcos` has support for (most of) the full life-cycle in a production setting with the limitation that decommissioning is not fully supported.

Terraform is an open source infrastructure automation tool which uses templates to manage infrastructure for multiple public cloud providers, service providers, and on-premises solutions. Terraform creates your infrastructure, configures resources, and manages communication between agents. The purpose of this tool is to automate most of the manual efforts of managing and maintaining distributed systems.

The primary goals of using Terraform are as follows:
- Provide a single unified experience for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on a cluster of machines. 
- Create a modular and reusable script to easily decouple DC/OS on various OS and cloud providers to easily install, upgrade, and modify in-place..
- Remove the confusion around which DC/OS installation method should be used in any given scenario. This automated tool helps to build modules that codify best practices for each stage in the cluster life-cycle and hook necessary modules into an existing infrastructure. 
	
Terraform is the recommended method for provisioning, deploying, installing, and upgrading DC/OS on a subset of our supported platforms.

## Requirements
All users must have the following requirements in order to use Terraform templates to deploy DC/OS on cloud providers. 

- Install Terraform and possess the required infrastructure credentials and permissions to run and provision resources.
- Prepare a local SDK to your chosen cloud provider. Example: Set up `AWS-cli` and include a default region.
- Prepare to enter your ssh credentials into the instances you launch via Terraform using either an ssh-agent or passing public keys directly. This helps you to interact with the cluster easily. 
- Be familiar with the characteristics of the environment (e.g. which cloud provider) they want to run DC/OS on, and understand the environment’s features and limitations.
- Understand the API limits that exist on your account for each supported Terraform provider.
- Know the different quotas that exist to limit the number of resources that are available in different regions for each supported Terraform provider.
- Maintain your Terraform state and understand whether that state is saved locally or in the cloud (i.e, AWS S3, GCP cloud storage, Azure storage account). 
- When using Terraform state that is shared, it is recommended to select a backend that supports state locking (i.e, AWS S3, GCP cloud storage, Azure storage account or locally) which ensures that no other user will be able to change the state while another operation is being performed. 


# Types of installation methods
The following two installation methods use Terraform templates to create a DC/OS cluster on AWS, Azure, GCP, DigitalOcean, or Packet bare metal. 
 
## Mesosphere Supported Installation Methods
This installation method is used for fast demos and proofs of concept. DC/OS Terraform templates are recommended for production use in the next iteration. Upgrades are supported with the following installation methods.

Any of the following methods can be used to install DC/OS:
- [Provision DC/OS on Amazon Web Services](/1.12/installing/evaluation/mesosphere-supported/aws/) (AWS): Install your DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS Terraform templates on AWS.
- [Provision DC/OS on Azure](/1.12/installing/evaluation/mesosphere-supported/azure/): Install your DC/OS cluster on Azure by using the DC/OS Terraform templates on Azure.
- [Provision DC/OS on Google Cloud Platform (GCP)](/1.12/installing/evaluation/mesosphere-supported/gcp/): Install your DC/OS cluster on GCP by using the DC/OS Terraform templates on GCP. 


## Community Supported Installation Methods 
This installation method is used for fast demos and proofs of concept. DC/OS Terraform templates are intended for reference only and are not recommended for production use. Upgrades are not supported with the following installation methods.

Any of the following methods can be used to install DC/OS:
- [Provision DC/OS on DigitalOcean](/1.12/installing/evaluation/community-supported/digitalocean/): Install your DC/OS cluster on DigitalOcean by using Terraform templates that are configured to run Mesosphere DC/OS on DigitalOcean.
- [Provision DC/OS on Packet bare metal](/1.12/installing/evaluation/community-supported/packet/): A bare metal environment is a computer system or network in which a virtual machine is installed directly on hardware rather than within the host operating system (OS). Install your DC/OS cluster on Packet bare metal using Terraform templates that are configured to run Mesosphere DC/OS on Packet.
 
<p class="message--note"><strong>NOTE: </strong>The recommended way to install production ready DC/OS that can be upgraded in-place is to use the production installation method.</p>

# Limitations
- Terraform based installation methods do not fully support decommisioning of nodes.
- DC/OS upgrades are not supported with community based installaltion methods.
