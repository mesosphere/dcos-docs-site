---
layout: layout.pug
navigationTitle: Overview
title: Dispatch Overview
menuWeight: 1
excerpt: A Cloud Native, GitOps platform for streamlining development and deployment of container based applications.
---
# Dispatch (Beta)

Dispatch is a cloud-native GitOps platform that enables you to:

* Define and execute build, test, and deployment workflows. 
* Implement modern GitOps processes to increase test coverage and speed up your deployments.
* Define your build pipeline using powerful languages using well known development methodologies so that you can spend more time writing code and less time maintaining your pipelines.

# Key Features 

**Flexible Pipeline Configuration.**  Leverage languages such as CUE and Starlark to declaratively define a build and test pipeline. Reduce pipeline complexity by defining functions, schema validation and other well known programming constructs.

**Choice of Build Locations.** Execute the pipeline on your laptop, on-prem cluster or in the public cloud. Run the same pipeline in any environment.

**Cloud Native.** Optimized for running on Kubernetes using build and deploy services that leverage Kubernetes' underlying services and processes.

**Software Lifecycle as Code.**  Implement GitOps processes to store build pipelines and application deployment methodologies in Git for repeatable and efficient lifecycle management.

# Getting Started 

## Installation

Dispatch is built to run on Kubernetes and leverage its native features and services. To install Dispatch onto an existing Kubernetes cluster, see [install Dispatch](../install/).

## Continuous Integration (CI)

To build and test your Continuous Integration (CI), leverage multiple declarative languages to rapidly create and execute the pipeline. To set-up CI for your project, follow the [repository configuration instructions](../repo-setup/).

### Build pipeline reference

Configuring your CI pipeline using CUE, Starlark, JSON or YAML greatly simplifies pipeline configuration and increases its abilities. For a reference on creating this *Dispatchfile* see [pipeline configuration reference](../pipeline-configuration/).

## Continuous Deployment (CD)

Automaticallly detect changes to how the application should be deployed or automatically resolve deployment issues. To configure continuous deployment for your project, follow the [deployment instructions](../deployment/).
