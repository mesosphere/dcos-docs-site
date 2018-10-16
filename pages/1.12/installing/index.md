---
layout: layout.pug
title: Installing
menuWeight: 30
excerpt: Installing the Enterprise and Open Source versions of DC/OS
---

# DC/OS Installation

The installation of DC/OS involves configuring your infrastructure, and installing the software on a cluster of physical or virtual machines.

The DC/OS installation methods are as follows:

- **Mesosphere supported installation:** These methods are used for trials and proofs of concept (PoC) only. To test or demo DC/OS on Azure, AWS, or GCP, follow the [Mesosphere supported installation methods](#mesosphere-supported).

- **Community supported installation:** These methods are used for trials and proofs of concept (PoC) only. To test or demo DC/OS on Digital Ocean or Packet, follow the [Community supported installation methods](#community-supported).

- **Production installation:** This method is used for fully functional clusters on any infrastructure.

# Overview of Installation Methods
This section describes an overview of the installation methods. Use the following installation methods based on your requirements.

## Evaluation 
You can [evaluate](/1.12/installing/evaluation/) the installation process using the following installation methods:

### <a name="mesosphere-supported"></a>Mesosphere Supported Installation Methods 
This installation method is used for fast demos and proofs of concept. 

Any of the following methods can be used to install DC/OS:
- [Provision DC/OS on Amazon Web Services](/1.12/installing/evaluation/mesosphere-supported/aws/) (AWS): Install your DC/OS cluster on Amazon Web Services (AWS) by using the DC/OS Terraform templates on AWS.
- [Provision DC/OS on Azure](/1.12/installing/evaluation/mesosphere-supported/azure/): Install your DC/OS cluster on Azure by using the DC/OS Terraform templates on Azure.
- [Provision DC/OS on Google Cloud Platform (GCP)](/1.12/installing/evaluation/mesosphere-supported/gcp/): Install your DC/OS cluster on GCP by using the DC/OS Terraform templates on GCP. 

### <a name="community-supported"></a>Community Supported Installation Methods 
This installation method is used for fast demos and proofs of concept. DC/OS Terraform templates are intended for reference only and are not recommended for production use.

Any of the following methods can be used to install DC/OS:
- [Provision DC/OS on DigitalOcean](/1.12/installing/evaluation/community-supported/digitalocean/): Install your DC/OS cluster on DigitalOcean by using Terraform templates that are configured to run Mesosphere DC/OS on DigitalOcean.
- [Provision DC/OS on Packet bare metal](/1.12/installing/evaluation/community-supported//packet/): A bare metal environment is a computer system or network in which a virtual machine is installed directly on hardware rather than within the host operating system (OS). Install your DC/OS cluster on Packet bare metal using Terraform templates that are configured to run Mesosphere DC/OS on Packet.
 
 <p class="message--important"><strong>IMPORTANT: </strong> The recommended way to install production-ready DC/OS that can be upgraded in place is to use the <a href="/1.12/installing/production/deploying-dcos/installation/">production installation</a> method.</p>

## <a name="production-install"></a>Production
The [production installation](/1.12/installing/production/) method is used to install production-ready DC/OS that can be upgraded. This method was previously called custom installation. It involves packaging the DC/OS distribution and connecting to every node manually to run the DC/OS installation commands. This method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster.
