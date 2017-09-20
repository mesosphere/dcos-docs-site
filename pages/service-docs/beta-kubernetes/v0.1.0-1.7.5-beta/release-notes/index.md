---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 80
excerpt:
featureMaturity:
enterprise: false
---

## Version 0.1.0-1.7.5-beta

Initial release

### Limitations

Kubernetes on DC/OS is currently in Beta and has the following known limitations.

* Package upgrades are not supported
* One Kubernetes cluster can be run on a given DC/OS cluster
* Strict security mode in DC/OS Enterprise is not supported
* You cannot reach Kubernetes services from nodes not running kube-proxy
