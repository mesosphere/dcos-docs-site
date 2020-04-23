---
layout: layout.pug
navigationTitle:  Deployment
title: Deployment
menuWeight: 60
beta: false
excerpt: Implementing continuous deployments

# Deploying Applications with GitOps

Dispatch enables software and applications to be continuously deployed (CD) using GitOps processes. GitOps enables the application to be deployed as per a manifest that is stored in a Git repository.  This ensures that the application deployment can be automated, audited and declaratively deployed to the infrastructure.

# Deploying Applications with Canary Deployment Strategy

Canary deployment is a deployment strategy where a new version of an application
(called the canary) is deployed alongside the existing version (called the
primary). The canary deployment is subjected to tests that check various metrics
to determine application health. As the tests pass, more and more traffic is
routed to the canary, until finally the canary is promoted to be the new
primary, and the old primary is scaled down and terminated.