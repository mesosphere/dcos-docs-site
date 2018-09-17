---
layout: layout.pug
navigationTitle: Limitations
title: Limitations
menuWeight: 60
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


Currently, the DC/OS Kubernetes package has the following limitations:

* Strict-mode DC/OS is not yet supported.
* Placement constraints are not yet supported.
* There can only be **one** Kubernetes cluster per DC/OS cluster.
* There can only be **one** Kubernetes worker node per DC/OS agent.
* DC/OS and Mesos tasks can only reach Kubernetes Service(s) if `kube-proxy` is running on the same DC/OS agent where the request originates from.
* Kubernetes, etcd, and Docker versions are not configurable.
* External etcd clusters are not supported.
* Authorization mode is not configurable.
* Cloud-provider integration supports AWS only.
* Horizontal Pod Autoscaling based on custom metrics is not available by default.
* There is no integration between the DC/OS UI and the Kubernetes dashboard.
* Disabling the `high_availability` option after install is not supported.
* Losing `etcd` pod when `high_availability` is disabled may result in permanent data loss.
* Nodes are restricted to running 10 pods per available CPU core, up to a maximum of 100 pods per node.
* The Kubernetes Dashboard cannot be accessed at the usual
  `https://<apiserver-url>/ui/` URL.
