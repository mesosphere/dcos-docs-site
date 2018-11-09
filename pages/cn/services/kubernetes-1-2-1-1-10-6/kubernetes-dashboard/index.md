---
layout: layout.pug
navigationTitle: Kubernetes Dashboard
title: Kubernetes Dashboard
menuWeight: 75
excerpt: Accessing the Kubernetes dashboard
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Kubernetes 仪表板

在 [暴露 Kubernetes API 和相应地设置 `kubectl`](../connecting-clients) 之后，您将能够通过以下方式访问 Kubernetes 仪表板：

```
# kubectl proxy
Starting to serve on 127.0.0.1:8001
```

并将您的浏览器指向：

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/
```
