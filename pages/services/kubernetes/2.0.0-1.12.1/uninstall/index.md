---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

1. From the Kubernetes DC/OS CLI, enter `dcos kubernetes cluster delete --cluster-name=kubernetes-cluster`.

For example, to uninstall a Kubernetes instance named `kubernetes-dev`, run:

```shell
dcos kubernetes cluster delete --cluster-name=kubernetes-dev
```
