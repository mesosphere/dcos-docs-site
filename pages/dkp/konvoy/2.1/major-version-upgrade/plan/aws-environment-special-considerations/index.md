---
layout: layout.pug
navigationTitle: Important Considerations for AWS Environments
title: Important Considerations for AWS Environments
menuWeight: 10
excerpt: Important considerations for AWS environments in the major version upgrade
beta: false
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

## Machines created after adoption will not use a separate EBS volume for storing container images

In Konvoy 1.8, machines do use a separate EBS volume for storing container images. This is not supported in Konvoy 2.1.

Moreover, Konvoy 2.1 does not delete these separate EBS volumes when it deletes the cluster. However, Konvoy 1.8 does delete them.

## Konvoy 2.1 cannot manage some of the infrastructure created by Konvoy 1.8

Konvoy 2.1 configures infrastructure in a way that is incompatible with Konvoy 1.8.

While Konvoy 2.1 can use the existing infrastructure, it cannot modify or delete it. Therefore when you delete an adopted AWS cluster, you should run `konvoy down` against the original cluster directory.

As an alternative, you must delete these resources manually:

-   VPC

-   Subnets

-   Route Tables

-   Security Groups

-   Internet Gateway

-   IAM Policies

-   IAM Role

-   IAM Instance Profile

-   SSH Key Pair

-   Additional EBS volumes instances created by Konvoy 1.8. By default, such instances have one additional EBS volume to store container images

## Upgrade of some Konvoy 1.8 cluster configurations is not supported

-   Clusters using multiple AWS Availability Zones

-   Clusters using a bastion

-   Clusters using GPU enabled nodepool

## During the upgrade, the default Storage Class configuration changes

   Configuration | Konvoy 1.8 | Konvoy 2.1
   ---------|----------|---------
   Type | gp2 | gp3
   Allow Volume Expansion | enabled | disabled
   File System | (not specified) | ext4

These are the fields that change:

- Konvoy 1.8:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
...
parameters:
  type: gp2
allowVolumeExpansion: true
```

- Konvoy 2.1

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
...
parameters:
  csi.storage.k8s.io/fstype: ext4
  type: gp3
```

[kubernetes-resource-name]: https://v1-21.docs.kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
