---
layout: layout.pug
navigationTitle:  CD - GitOps
title: Dispatch Continuous Deployment
menuWeight: 30
beta: false
excerpt: Deploying cloud native applications into Kubernetes.
---
Dispatch enables software and applications to be continuously deployed (CD) using GitOps processes. GitOps enables the application to be deployed as per a manifest that is stored in a Git repository.  This ensures that the application deployment can be automated, audited and declaratively deployed to the infrastructure.

Dispatch leverages a git repository referred to as a GitOps repository (repo).  This GitOps repo contains the declarative YAML that is used to define how the application should be deployed into a kubernetes cluster.  [ArgoCD](https://argoproj.github.io/argo-cd/) is the primary consumer of this repo and can opt to perform different types of deployments such as [rolling](../../tutorials/cd_tutorials/rolling-deployment/) or [canary](../../tutorials/cd_tutorials/canary-deployment/) deployments depending on the requirements of the application.

Other deployment tutorials can be found in the [Deployment Tutorials](../../tutorials/cd_tutorials/) section.
