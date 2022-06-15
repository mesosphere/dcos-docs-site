---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your environment to run DKP with VMware vSphere
enterprise: false
---

Fulfilling the prerequisites involves completing these areas:

-   DKP prerequisites

-   vSphere prerequisites

## DKP Prerequisites

Before using DKP to create a vSphere cluster, verify that you have:

-   An x86_64-based Linux&reg; or macOS&reg; machine.

-   The [`dkp` binaries][dkp-download] and [Konvoy Image Builder (KIB)][kib-bundle] image bundle for Linux or macOS.

-   [Docker&reg;][install_docker] version 18.09.2 or later installed.
  You must have Docker installed on the host where the DKP Konvoy CLI runs. For example, if you are installing Konvoy on your laptop, ensure the laptop has a supported version of Docker.

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

-   [kubectl][install_kubectl] 1.21.6 for interacting with the running cluster, installed on the host where the DKP Konvoy command line interface (CLI) runs.

-   A valid VMware vSphere account with credentials configured.

## VMware vSphere Prerequisites

Before installing, verify that your [VMware vSphere Client environment][vsphere-vm-administration] meets the following basic requirements:

-   Access to a bastion VM, or other network connected host, running vSphere Client version v6.7.x with Update 3 or later version

    - You must be able to reach the vSphere API endpoint from where the DKP command line interface (CLI) runs.

-   vSphere account with credentials configured - this account must have Administrator privileges.

-   A RedHat&reg; subscription with user name and password for downloading DVD ISOs

-   For air-gapped environments, a [bastion VM host template][create-bastion-vm] with access to a configured Docker registry

-   Valid vSphere values for the following:

    -   vCenter API server URL

    -   Datacenter name

    -   Zone name that contains [ESXi hosts][vmware-esxi-hosts] for your cluster's nodes

    -   Datastore name for the shared storage resource to be used for the VMs in the cluster.

        - Use of PersistentVolumes in your cluster depends on Cloud Native Storage (CNS), available in vSphere v6.7.x with Update 3 and later versions. CNS depends on this shared Datastore's configuration.

    -   Datastore URL from the datastore record for the shared datastore you want your cluster to use.

        - You need this URL value to ensure that the correct Datastore is used when DKP creates VMs for your cluster in vSphere.

    -   Folder name

    -   Base template name, such as base-rhel-8, or base-rhel-7

    -   Name of a Virtual Network that has DHCP enabled for both air-gapped and non air-gapped environments

    -   Resource Pools - at least one resource pool needed, with every host in the pool having access to shared storage, such as VSAN

        - Each host in the resource pool needs access to shared storage, such as NFS or VSAN, to make use of MachineDeployments and high-availability control planes.

The next step is:

-   for non air-gapped environments, [create a base OS image][create-base-os-image]

-   for air-gapped environments, [create and prepare a bastion VM][create-bastion-vm]

[create-base-os-image]: ../create-base-os-image/
[create-bastion-vm]: ../air-gapped/create-bastion-vm
[dkp-download]: ../../../download
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[kib-bundle]: ../../../image-builder
[vmware-esxi-hosts]: https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.esxi.install.doc/GUID-B2F01BF5-078A-4C7E-B505-5DFFED0B8C38.html
[vsphere-vm-administration]: https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-55238059-912E-411F-A0E9-A7A536972A91.html
