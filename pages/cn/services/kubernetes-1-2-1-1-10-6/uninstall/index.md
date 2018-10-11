---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt: Uninstalling DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

从 DC/OS CLI 输入 `dcos package uninstall --app-id=kubernetes kubernetes`。

例如，要卸载名为 `kubernetes-dev` 的 Kubernetes 实例，则运行：

```shell
dcos package uninstall --app-id=kubernetes-dev kubernetes
```
