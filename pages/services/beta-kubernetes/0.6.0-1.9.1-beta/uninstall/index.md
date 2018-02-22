---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

1. From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes beta-kubernetes`.

For example, to uninstall a Beta Kubernetes instance named `beta-kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=beta-kubernetes-dev beta-kubernetes
```
