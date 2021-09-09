---
layout: layout.pug
navigationTitle: Welcome to Dispatch 1.4
title: Welcome to Dispatch 1.4
beta: false
menuWeight: 0
excerpt: Dispatch provides a declarative CI/CD platform for rapidly deploying Cloud Native applications and enabling enterprises to rapidly build, test and manage applications' lifecycle using GitOps processes.
---
<p class="message--warning"><strong>WARNING: </strong>D2iQ Dispatch has been deprecated in favor of Flux. See the <a href="https://d2iq.com/blog/goodbye-dispatch-hello-fluxcd">D2iQ blog post</a> for more information.</p>

Dispatch is a cloud-native GitOps platform. GitOps is a way to do Kubernetes cluster management and application delivery. Dispatch works by using Git as a single source of truth for declarative infrastructure and applications. Dispatch enables you to:

* Define and execute build, test, and deployment workflows.
* Implement modern GitOps processes increasing test coverage and speeding up deployments.
* Define your build pipeline using powerful languages with well-known development methodologies. Spend more time writing code and less time maintaining your pipelines.

# Key Features

**Flexible Pipeline Configuration.** With Dispatch you can use languages such as CUE and Starlark to declaratively define a build and test [pipeline](overview_concepts/dispatch-ci/). You can reduce pipeline complexity by defining functions, schema validation and other well-known programming constructs.

**Choice of Build Locations.** You can execute your pipeline on your laptop, on-prem cluster, or in the public cloud. Dispatch can run the same pipeline in any environment.

**Cloud Native.** Dispatch is optimized to run on Kubernetes, using build and deploy services leveraging Kubernetes' underlying services and processes.

**Software Lifecycle as Code.**  With Dispatch you can implement GitOps processes to store build pipelines and application deployment methodologies in Git for repeatable and efficient lifecycle management.

**Get Started** Now with a [Quickstart Tutorial](quickstart/)
