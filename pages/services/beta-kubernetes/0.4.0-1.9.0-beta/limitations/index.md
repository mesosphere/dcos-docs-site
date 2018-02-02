---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 100
excerpt:
featureMaturity:
enterprise: false
---

Currently, the DC/OS Kubernetes package has the following limitations.
We will be adding features rapidly as we approach General Availability (GA).

* This is a Beta offering and should not be used in production.
* One Kubernetes cluster per DC/OS cluster.
* One Kubernetes worker node per DC/OS agent.
* DC/OS and Mesos tasks can only reach Kubernetes Services if kube-proxy is running on the DC/OS agent where the request originates from.
* Access to the Kubernetes API server is done via an SSH tunnel to any of your DC/OS agents.
* Kubernetes, etcd, and Docker versions are not configurable.
* Non-managed etcd clusters are not supported.
* Authorization mode is not configurable.
* Cloud-provider integration supports AWS only.
* Horizontal Pod Autoscaling custom metrics are not available.
* Package upgrades are not supported.
* There is no integration between DC/OS UI and Kubernetes dashboard.
