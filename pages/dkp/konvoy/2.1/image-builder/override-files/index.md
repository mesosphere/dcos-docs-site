---
layout: layout.pug
navigationTitle: Override Files
title: Override Files
excerpt: Learn how to use override files with Konvoy
beta: true
enterprise: false
menuWeight: 75
---

The konvoy-image-builder is used to install the basic components required to run Konvoy. You can specify customization of the images through the use of override files, which are used to specify alternate package libraries, Docker image repos, and other customizations.

Konvoy comes with a default override file for use with [FIPS](../../fips/), and another for use with [Nvidia](../../choose-infrastructure/aws/gpu/).

## Override files

The [Konvoy Image Builder](../create-ami) uses yaml `override` files to configure specific attributes of your AMI file. These files provide information to override default values for certain parts of your AMI file. `override` files can modify the version and parameters of the image description and the ansible playbook. Common overrides are found in the [repo](https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides). The parts these files address are:

- **Base image:** The specific AMI image used as the base for your new AMI image.
- **Container images:** The container images that will be used in your AMI image.
- **HTTP proxy:**  Proxy configurations to use when creating your AMI image.
