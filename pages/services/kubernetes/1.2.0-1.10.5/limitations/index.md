---
layout: layout.pug
navigationTitle: Limitations
title: Limitations
menuWeight: 60
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


Currently, the DC/OS Kubernetes package has the following limitations:

* Mesos roles are not supported.
* There can only be **one** Kubernetes cluster per DC/OS cluster.
* There can only be **one** Kubernetes worker node per DC/OS agent.
* DC/OS and Mesos tasks can only reach Kubernetes Service(s) if `kube-proxy` is running on the same DC/OS agent where the request originates from.
* Kubernetes, etcd, and Docker versions are not configurable.
* External etcd clusters are not supported.
* Cloud-provider integration exists for AWS only.
* Horizontal Pod Autoscaling based on custom metrics is not available by default.
* There is no integration between the DC/OS UI and the Kubernetes dashboard.
* Switching the value of the `kubernetes.high_availability` option off after the
  creation of the cluster is not supported.
* Replacing or permanently losing the `etcd` pod when `kubernetes.high_availability` is disabled will result in permanent data loss.
* Nodes are restricted to running 10 pods per available CPU core, up to a maximum of 100 pods per node.
* Changing the value of the `kubernetes.authorization_mode` option after installing the package is not supported.
* Kubernetes `Service NodePort` and `Pod hostPort` are not supported. Using them can have unpredictable results if any other DC/OS service binds also to the very same port.
