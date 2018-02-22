---
layout: layout.pug
navigationTitle: Limitations
title: Limitations
menuWeight: 60
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


Currently, the DC/OS Kubernetes package has the following limitations.
We will be adding features rapidly as we approach General Availability (GA).

* This is a Beta offering and should not be used in production.
* One Kubernetes cluster per DC/OS cluster.
* One Kubernetes worker node per DC/OS agent.
* DC/OS and Mesos tasks can only reach Kubernetes Services if kube-proxy is running on the DC/OS agent where the request originates from.
* Kubernetes, etcd, and Docker versions are not configurable.
* Non-managed etcd clusters are not supported.
* Authorization mode is not configurable.
* Cloud-provider integration supports AWS only.
* Horizontal Pod Autoscaling custom metrics are not available.
* There is no integration between DC/OS UI and Kubernetes dashboard.
