---
layout: layout.pug
navigationTitle: Get Started with vSphere
title: Get Started with vSphere
excerpt: Get started by installing a cluster with the default configuration settings on vSphere
beta: true
enterprise: false
menuWeight: 10
---

This section provides instructions for getting started with DKP&reg; to get your Kubernetes cluster up and running with basic configuration requirements on a VMware&reg; vSphere&reg; public cloud instance.

### Set the Environment Variables for vSphere

Set the vSphere environment variables on the machine where you are running DKP.

<p class="message--note"><strong>NOTE: </strong>Use a valid vSphere server URL without including the http:// or https:// prefix.</p>

Use the following command to set the environment variables for vSphere:

   ```bash
   VSPHERE_SERVER=example.vsphere.url
   VSPHERE_USERNAME=user@example.vsphere.url
   VSPHERE_PASSWORD=example_password
   ```

### Set the Environment Variables for RedHat subscription

Use the following command to set environment variables to use your Red Hat credentials on the machine you are using to access vSphere:

   ```bash
   RHSM_USER=example_user
   RHSM_PASS=example_password
   ```

#### Set Hashicorp Packer variables for vSphere

Packer requires the following variables to create vSphere VM images. Add this configuration in the `image.yaml` file, substituting in the valid values for your environment.

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
     vsphere_guest_os_type: "example_rhel7_64Guest"
     guest_os_type: "example_rhel7-64"
     #goss params
     distribution: "example_RHEL"
     distribution_version: "example_7.9"
   ```

#### Create a template image on vSphere

The input for DKP to create the CAPI-enabled VM images for your cluster is the base OS image you created earlier in the vSphere client.

1. Copy the base OS image from the vSphere client to a directory on your machine.

1. Use the DKP image builder to create the VM image using this command:

   ```bash
   konvoy-image build path/to/image.yaml
   ```

### Create a DKP Booststrap cluster

To create Kubernetes clusters, Konvoy uses [Cluster API][capi_book] (CAPI) controllers. These controllers run on a Kubernetes cluster. To get started, you need a _bootstrap_ cluster. By default, Konvoy creates a bootstrap cluster for you in a Docker container using the Kubernetes-in-Docker ([KIND][kind]) tool.

1.  Create a bootstrap cluster:


    ```sh
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

   ```text
   %%% some text here for the output
   ```

Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

- [Core Provider][capi]
- [AWS Infrastructure Provider][capa]
- vSphere Provider
- [Kubeadm Bootstrap Provider][cabpk]
- [Kubeadm ControlPlane Provider][kcp]

### Create vSphere Cluster in a non-airgapped environment

Use the DKP create cluster command to create a cluster image template. Use a fixed IP address for the `--control-plane-endpoint-host` value, such as 141.95.21.150. When using air-gapped or VM network, you can use any private IP.

<p class="message--note"><strong>NOTE: </strong>The following command uses a pre-created image template, konvoy-ova-vsphere-rhel-84-1.21.6-1646938922, as an example. You can replace it with the template you created in a previous step.</p>

   ```
   konvoy create cluster vsphere \
   --cluster-name=e2e-d2iq-test \
   --network=Public \
   --control-plane-endpoint-host=141.95.21.150 \
   --data-center=dc1 \
   --data-store=ovh-nfs \
   --folder=cluster-api \
   --server=vcenter.ca1.ksphere-platform.xyzcorp.cloud \
   --ssh-public-key-file=<PATH TO SSH KEY> \
   --resource-pool=cluster-api \
   --vm-template=konvoy-ova-vsphere-rhel-84-1.21.6-1646938922
   ```

get kubeconfig, move, delete are the same as any other cloud provider... %%% John, copy these in from a likely source



### Create roles using govc

%%% they need some kind of CLI for vSphere, and to have permissions set up, however they want

Ensure the following roles are set:

  ```bash
  # set environment variables from before set variables
  export GOVC_URL=${VSPHERE_SERVER}
  export GOVC_USERNAME=${VSPHERE_USER}
  export GOVC_PASSWORD=${VSPHERE_PASSWORD}
  export GOVC_INSECURE=${VSPHERE_ALLOW_UNVERIFIED_SSL}
  export GOVC_PERSIST_SESSION=${VSPHERE_PERSIST_SESSION}

  # create roles - %%% think about dropping this
  govc role.create CNS-DATASTORE Datastore.FileManagement
  govc role.create CNS-HOST-CONFIG-STORAGE Host.Config.Storage
  govc role.create CNS-VM VirtualMachine.Config.AddExistingDisk VirtualMachine.Config.AddRemoveDevice
  govc role.create CNS-SEARCH-AND-SPBM Cns.Searchable StorageProfile.View
  ```


