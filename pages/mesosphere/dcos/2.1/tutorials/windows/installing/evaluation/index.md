---
layout: layout.pug
navigationTitle:  Cloud Installation
title: Cloud Installation
menuWeight: 10
excerpt: Guide to Installing DC/OS on cloud environments using the Mesosphere Universal Installer
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# About the Mesosphere Universal Installer

A number of different installation methods have emerged to manage the life-cycle of DC/OS on a set of nodes in a cluster. These installation methods include AWS CloudFormation templates, Azure ARM templates, Ansible Playbooks, dcos-launch, and terraform-dcos. Each of these methods were designed to solve a particular use case, and therefore had some limitations around supporting the full life-cycle of (provision, deploy, install, upgrade) of DC/OS.

Terraform is an open source infrastructure automation tool which uses templates to manage infrastructure for multiple public cloud providers, service providers, and on-premises solutions. Terraform creates your infrastructure, configures resources, and manages communication between agents. The purpose of this tool is to automate most of the manual efforts of managing and maintaining distributed systems. The Universal Installer is built on top of Terraform.

The primary goal of using the Mesosphere Universal Installer is as follows:
- Provide a single unified experience for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on a cluster of machines.
- Create a modular and reusable script to easily decouple DC/OS on various OS and cloud providers to easily install, upgrade, and modify in-place.
- Remove the confusion around which DC/OS installation method should be used in any given scenario. This automated tool helps to build modules that codify best practices for each stage in the cluster life-cycle and hook necessary modules into an existing infrastructure.

#### [DC/OS on Amazon Web Services](/mesosphere/dcos/2.1/tutorials/windows/installing/evaluation/aws/)

#### [DC/OS Azure Resource Manager](/mesosphere/dcos/2.1/tutorials/windows/installing/evaluation/azure/)


## Prerequisites

<p class="message--note"><strong>Note:</strong> You must use Terraform version 0.11.x to install DC/OS Mixed OS cluster using the Universal Installer.</p>

The following is required in order to use Terraform templates to deploy DC/OS on cloud providers:

- [Find and download the appropriate Terraform package for your system](https://releases.hashicorp.com/terraform/0.11.14/)
- Install Terraform and possess the required infrastructure credentials and permissions to run and provision resources.
- Prepare a local SDK to your chosen cloud provider. Example: Set up [AWS-CLI](https://aws.amazon.com/cli/) and include a [default region](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)
- Prepare to enter your [ssh credentials](/mesosphere/dcos/2.0/installing/evaluation/aws/#set-up-ssh-credentials-for-your-cluster) into the instances you launch via Terraform using either an ssh-agent or passing public keys directly. This helps you to interact with the cluster easily.
- Ensure the terraform binary is located within a directory that is part of your users PATH. You can run `PWD` from where the terraform binary is and run `echo $PATH` to confirm it is in the path.
- Decide how many nodes you need, then set up your Linux and Windows nodes.
- Enter the path for your license file.
- Create a dcos_superuser_username and SHA512 hashed password.
- Save the **main.tf** file to a location that is accessible from the command line.


## Mesosphere Supported Installation Methods
These installation methods are used for fast demos and proofs of concept, as well as production clusters. Upgrades are supported with the following installation methods.

Any of the following methods can be used to install DC/OS:
- [Amazon Web Services (AWS)](/mesosphere/dcos/2.1/tutorials/windows/installing/evaluation/aws/): Install DC/OS on AWS by using the Mesosphere Universal Installer.
- [Azure](/mesosphere/dcos/2.1/tutorials/windows/installing/evaluation/azure/): Install DC/OS on Microsoft Azure by using the Mesosphere Universal Installer.

