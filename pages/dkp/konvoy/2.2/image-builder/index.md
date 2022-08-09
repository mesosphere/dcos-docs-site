---
layout: layout.pug
navigationTitle: Konvoy Image Builder
title: Konvoy Image Builder
enterprise: false
beta: false
menuWeight: 70
---

Konvoy Image Builder (KIB) is a complete solution for building
[Cluster API](https://cluster-api.sigs.k8s.io/) compliant images.

This section describes how to use the KIB to create a Cluster API compliant machine images. Machine images contain configuration information and software to create a specific, pre-configured, operating environment. For example, you can create an image of your current computer system settings and software. The machine image can then be replicated and distributed, creating your computer system for other users. The KIB uses variable overrides to specify base image and container images to use in your new machine image.

## Prerequisites

Before you begin, you must ensure your versions of KIB and DKP are compatible:

-  Download the supported version of the KIB bundle from the KIB Version section of the chart below (prefixed with konvoy-image-bundle) for your Operating System.
### Supported versions


| Kubernetes Support  | Version | 
|------------|----------------------|
| Minimum | 1.22.0 |
| Maximum | 1.23.x |
| Default | 1.22.0 |
| EKS Default | 1.22.x |


-  Create a working `docker` setup.

## Compatible versions
Along with the KIB Bundle, we publish a file containing checksums for the bundle files.  The recommendation for using these checksums is to verify the integrity of the downloads.


| DKP Version  | KIB Version | 
|------------|----------------------|
| v2.3.0 | v1.19.9 |
| V2.2.2 | v1.17.2 |
| v2.2.1 | v1.13.2 |
| v2.2.0 | v1.11.0 |
| v2.1.x | v1.5.0 |

[KIB Version download release center](https://github.com/mesosphere/konvoy-image-builder/releases)

KIB will run and print out the name of the created image for your infrastructure provider as shown on specific provider pages below.   Use this name when creating a Kubernetes cluster.