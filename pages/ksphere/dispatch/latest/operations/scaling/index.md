---
layout: layout.pug
navigationTitle:  Scaling Dispatch
title: Scaling Dispatch
menuWeight: 5
beta: true
excerpt: Scaling Argo CD on Dispatch
---

# Scaling Argo CD

See the [Argo CD operator manual](https://argoproj.github.io/argo-cd/operator-manual/high_availability/) for detailed recommendations on scaling Argo CD.

To set extra arguments on a component, set the following Helm arguments:

* `argo-cd.applicationController.extraArgs`: arguments for application controller.
* `argo-cd.repoServer.extraArgs`: arguments for repo server.
* `argo-cd.server.extraArgs`: arguments for argocd-server.

For example, to increase the number of kubectl commands that can be run simultaneously, run:

```bash
dispatch init --set 'argo-cd.applicationController.extraArgs[0]=--kubectl-parallelism-limit=20'
```
