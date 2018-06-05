---
layout: layout.pug
navigationTitle: Kubernetes Dashboard
title: Kubernetes Dashboard
menuWeight: 75
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Kubernetes Dashboard

You can access the Kubernetes Dashboard by pointing your browser at

```text
https://<cluster-ip>/service/kubernetes-proxy/
```

or by clicking the icon that appears when you mouse over the `kubernetes-proxy`
service in the _Services_ tab of the DC/OS UI:

![alt text](/services/kubernetes/1.0.3-1.9.7/img/services.png "Services")

## Alternative Methods

If you cannot reach the Kubernetes Dashboard using any of the abovementioned
methods, point your browser to:

```text
https://<cluster-ip>/service/kubernetes-proxy/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/
```

Alternatively, if you configure an [SSH tunnel](../connecting-clients), you can
access the Kubernetes Dashboard by running

```shell
$ kubectl proxy
```

and pointing your browser at:

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/
```

**NOTE:** The `http://127.0.0.1:8001/ui/` shortcut used to access the Kubernetes
Dashboard in previous versions of Kubernetes is now deprecated and should not be
used.
