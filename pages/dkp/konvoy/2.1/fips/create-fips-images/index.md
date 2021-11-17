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

If you are targeting a [pre-provisioned infrastructure](../../choose-infrastructure/pre-provisioned/), you can create a FIPS-compliant cluster by doing the following:

1.  Create a [bootstrap cluster](../../choose-infrastructure/pre-provisioned/bootstrap)

1.  Create a secret on the bootstrap cluster with the contents from `fips.yaml`[override file][fips_override] and any other user overrides you wish to provide

```shell
kubectl create secret generic $CLUSTER_NAME-fips-overrides --from-file=overrides.yaml=overrides.yaml
kubectl label secret $CLUSTER_NAME-fips-overrides clusterctl.cluster.x-k8s.io/move=
```

[fips_override]: https://github.com/mesosphere/konvoy-image-builder/blob/main/overrides/fips.yaml
