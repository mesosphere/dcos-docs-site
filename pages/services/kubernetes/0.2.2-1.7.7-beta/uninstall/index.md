---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

### DC/OS 1.10

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes kubernetes`.

For example, to uninstall a Kubernetes instance named `kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=kubernetes-dev kubernetes
```
