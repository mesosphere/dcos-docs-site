---
layout: layout.pug
navigationTitle: Create a vSphere VM Template
title: Create a vSphere VM Template
menuWeight: 40
excerpt: Create a vSphere VM template using the base OS image and the DKP image builder
enterprise: false
---

## Prerequisites

You need to create a [base OS image][vsphere-base-os-image] in vSphere before starting this procedure.

## Create a vSphere template for your cluster from a base OS image

Using the base OS image created in a previous procedure, DKP creates the new vSphere template directly on the vCenter server.

1. Set the following vSphere environment variables on the same machine where DKP is running:

    ```bash
    export VSPHERE_SERVER=your_vCenter_APIserver_URL
    export VSPHERE_USERNAME=your_vCenter_user_name
    export VSPHERE_PASSWORD=your_vCenter_password
    ```

1. Locate the base OS vSphere template in the vSphere UI client and make a note of the path and file name.

1. Create an `image.yaml` file and add the following variables for vSphere. DKP uses this file and these variables as inputs in the next step. In the example below, `example_base_OS_template_name` refers to the name of the base OS vSphere template created in a previous step.

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

    The website for [Packer](https://www.packer.io/plugins/builders/vsphere/vsphere-clone) gives details around many of these variables. However, there are fewer configuration variables needed for use in the vSphere KIB provisioning than what is listed on the Packer website. Below are the variables and optional configurations to be used with vSphere:

-    cluster: vSphere cluster is a name of the collection of ESXi hosts in vSphere.
-    datacenter: vSphere datacenter name - This is required if more than one datacenter exists in the vSphere inventory.
-    datastore: vSphere datastore name - The datastore stores files of the virtual machines. These could be located on a local server, hard drive or across the network on a SAN.
-    folder: Virtual machine folder in which to create the virtual machine.
-    network: The vSphere network in which the virtual machine will be connected.
-    resource_pool: vSphere resource pool name - If not set, it will look for the root resource pool of the host or cluster. If a root resource is not found, it will then look for a default resource pool.
-    template: Name of the vSphere template of the base operating system - Konvoy Image Builder will use the base operating system template and configure it. This will produce a new vSphere template which can be used to create virtual machines for the Kubernetes cluster.

4. Create the vSphere VM template with the following command:

   ```bash
   konvoy-image build path/to/image.yaml
   ```

    The DKP image builder uses the values in `image.yaml` and the input base OS image to create a vSphere template that contains the required artifacts needed to create a Kubernetes cluster. Give the file a suitable name using this suggested naming convention: `creator-ova-vsphere-OS-ver-k8sver-unique_identifier`. As an example, the filename you create might resemble `dkp-ova-vsphere-rhel-84-1.21.6-1646938922`.

   DKP creates the new vSphere template directly on the vCenter server.

Next, create a Kubernetes [bootstrap cluster][bootstrap] to enable creating your vSphere cluster and moving CAPI objects to it.

[vsphere-base-os-image]: ../create-base-os-image/
[bootstrap]: ../bootstrap
