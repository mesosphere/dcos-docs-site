---
layout: layout.pug
title: Installing
menuWeight: 30
excerpt: Installing the Enterprise and Open Source versions of DC/OS
---

# DC/OS Installation

The installation of DC/OS involves configuring your infrastructure and installing DC/OS on top. DC/OS can be installed on any cluster of a physical or virtual machine. 

Some installation methods will configure your infrastructure for you, which results in limited functionality or control. These installation methods should be used for trials and proofs of concept (PoC) only. 

For fully functional clusters on any infrastructure, including on-premise, public or private clouds follow the Production installation instructions.

To test or demo DC/OS on Azure, AWS, GCE, Digital Ocean, or Packet, follow the cloud installation instructions. These clusters can not be upgraded and functionality may be limited. 


# Types of Installation methods
DC/OS can be installed on any cluster of a physical or virtual machine. Use the following installation methods based on your requirements.

## Local Installation
The Local installation method is for first-time users or developers intending to build services or modify DC/OS. The Vagrant installer provides a quick, free way to deploy a virtual cluster on a single machine.
 
## Cloud Installation 
This installation method is used for fast demos and POCs. 
DC/OS CloudFormation templates are intended for reference only and are not recommended for production use due to the following limitations:
- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

The following methods are used to install DC/OS:
- Provision DC/OS on Amazon Web Services (AWS): Install DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation. 
- Provision DC/OS on Azure: Install DC/OS cluster on Azure by using the Azure Resource Manager templates.
- Provision DC/OS on Google Cloud Platform (GCE): Install DC/OS cluster on Google Compute Engine (GCE) by using installation scripts. Upgrades are not supported with this installation method.
- Provision DC/OS on DigitalOcean: Install DC/OS cluster on DigitalOcean using Terraform templates that are configured to run Mesosphere DC/OS on DigitalOcean.
- Provision DC/OS on Packet bare metal: A bare metal environment is a computer system or network in which a virtual machine is installed directly on hardware rather than within the host operating system (OS). Install DC/OS cluster on Packet bare metal using Terraform templates that are configured to run Mesosphere DC/OS on Packet.
 
 **Note:** The recommended way to install production-ready DC/OS that can be upgraded in-place is to use the [production installation](/1.11/installing/production/installation/) method.

## On-Premise Installation
The on-premise installation method is based on `dcos labs`. The different types of on-premise installation methods are:
- Using Ansible
- Using Chef
- Using Puppet

 
## Production Installation
The production installation method is a flexible way to configure and install DC/OS on a cluster. This method was previously called Custom Installation. This production installation method is used to install production ready DC/OS that can be upgraded. You can package the DC/OS distribution and connect to every node manually to run the DC/OS installation commands. This method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster.
