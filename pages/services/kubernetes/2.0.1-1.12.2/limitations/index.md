---
layout: layout.pug
navigationTitle: Limitations
title: Limitations
menuWeight: 105
excerpt: Understanding the limitations of Kubernetes on DC/OS
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

Currently, the DC/OS Kubernetes package has the following limitations:

# Scalability and High-Availability

* Each Kubernetes cluster is limited to a maximum of 85 Kubernetes nodes (private or public).
* Each Kubernetes node is restricted to running 10 pods per available CPU core, up to a maximum of 100 pods per node.
* Each public Kubernetes node requires a dedicated public DC/OS agent.
* [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) based on custom metrics is not available by default.
* Replacing or permanently losing the `etcd` pod when `kubernetes.high_availability` is set to `false` will result in permanent data loss for a given cluster.

# Configuration

* Updating the value of the `kubernetes.authorization_mode` option after the creation of a cluster is not supported.
* Updating the value of the `kubernetes.high_availability` option to `false` after the creation of a cluster is not supported.

# DC/OS Integration

* There is no integration between the DC/OS UI and the Kubernetes Dashboard.
* Mesos roles are not supported.
* DC/OS and Mesos tasks cannot reach Kubernetes services.

# Other

* The XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true` enabled.
  Use `xfs_info` to verify that the `ftype` option is set to `1`.
  To format an XFS filesystem correctly, use the `-n ftype=1` flag.
* CentOS 7.4 or earlier are [not supported](https://mesosphere-community.force.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006).
* Cloud-provider integration is not supported.
* Using custom versions of etcd, Docker and Kubernetes is not supported.
* External etcd clusters are not supported.
* Using the Docker default bridge CIDR `172.17.0.0/16` as the Kubernetes service CIDR or Calico network CIDR will result in an overlap and the cluster will not be usable.
