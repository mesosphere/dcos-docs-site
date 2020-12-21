---
layout: layout.pug
navigationTitle:  Overview & Concepts
title: Overview & Concepts
menuWeight: 20
beta: false
excerpt: Introductory topics about D2iQ Dispatch.
---
Dispatch is a cloud-native GitOps platform. GitOps is a way to do Kubernetes cluster management and application delivery; it works by using Git as a single source of truth for declarative infrastructure and applications. Dispatch  enables you to:

* Define and execute build, test, and deployment workflows. 
* Implement modern GitOps processes to increase test coverage and speed up your deployments.
* Define your build pipeline using powerful languages using well-known development methodologies, so that you can spend more time writing code and less time maintaining your pipelines.

# Key Features

**Flexible Pipeline Configuration.**  Dispatch lets  you leverage languages such as CUE and Starlark to declaratively define a build and test [pipeline](dispatch-ci/). You can reduce pipeline complexity by defining functions, schema validation and other well-known programming constructs.

**Choice of Build Locations.** You can execute your pipeline on your laptop, on-prem cluster or in the public cloud. Dispatch lets you run the same pipeline in any environment.

**Cloud Native.** Dispatch is optimized to run on Kubernetes, using build and deploy services that leverage Kubernetes' underlying services and processes.

**Software Lifecycle as Code.**  Dispatch lets you implement GitOps processes to store build pipelines and application deployment methodologies in Git for repeatable and efficient lifecycle management.

**Command Line & Browser-based interfaces.** Dispatch provides both Command Line and a browser accessible dashboard.

**Progressive Deployment.**  Dispatch enables you to easily implement [progressive deployment strategies](../install/configure-argocd/) to ensure greatly reduced risk deployments of your applications.

**Get Started** now with a [Quickstart Tutorial](../quickstart/)
