---
layout: layout.pug
navigationTitle: Storage Options
title: Storage Options
menuWeight: 20
excerpt: Explore storage options and considerations for using DKP with VMware vSphere
enterprise: false
---

The [vSphere Container Storage][vsphere-csi-plugin] plugin supports shared NFS, vNFS, and vSAN. You need to provision your storage options in vCenter prior to [creating a CAPI image][create-capi-image] in DKP for use with vSphere.

DKP has integrated the CSI 2.0 driver used in vSphere. When creating your DKP cluster, DKP uses whatever configuration you provide for the Datastore name. vSAN is not required. Using NFS can reduce the amount of tagging and permission granting required to configure your cluster.

## Configure your vSphere Datastore

1.   Access the Datastore tab in the vSphere client and select a datastore by name.

1.   Copy the URL for that datastore from the information dialog that displays.

1.   Provide the Datastore URL value during the create a new cluster step to ensure that the vSphere Datastore you want gets used in your cluster's VMs.

1.   Delete the existing StorageClass %%% how do I find the right file?

1.   Run the following command to create a new StorageClass, supplying the values for your environment:

   ```yaml
   cat <<EOF > xxx_sc.yaml
   ---
   apiVersion: v1
   kind: List
   metadata:
     resourceVersion: ""
     selfLink: ""
   items:
   - apiVersion: storage.k8s.io/v1
     kind: StorageClass
     metadata:
       annotations:
         kubectl.kubernetes.io/last-applied-configuration: |
           {"apiVersion":"storage.k8s.io/v1","kind":"StorageClass","metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"},"name":"vsphere-raw-block-sc"},"parameters":{"datastoreurl":"ds:///vmfs/volumes/vsan:5238a205736fdb1f-c71f7ec7a0353662/"},"provisioner":"csi.vsphere.vmware.com","reclaimPolicy":"Delete","volumeBindingMode":"WaitForFirstConsumer"}
         storageclass.kubernetes.io/is-default-class: "true"
       creationTimestamp: "2022-04-05T20:26:35Z"
    name: vsphere-raw-block-sc
       resourceVersion: "12018"
       uid: 40493804-34aa-4895-abf3-89676fcf173c
     parameters:
       datastoreurl: ds:///vmfs/volumes/vsan:5238a205736fdb1f-c71f7ec7a0353662/
     provisioner: csi.vsphere.vmware.com
    reclaimPolicy: Delete
      volumeBindingMode: WaitForFirstConsumer
    EOF
   ```

1.  Run the following command to create the StorageClass object:

   ```bash
   kubectl create -f xxx_sc.yaml
   ```

   The output appears similar to this example:

   ```sh
   %%% output
   ```

1.  %%% What's the next step?

[vsphere-csi-plugin]: https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-74AF02D7-1562-48BD-A9FE-C81A53342AC3.html
[create-capi-image]: ../../create-capi-vm-image/
