---
layout: layout.pug
navigationTitle:  Evaluation
title: DC/OS Evaluation
menuWeight: 5
excerpt: DC/OS evaluation uses local, cloud or on-premise installation methods
---

This page supports both DC/OS OSS (default) and DC/OS Enterprise installation methods. You can evaluate the installation of DC/OS cluster based on your requirements.

# Types of installation methods

Use the following installation methods based on your requirement.

## Local Installation
The local installation method is for first-time users or developers looking to build services or modify DC/OS. 
Use the following local installation options.
- The [Vagrant installer](https://github.com/dcos/dcos-vagrant/). 
- The [Docker installer](https://github.com/dcos/dcos-docker/).
 
## Cloud Installation 
The cloud installation method is used for fast demos and POCs. 

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

**Note:** The recommended way to install production ready DC/OS that can be upgraded in-place is to use the production installation method.

## On-premise Installation 
The on-premise installation uses various methods to install DC/OS. 
