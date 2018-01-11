---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 0.2.2-1.7.7-beta

## Breaking Changes

- None

## Improvements

- Support for Ubuntu on Azure based deployments.

## Bug Fixes

- Remove harmless error when mounting busy /proc.

## Documentation

- None

# Version 0.2.1-1.7.7-beta

## Breaking Changes

- None

## Improvements

- Kubernetes 1.7.7.

## Bug Fixes

- Upgrade DC/OS bootstrap utility in order to fix container IP resolution issue.

## Documentation

- Add note about enforcing IPv4 when proxying through SSH.
- Add instructions on how to override Kubernetes worker nodes's resource specification.

# Version 0.2.0-1.7.6-beta

## Breaking Changes

- None

## Improvements

- Kubernetes 1.7.6.
- etcd 3.2.8
- Add Kubernetes service-account support to Open DC/OS.
- Add-ons now discover and use the intra-cluster secure API server.
- Enable kubelet container statistics.
- Enable [Heapster 1.4.2 add-on](https://github.com/kubernetes/heapster/) which enables [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) (doesn't include custom metrics).
- Enable [Dashboard 1.6.3 add-on](https://github.com/kubernetes/dashboard).
- Add support for Helm.
- Add support for offline (air-gapped) package installation.

## Bug Fixes

- Task status is now reported correctly all the time, preventing certain tasks to
be rendered irrecoverable.
- Pod containers can now discover the Kubernetes API by means of the intra-cluster configuration.
- Make sure Kubernetes node task persistent storage has dangling artifacts from a
previous allocation, if any, cleaned-up. The container runtime would not work otherwise.
- etcd 3.2.8 fixes an [apiserver issue when etcd leader goes away](https://github.com/coreos/etcd/issues/8515).
- Enforce kubelet hairpin mode support to fix an issue where a pod couldn't
communicate to another pod on the same node when exposed by a Service.

## Documentation

- First iteration of our public documentation.
