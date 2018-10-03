---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt:
---

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

1. From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes kubernetes`.

For example, to uninstall a Kubernetes instance named `kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=kubernetes-dev kubernetes
```
