---
layout: layout.pug
title: Installing
menuWeight: 30
excerpt: Installing the Enterprise and Open Source versions of DC/OS
---

## Introducing the Mesosphere Universal Installer

The Mesosphere&reg; Universal Installer is now the supported installation method for DC/OS&trade; on AWS&reg;, Azure&reg;, and GCP&reg;. The cloud installation guide starts with a short demo to get your first cluster up and running. From there, you can easily start modifying your demo installation into a production cluster - all from the very same setup.


##### Jump to the getting started guide for your cloud provider:

#### [Amazon Web Services&reg;](/mesosphere/dcos/2.0/installing/evaluation/aws/)

#### [Azure Resource Manager&reg;](/mesosphere/dcos/2.0/installing/evaluation/azure/)

#### [Google Cloud Platform&reg;](/mesosphere/dcos/2.0/installing/evaluation/gcp/)


## About the Mesosphere Universal Installer

Use the [Mesosphere Universal Installer](/mesosphere/dcos/2.0/installing/evaluation/)  to deploy DC/OS on Amazon Web Services (AWS), Azure Resource Manager (AzureRM), and Google Cloud Platform (GCP). The Mesosphere Universal Installer is built on top of Terraform, an open source infrastructure automation tool which uses templates to manage infrastructure for multiple public cloud providers, service providers, and on-premises solutions. Through the Mesosphere Universal Installer you can quickly and easily create your infrastructure, configures resources, and manage communication between agents. Operations such as scaling a cluster or upgrading to a newer version of DC/OS are now incredibly easy. Getting started templates allow for a quick installation of DC/OS, yet can be expanded into a full production environment including upgrades, without ever taking down your cluster. 


## On-Prem Installation

The [On-Prem Installation](/mesosphere/dcos/2.0/installing/production/) is used to install production-ready DC/OS for datacenters. This method was previously called custom installation. It involves packaging the DC/OS distribution and connecting to every node manually to run the DC/OS installation commands. This method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster.