### Verify VM Templates
<p class="message--note"><strong>NOTE: </strong>Default VM Template name is centos7.</p>

You must have a VM Template registered in your `Datacenters` storage. The following software must be present in

- cloud-init
- [cloud-init-vmware-guestinfo][cloud_init_vmware_guestinfo]
- open-vm-tools (or VMWare provided version)


### Show planned infrastructure changes

Before running `konvoy up` or `konvoy provision`, it is also possible to show the calculated changes that would be performed on the infrastructure by [Terraform][terraform].

You should see the following output:

  ```bash
  $ konvoy provision --plan-only
  ...
  Plan: 11 to add, 0 to change, 0 to destroy.
  ```

<p class="message--note"><strong>NOTE: </strong>This command can be run before the initial provisioning or at any point after modifications are made to the <code>cluster.yaml</code> file.</p>

#### Add custom cloud.conf file

Konvoy generates a default `cloud.conf.konvoy`, `cloud-csi.conf.konvoy` and `cpi-global-secret.yaml.konvoy` file based on the provisioned infrastructure.
If your cluster requires additional configuration, you can specify it by creating an `extras/cloud-provider/cloud.conf`, `extras/cloud-provider/cloud-csi.conf` and `extras/cloud-provider/cpi-global-secret.yaml` file in your working directory.
Konvoy then copies this file to the remote machines and configures the necessary Kubernetes components to use this configuration file.

You can also configure Konvoy to use the files already present on the Kubernetes machines. On the remote machines, create `/root/kubernetes/cloud.conf`, `/root/kubernetes/cloud-csi.conf` and `/root/kubernetes/cpi-global-secret.yaml` files and Konvoy will configure the necessarily Kubernetes components to use this configuration file.

When files in `extras/cloud-provider` and `root/kubernetes` are specified, the remote `/root/kubernetes/` presented files are used.

#### View installation operations

As the `konvoy up` command runs to start the cluster installation defined by `cluster.yaml`, you will see output as the operations are performed. The first output messages you see are from [Terraform][terraform] as it provisions your nodes.

After the nodes are provisioned, [Ansible][ansible] connects to the instances and installs Kubernetes in steps called tasks and playbooks. Near the end of the output, addons are installed.

#### View cluster operations

You can monitor your cluster through the [Operations Portal][ops_portal] user interface. After you run the `konvoy up` command, if the installation is successful, the command output displays the information you need to access the Operations Portal.

For example, you should see information similar to this:

  ```bash
  Kubernetes cluster and addons deployed successfully!

  Run `konvoy apply kubeconfig` to update kubectl credentials.
  Run `konvoy check` to verify that the cluster has reached a steady state and all deployments have finished.
  Navigate to the URL below to access various services running in the cluster.
    https://172.10.42.42/ops/landing
  And login using the credentials below.
    Username: AUTO_GENERATED_USERNAME
    Password: SOME_AUTO_GENERATED_PASSWORD_12345
  If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
  ```

#### Check the files installed

When the `konvoy up --provisioner vsphere` completes setup operations, the following files are generated:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize your [cluster configuration][cluster_configuration].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the kube-apiserver of your cluster through kubectl][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][inventory].
* `state` folder - contains Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the instances.
* `runs` folder - which contains logging information.

[ansible]: https://www.ansible.com
[cluster_configuration]: ../../reference/cluster-configuration/
[install_docker]: https://www.docker.com/products/docker-desktop
[install_govc]: https://github.com/vmware/govmomi/tree/master/govc#installation
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[konvoy_download]: ../../download
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl]: ../../access-authentication/access-konvoy#using-kubectl
[ops_portal]: ../../access-authentication/access-konvoy#using-the-operations-portal
[state]: https://www.terraform.io/docs/state/
[terraform]: https://www.terraform.io
[credentials_configured]: https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vcsa.doc/GUID-CAB3C0D8-978E-47AE-82D8-0D95C4005B41.html
[csi_driver_prerequisites]: https://vsphere-csi-driver.sigs.k8s.io/driver-deployment/prerequisites.html
[zones_setup]: https://vsphere-csi-driver.sigs.k8s.io/driver-deployment/deploying_csi_with_zones.html#set_up_zones_in_vsphere
[cloud_init_vmware_guestinfo]: https://github.com/vmware/cloud-init-vmware-guestinfo
[load_balancing_for_external_traffic]: ../../networking/load-balancing#On-premises
[govc_link]: https://github.com/vmware/govmomi/tree/master/govc
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[kind]: https://github.com/kubernetes-sigs/kind
[capi_book]: https://cluster-api.sigs.k8s.io/
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm