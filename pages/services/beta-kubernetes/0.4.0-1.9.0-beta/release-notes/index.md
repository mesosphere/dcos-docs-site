---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 90
excerpt:
featureMaturity:

---

# Version 0.4.0-1.9.0-beta

## Breaking Changes

- Kubernetes v1.9.0

## Improvements

- Docker v17.12.0-ce.
- Add support for AWS Kubernetes cloud-provider.
- Add disaster recovery support which allows for backing up/restoring the cluster
  in case of disaster.
- Add support for the deployment of custom Ingress controller(s) if at least one
  public agent is available.
- Introduce kubelet-resource-watchdog (v0.1.0): the kubelet (and cadvisor) doesn't
  understand how to calculate the resources available/in use in the Mesos
  container the kubelet (and dockerd) is running on. Instead, the kubelet (and
  cadvisor) reads the resources available/in use by the agent (host), meaning
  that, in busy Kubernetes nodes, the kubelet won't be able to properly
  calculate allocatable resources and enforce its own resource reservations
  (--system-reserved and/or --kube-reserved), resulting, most of the times, in
  dockerd or kubelet crashes. While we are working with the Kubernetes community
  (sig-node) to fix this in Kubernetes code itself, we need an interim solution.
  The kubelet-resource-watchdog understands and respects the Mesos container
  limits, enforcing pod eviction when needed by raising kubelet resource
  pressure events when a configurable threshold is crossed (in this version,
  only memory pressure is supported).

## Bug Fixes

- None

## Documentation

- Add proxy usage instructions.

## Known Issues

- The container-runtime will occasionally hang on new operations,, i.e. start/stop container
  resulting in `kubelet` PLEG (pod lifecycle event) latency and ultimately in an unhealthy
  Kubernetes node. But fear not as we are working to fix [the issue](https://github.com/containerd/containerd/issues/1882).
