---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 30
excerpt:
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

### DC/OS 1.10

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes beta-kubernetes`.

For example, to uninstall a Beta Kubernetes instance named `beta-kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=beta-kubernetes-dev beta-kubernetes
```
