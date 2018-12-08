---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 79
excerpt: Uninstalling DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->
You may uninstall DC/OS Kubernetes from its command line interface.

From a terminal window, enter:

```shell
dcos kubernetes cluster delete --cluster-name=kubernetes-cluster
```

For example, to uninstall a Kubernetes instance named `kubernetes-dev`, run:

```shell
dcos kubernetes cluster delete --cluster-name=kubernetes-dev
```
