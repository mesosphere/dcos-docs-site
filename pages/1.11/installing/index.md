---
layout: layout.pug
title: Installing, Patching, and Upgrading
menuWeight: 30
excerpt: Installing and upgrading the Enterprise and Open Source versions of DC/OS
---

# DC/OS Install

The installation of DC/OS involves configuring your infrastructure and installing DC/OS bits on top.

Some installation methods will configure your infrastructure for you, which results in limited functionality or control. These installation methods should be used for trials and proofs of concept (PoCs) only. 

For fully functional clusters on any infrastructure including on premise, public or private clouds follow the Production installation instructions.

To test or demo DC/OS on Azure, AWS, GCE, Digital Ocean, or Packet follow the trial installation instructions. These clusters can not be upgraded and functionality may be limited. 

DC/OS can be installed on any cluster of a physical or virtual machine. 

# Types of installation methods

Use the following installation methods based on your requirement.

## Local Installation
The Local installation method is for first-time users or developers looking to build services or modify DC/OS. 
Use the following local installation options.
- The [Vagrant installer](https://github.com/dcos/dcos-vagrant/). 
- The [Docker installer](https://github.com/dcos/dcos-docker/).
 
## Trial  Installation 
The trial installation method is used for fast demos and POCs. This method was previously called as cloud installation.

DC/OS CloudFormation templates are intended for reference only and are not recommended for production use, due to the following limitations:
- CloudFormation does not allow for coordinated zero-downtime in-place updates within Auto Scaling groups.
- CloudFormation does not allow for automated zero-downtime replacement of Auto Scaling groups.
- Replacing DC/OS agent nodes requires manual data migration of local storage volumes for stateful services.
- Updates of DC/OS on AWS CloudFormation have not been automated, validated, or documented.
- Modified CloudFormation templates are not supported by Mesosphere, Inc.

The following methods are used to install DC/OS:
- Provision DC/OS on Amazon Web Services (AWS): Install DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS templates on AWS CloudFormation. 
- Provision DC/OS on Azure: Install DC/OS cluster on Azure by using the Azure Resource Manager templates.
- Provision DC/OS on Google Cloud Platform (GCE): Install DC/OS cluster on Google Compute Engine (GCE) by using installation scripts. Upgrades are not supported with this installation method.
 
 ** Note:** The recommended way to install production ready DC/OS that can be upgraded in-place is to use the Advanced Installer.

## Production Installation
The production installation method is a flexible way to configure and install DC/OS on a cluster. This method was previously called as custom installation.
 
- Advanced Installer: This method is used to install production ready DC/OS that can be upgraded. Using this method, you can package the DC/OS distribution and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you want to integrate with an existing system or if you don’t have SSH access to your cluster.
