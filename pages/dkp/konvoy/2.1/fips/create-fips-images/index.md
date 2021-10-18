---
layout: layout.pug
navigationTitle: Create FIPS 140 Images
title: Create FIPS 140 Images
excerpt: Use Konvoy Image Builder to create images with FIPS-compliant binaries
beta: true
enterprise: false
menuWeight: 10
---

## Create FIPS-140 images

Konvoy Image Builder can produce images containing FIPS-140 compliant binaries. Use the `fips.yaml` [override file](../../image-builder/override-files/) provided with the konvoy-image bundle.

For example, this command produces a FIPS-compliant image on Centos 8:

```shell
konvoy-image build --overrides overrides/fips.yaml images/ami/centos-8.yaml
```

### Pre-provisioned infrastructure

If you are targeting a [pre-provisioned infrastructure](../../choose-infrastructure/pre-provisioned/), use the Konvoy Image Builder to install the FIPS binaries for you, with a command similar to this:

```shell
konvoy-image provision --overrides overrides/fips.yaml images/generic/centos-8.yaml
```
