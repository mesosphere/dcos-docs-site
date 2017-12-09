---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 0.3.0-1.7.10-beta

## Breaking Changes

- None

## Improvements

- Kubernetes 1.7.10
- Change default etcd settings in order to improve its performance and stability.
- Change default Kubernetes control-plane settings in order to improve its performance and stability.
- Automatically use the HTTP(S) proxy configured in DC/OS for the kubelet and dockerd.
- Communication between all components is now secured using TLS in  DC/OS Open too - it was already supported in EE. TLS provisioning is now uniform across editions, despite leveraging different mechanisms.

## Bug Fixes

- Isolate the embedded container-runtime from existing configuration on the agent.
- kubelet logs are redirected to stdout.
- Bundle the pod infra container image when using local universe (the "pause" container image).
- Fix certain install/uninstall failure scenarios.

## Documentation

- None
