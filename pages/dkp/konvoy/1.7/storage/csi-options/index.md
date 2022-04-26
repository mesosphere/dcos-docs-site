---
layout: layout.pug
navigationTitle: CSI Options
title: Container Storage Interface (CSI) Options
menuWeight: 6
excerpt: Information on CSI
beta: false
enterprise: false
---

<!-- markdownlint-disable MD018 -->

The Kubenetes Container Storage Interface (CSI) provides a consistent mechanism for accessing block and file storage devices in containerized workloads. CSI provides for the support of `StorageClasses`, `PersistentVolumeClaims`, and `PersistentVolumes` objects. Developers create new drivers accessing the storage devices using these objects. Using these objects to provision persistent storage, a Kubernetes service developer, does not need to know the inner workings of the devices. Refer to the [CSI Introduction](../intro-csi), for more information on creating `StorageClasses`, `PersistentVolumeClaims` and provisioning storage with `PersistentVolumes`.

## Additional CSI Third Party Storage Providers

Using the Kubernetes CSI and third party drivers, you can access local volumes and other storage devices in your data center. Possible storage and third party driver options:

#include /dkp/konvoy/1.6/include/konvoy-csi-options-vendors.tmpl

<p class="message--note"><strong>NOTE: </strong>Features and functionality implemented may vary among developers and their drivers. Refer to vendor documentation on specific drivers for more information.</p>

## CSI Driver information

For information on CSI and CSI drivers, refer to the following information:

- [Introduction to Konvoy CSI](../intro-csi)
- [Konvoy CSI Drivers](../automated-storage)
- [Kubernetes CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/)
- [Existing CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html)
- [Creating drivers](https://kubernetes-csi.github.io/docs/)
