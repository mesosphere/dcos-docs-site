---
layout: layout.pug
navigationTitle: Kubernetes Dashboard
title: Kubernetes Dashboard
menuWeight: 75
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Kubernetes Dashboard

Once [the Kubernetes API is exposed correctly and kubectl setup](../connecting-clients), the user will be able to access the Kubernetes
Dashboard by running:

```
# kubectl proxy
Starting to serve on 127.0.0.1:8001
```

and pointing their browser at:

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/
```
