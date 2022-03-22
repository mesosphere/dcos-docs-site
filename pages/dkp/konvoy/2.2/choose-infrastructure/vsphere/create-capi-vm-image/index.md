---
layout: layout.pug
navigationTitle: Create a CAPI VM Image
title: Create a CAPI VM Image
menuWeight: 40
excerpt: Create a CAPI VM image using the DKP image builder
enterprise: false
---

%%% Need some text here describing what we are doing and why...

1. Set the following vSphere environment variables on the same machine where DKP is running:

  ```bash
  # export of settings
  export VSPHERE_SERVER=your_vCenter_APIserver_URL
  export VSPHERE_USERNAME=your_vCenter_user_name
  export VSPHERE_PASSWORD=your_vCenter_password
  ```

1. Copy the base OS image file created in the vSphere Client to a location on the DKP host machine and make a note of the path and file name.

1. Set the following Packer variables for vSphere in the `image.yaml` file:

   ```yaml
   packer:
     cluster: "example_zone"
     datacenter: "example_datacenter"
     datastore: "example_datastore"
     folder: "example_folder"
     insecure_connection: "false"
     network: "example_network"
     resource_pool: "example_resource_pool"
     template: "example_base_OS_template_name"
     vsphere_guest_os_type: "example_rhel8_64Guest"
     guest_os_type: "example_rhel7-64"
     #goss params
     distribution: "example_RHEL"
     distribution_version: "example_7.9"
   ```

1. Create the CAPI VM image with the  following command:

   ```bash
   konvoy-image build path/to/image.yaml
   ```

   The DKP image builder uses the values in the environment variables and the input base OS image to create an OVA template that contains the required Kubernetes objects. Give the file a suitable name using this suggested naming convention: `creator-ova-vsphere-OS-ver-k8sver-unique_identifier`. As an example, the filename might be `konvoy-ova-vsphere-rhel-84-1.21.6-1646938922`.

1. Copy the resulting OVA image file back to the vSphere Client, placing it under the Templates tab. DKP uses this OVA image later when creating the cluster.
