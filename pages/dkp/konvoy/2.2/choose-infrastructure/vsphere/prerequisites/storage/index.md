---
layout: layout.pug
navigationTitle: Storage Options
title: Storage Options
menuWeight: 20
excerpt: Explore storage options and considerations for using DKP with VMware vSphere
enterprise: false
---

The [vSphere Container Storage][vsphere-csi-plugin] plugin supports shared NFS, vNFS, and vSAN. You need to provision your storage options in vCenter prior to [creating a CAPI image][create-capi-image] in DKP for use with vSphere.

DKP has integrated the CSI 2.0 driver used in vSphere. When creating your DKP cluster, DKP uses whatever you configure within the preconfigured Datastore name that you supply. vSAN is not required. Using NFS reduces the amount of tagging and permission granting required to configure your cluster.

[vsphere-csi-plugin]: https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-74AF02D7-1562-48BD-A9FE-C81A53342AC3.html
[create-capi-image]: ../../create-capi-vm-image/
