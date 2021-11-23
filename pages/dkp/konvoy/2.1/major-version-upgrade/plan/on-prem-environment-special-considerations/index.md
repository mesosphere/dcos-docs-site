---
layout: layout.pug
navigationTitle: Important Considerations for On-prem Environments
title: Important Considerations for On-prem Environments
menuWeight: 15
excerpt: Important considerations for On-prem environments in the major version upgrade
beta: true
enterprise: false
---

The following are important considerations when planning your major version upgrade:

## The Cluster name must be a valid Kubernetes resource name

The cluster name must be a [valid Kubernetes resource name][kubernetes-resource-name], i.e., it must follow these rules:

- contain no more than 253 characters
- contain only lowercase alphanumeric characters, '-' or '.'
- start with an alphanumeric character
- end with an alphanumeric character

For example, a cluster name with an underscore is valid in Konvoy 1.8, but not valid in Konvoy 2.1.

## Upgrade of some Konvoy 1.8 cluster configurations is not supported

- Upgrading clusters with multiple imageRegistries
- Clusters using a bastion
- Clusters using GPU enabled nodepool

[kubernetes-resource-name]: https://v1-21.docs.kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
