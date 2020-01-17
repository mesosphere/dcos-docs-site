---
layout: layout.pug
navigationTitle: Overview
title: Dispatch Overview
menuWeight: 1
beta: true
excerpt: A Cloud Native, GitOps platform for streamlining development and deployment of container based applications.
---
Dispatch is a cloud-native GitOps platform. GitOps is a way to do Kubernetes cluster management and application delivery; it works by using Git as a single source of truth for declarative infrastructure and applications. Dispatch  enables you to:

* Define and execute build, test, and deployment workflows. 
* Implement modern GitOps processes to increase test coverage and speed up your deployments.
* Define your build pipeline using powerful languages using well-known development methodologies, so that you can spend more time writing code and less time maintaining your pipelines.

# Key Features 

**Flexible Pipeline Configuration.**  Dispatch lets  you leverage languages such as CUE and Starlark to declaratively define a build and test pipeline. You can reduce pipeline complexity by defining functions, schema validation and other well-known programming constructs.

**Choice of Build Locations.** You can execute your pipeline on your laptop, on-prem cluster or in the public cloud. Dispatch lets you run the same pipeline in any environment.

**Cloud Native.** Dispatch is optimized to run on Kubernetes, using build and deploy services that leverage Kubernetes' underlying services and processes.

**Software Lifecycle as Code.**  Dispatch lets you implement GitOps processes to store build pipelines and application deployment methodologies in Git for repeatable and efficient lifecycle management.

## Dispatchfile

In Dispatch, CI pipelines are configured using a `Dispatchfile`. The `Dispatchfile` describes all tasks to run as a part of a pipeline, rules for triggering tasks in a pipeline, and resources produced and consumed as a part of the pipeline (images, git repositories, S3 artifacts, etc). For information about `Dispatchfiles`, see the [pipeline configuration reference](../pipeline-configuration/).

# Getting Started 

Get started using Dispatch in four steps:

1. Install Dispatch on Kubernetes. Dispatch is built to run on Kubernetes and leverage its native features and services. To install Dispatch onto an existing Kubernetes cluster, see [install Dispatch](../install/).

1. Set Up Continuous Integration (CI). To build and test your Continuous Integration (CI), leverage multiple declarative languages to rapidly create and execute the pipeline. To set up CI for your project, follow the [repository configuration instructions](../repo-setup/).

1. Build Your Pipeline. Configuring your CI pipeline using CUE, Starlark, JSON or YAML greatly simplifies pipeline configuration and increases its abilities. The simplest way to do this is to prepare a `Dispatchfile`. For a reference on creating a `Dispatchfile`, see the [pipeline configuration reference](../pipeline-configuration/).

1. Configure Continuous Deployment (CD). Dispatch lets you automaticallly detect changes to how the application should be deployed or automatically resolve deployment issues. To configure continuous deployment for your project, follow the [deployment instructions](../deployment/).
