---
layout: layout.pug
navigationTitle:  Cloud Installation
title: Cloud Installation
menuWeight: 10
excerpt: Guide to Installing DC/OS on cloud environments using the Mesosphere Universal Installer
---

<strong>The Mesosphere Universal Installer is the recommended tool for provisioning, deploying, installing, and upgrading DC/OS on the following cloud providers. Jump to the guide for the cloud provider of your choice to get started: </strong>

#### [DC/OS on Amazon Web Services](/1.12/installing/evaluation/aws/)

#### [DC/OS Azure Resource Manager](/1.12/installing/evaluation/azure/)

#### [DC/OS on Google Cloud Platform](/1.12/installing/evaluation/gcp/)

# About the Mesosphere Universal Installer

A number of different installation methods have emerged to manage the life-cycle of DC/OS on a set of nodes in a cluster. These installation methods include AWS CloudFormation templates, Azure ARM templates, Ansible Playbooks, dcos-launch, dcos-gcp, and terraform-dcos. Each of these methods were designed to solve a particular use case, and therefore had some limitations around supporting the full life-cycle of (provision, deploy, install, upgrade, decommission) of DC/OS. For example, both AWS CloudFormation and Azure ARM template solutions do not support the upgrade process in DC/OS after the cluster is deployed the first time, whereas Ansible roles were infrastructure agnostic and did not cover the provisioning of machines itself.

Terraform is an open source infrastructure automation tool which uses templates to manage infrastructure for multiple public cloud providers, service providers, and on-premises solutions. Terraform creates your infrastructure, configures resources, and manages communication between agents. The purpose of this tool is to automate most of the manual efforts of managing and maintaining distributed systems. The Universal Installer is built on top of Terraform.

The primary goal of using the Mesosphere Universal Installer is as follows:
- Provide a single unified experience for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on a cluster of machines.
- Create a modular and reusable script to easily decouple DC/OS on various OS and cloud providers to easily install, upgrade, and modify in-place.
- Remove the confusion around which DC/OS installation method should be used in any given scenario. This automated tool helps to build modules that codify best practices for each stage in the cluster life-cycle and hook necessary modules into an existing infrastructure.

## Prerequisites
The following is required in order to use Terraform templates to deploy DC/OS on cloud providers:

- Install Terraform and possess the required infrastructure credentials and permissions to run and provision resources.
- Prepare a local SDK to your chosen cloud provider. Example: Set up `AWS-CLI` and include a default region.
- Prepare to enter your ssh credentials into the instances you launch via Terraform using either an ssh-agent or passing public keys directly. This helps you to interact with the cluster easily.
- Be familiar with the characteristics of the environment (e.g. which cloud provider) you want to run DC/OS on, and understand the environment’s features and limitations.
- Understand the API limits that exist on your account for each supported Terraform provider.
- Know the different quotas that exist to limit the number of resources that are available in different regions for each supported Terraform provider.
- Maintain your Terraform state and understand whether that state is saved locally or in the cloud (i.e, AWS S3, GCP cloud storage, Azure storage account).
- When using Terraform state that is shared, it is recommended to select a backend that supports state locking (i.e, AWS S3, GCP cloud storage, Azure storage account or locally) which ensures that no other user will be able to change the state while another operation is being performed.


## Mesosphere Supported Installation Methods
These installation methods are used for fast demos and proofs of concept, as well as production clusters. Upgrades are supported with the following installation methods.

Any of the following methods can be used to install DC/OS:
- [Amazon Web Services (AWS)](/1.12/installing/evaluation/aws/): Install DC/OS on AWS by using the Mesosphere Universal Installer.
- [Azure](/1.12/installing/evaluation/azure/): Install DC/OS on Microsoft Azure by using the Mesosphere Universal Installer.
- [Google Cloud Platform (GCP)](/1.12/installing/evaluation/gcp/): Install DC/OS on Google Cloud Platform (GCP) by using the Mesosphere Universal Installer.
- [Any cloud](/1.12/installing/evaluation/dcos-ansible/): Connect your Mesosphere Universal Installer created infrastructure to an existing Ansible setup and use Mesosphere provided Ansible roles to manage the DC/OS clusters lifecycle.

## Other Installation Methods
These installation methods are provided by the community and are not tested by Mesosphere. Upgrading DC/OS is not a supported feature when using the following installations.

- [CloudFormation on AWS](/1.12/installing/evaluation/community-supported-methods/aws/) (AWS): Install your DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation.
- [Azure Resource Manager templates](/1.12/installing/evaluation/community-supported-methods/azure/): Install your DC/OS cluster on Azure by using the Azure Resource Manager templates.
- [Mesosphere Universal Installer for DigitalOcean](/1.12/installing/evaluation/community-supported-methods/digitalocean/): Install your DC/OS cluster on DigitalOcean by using Terraform templates that are configured to run Mesosphere DC/OS on DigitalOcean.
- [Mesosphere Universal Installer for Packet (bare metal)](/1.12/installing/evaluation/community-supported-methods/packet/): A bare metal environment is a computer system or network in which a virtual machine is installed directly on hardware rather than within the host operating system (OS). Install your DC/OS cluster on Packet bare metal using Terraform templates that are configured to run Mesosphere DC/OS on Packet.

<p class="message--note"><strong>NOTE: </strong>Contact the <a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">mailing list</a> or <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack channel</a> for community support.</p>
