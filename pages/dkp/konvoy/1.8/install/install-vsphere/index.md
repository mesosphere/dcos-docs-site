---
layout: layout.pug
navigationTitle: Install on VMWare vSphere
title: Install on VMWare vSphere
menuWeight: 20
excerpt: Prepare for and install Konvoy on VMWare vSphere
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This topic describes how to prepare your environment and install Konvoy on VMWare vSphere. This installation is similar to deploying the entire Kubernetes cluster onto vSphere Infrastructure as a Service (IaaS).

## Before you Begin

Before installing, verify that your environment meets the following basic requirements:

* vCenter version v6.7.x

  vCenter provides the vSphere APIs that Konvoy uses to create the cluster VMs. The API endpoint
  must be reachable from where the Konvoy command line interface (CLI) runs.

* vSphere account with [credentials configured][credentials_configured]

  Konvoy uses the account to access vCenter APIs. This account must have administrator privileges.

* [govc][install_govc] command-line utility

   This guide shows how to use the govc CLI to create vSphere roles that are used by the Kubernetes cluster components.

- [Docker][install_docker] version 18.09.2 or later

  You must have Docker installed on the host where the Konvoy CLI runs. For example, if you are
  installing Konvoy on your laptop, ensure the laptop has a supported version of Docker.

- [kubectl][install_kubectl] v1.20.6 or later

  To enable interaction with the running cluster, you must have `kubectl` installed on the host where the Konvoy command line interface (CLI) runs.

## Install Konvoy on vSphere

To install Konvoy on vSphere, perform the following tasks:

* Set the vSphere environment variables
* Create roles using govc
* Configure prerequisites cloud-provider user
* Configure tags for Datacenters and Zones
* Checking your VM templates exists
* Install Konvoy
* Modify the Cluster Name (optional)
* Show planned infrastructure changes

## Set the vSphere environment variables
Set the following environment variables:

  ```bash
  # export of settings
  export VSPHERE_SERVER=_YOUR_VCENTER_URL
  export VSPHERE_USER=_YOUR_VCENTER_USERNAME
  export VSPHERE_PASSWORD=_YOUR_VCENTER_PASSWORD
  export VSPHERE_ALLOW_UNVERIFIED_SSL=true
  export VSPHERE_PERSIST_SESSION=true
  ```

## Create roles using govc
Ensure the following roles are set:

  ```bash
  # set environment variables from before set variables
  export GOVC_URL=${VSPHERE_SERVER}
  export GOVC_USERNAME=${VSPHERE_USER}
  export GOVC_PASSWORD=${VSPHERE_PASSWORD}
  export GOVC_INSECURE=${VSPHERE_ALLOW_UNVERIFIED_SSL}
  export GOVC_PERSIST_SESSION=${VSPHERE_PERSIST_SESSION}

  # create roles
  govc role.create CNS-DATASTORE Datastore.FileManagement
  govc role.create CNS-HOST-CONFIG-STORAGE Host.Config.Storage
  govc role.create CNS-VM VirtualMachine.Config.AddExistingDisk VirtualMachine.Config.AddRemoveDevice
  govc role.create CNS-SEARCH-AND-SPBM Cns.Searchable StorageProfile.View
  ```

## Create a cloud-provider user and assign it to the roles on hierarchical levels
<p class="message--note"><strong>NOTE: </strong>You must only do this once or you do it per cluster, if you want to add cloud-provider users per cluster. You also can reuse cloud-provider user for Kubernetes CPI and CSI for several Konvoy setups.</p>

The cloud-provider user is used for CPI and CSI, to get the full advantage of running a Konvoy cluster on vSphere.

- Assign the role `CNS-DATASTORE` to your cloud-provider user at all to be used `Datastores`.
- Assign the role `CNS-HOST-CONFIG-STORAGE` to your cloud-provider user at all to be used vSAN clusters.
- Assign the role `CNS-VM` to your cloud-provider user **propagated** at the folder where your VMs will be started in. We recommend to create an extra VM Folder for this purpose and not use the root (/).
- Assign the role `CNS-SEARCH-AND-SPBM` to your cloud-provider user at the root level of the vCenter Server.
- Assign the role `ReadOnly` to your cloud-provider user at all `Datacenters`.
- Assign the role `ReadOnly` to your cloud-provider user **propagated** at all `Clusters`.

More details about setting the roles to the correct vSphere level can be found at the [CSI Driver prerequisites][csi_driver_prerequisites].

## Create tags for Datacenters and Zones
To use the cloud-provider CSI, refer to the [Set Up Zones in the vSphere CNS Environment][zones_setup] guide.
Keep the categories named `k8s-region` and `k8s-zone`, the tags can and should match your `Datacenter` and `Cluster` names.

## VM Templates
<p class="message--note"><strong>NOTE: </strong>Default VM Template name is centos7.</p>

You must have a VM Template registered in your `Datacenters` storage. The following software must be present in

- cloud-init
- [cloud-init-vmware-guestinfo][cloud_init_vmware_guestinfo]
- open-vm-tools (or VMWare provided version)

## Installation

1. After verifying your prerequisites, create a vSphere Kubernetes cluster.yaml by running `konvoy init --provisioner vsphere`. This command creates your `cluster.yaml` for vSphere, installs Kubernetes and default addons to support your Kubernetes cluster.

2. Edit your `cluster.yaml` file and define the empty set values in `spec.vsphere`. If you want to configure a multi `Datacenter` setup, define the lists with all needed values.
For example, the `cluster.yaml` content can look similar to the following:

```yaml
vsphere:
  server: vcenter.hw.ca1.ksphere-platform.d2iq.cloud
  port: 443
  datacenters:
    - name: dc1
      cluster: zone1
      network: VMs
      datastore: vsanDatastore
      # This is a VM folder you pre-created in your cluster, as mentioned for the CNS-VM role.
      vmFolder: D2iQ
  username: _YOUR_CLOUD_PROVIDER_USER_NAME_
  password: _YOUR_CLOUD_PROVIDER_USER_PASSWORD_
```

If you do not want to insert the CSI username and password directly you can write instead:

```yaml
  username: ${KONVOY_VSPHERE_CSI_USERNAME}
  password: ${KONVOY_VSPHERE_CSI_PASSWORD}
```

In this case you need to make sure to set `KONVOY_VSPHERE_CSI_USERNAME` and `KONVOY_VSPHERE_CSI_PASSWORD`
environment variables.

Change the addon `metallb` to be `enabled: true` and set the `addresses` you like to provide
as `ServiceType: LoadBalancer` in your network.
More details about [Load balancing for external traffic here][load_balancing_for_external_traffic].

Specifically, the `konvoy up` command, for a preconfigured `cluster.yaml`, does the following:

* Provisions three `xlarge` virtual machines as Kubernetes master nodes. Definition is 4 CPUs, 16GB RAM.
* Provisions four `2xlarge` virtual machines as Kubernetes worker nodes. Definition is 8 CPUs, 32GB RAM.
* Deploys all of the following default addons:
  * Calico
  * Cert-Manager
  * CoreDNS
  * Helm
  * vSphere CSI driver
  * Elasticsearch (including Elasticsearch Exporter)
  * Fluent Bit
  * Kibana
  * Prometheus operator (including Grafana, AlertManager and Prometheus Adapter)
  * Traefik
  * Kubernetes dashboard
  * Operations portal
  * Velero
  * Dex identity service
  * Dex Kubernetes client authenticator
  * Traefik forward authorization proxy
  * Kommander
  * Reloader
  * Default Storage Class Protection
  * Gatekeeper
  * Konvoy Config

The default configuration options are recommended for a small cluster (about 10 worker nodes).

## Modify the cluster name
By default, the cluster name is the name of the folder where the `konvoy` command is run. The cluster name is used to tag the provisioned infrastructure and the context when applying the kubeconfig file. To change the cluster name, run the following command:

  ```bash
  konvoy init --provisioner vsphere --cluster-name <YOUR_SPECIFIED_NAME>
  ```

<p class="message--note"><strong>NOTE: </strong>The cluster name can only contain the following characters: <code>a-z, 0-9, . - and _</code>.</p>

## Show planned infrastructure changes

Before running `konvoy up` or `konvoy provision`, it is also possible to show the calculated changes that would be performed on the infrastructure by [Terraform][terraform].

You should see the following output:

  ```bash
  $ konvoy provision --plan-only
  ...
  Plan: 11 to add, 0 to change, 0 to destroy.
  ```

<p class="message--note"><strong>NOTE: </strong>This command can be run before the initial provisioning or at any point after modifications are made to the <code>cluster.yaml</code> file.</p>

### Add custom cloud.conf file

Konvoy generates a default `cloud.conf.konvoy`, `cloud-csi.conf.konvoy` and `cpi-global-secret.yaml.konvoy` file based on the provisioned infrastructure.
If your cluster requires additional configuration, you can specify it by creating an `extras/cloud-provider/cloud.conf`, `extras/cloud-provider/cloud-csi.conf` and `extras/cloud-provider/cpi-global-secret.yaml` file in your working directory.
Konvoy then copies this file to the remote machines and configures the necessary Kubernetes components to use this configuration file.

You can also configure Konvoy to use the files already present on the Kubernetes machines. On the remote machines, create `/root/kubernetes/cloud.conf`, `/root/kubernetes/cloud-csi.conf` and `/root/kubernetes/cpi-global-secret.yaml` files and Konvoy will configure the necessarily Kubernetes components to use this configuration file.

When files in `extras/cloud-provider` and `root/kubernetes` are specified, the remote `/root/kubernetes/` presented files are used.

## View installation operations

As the `konvoy up` command runs to start the cluster installation defined by `cluster.yaml`, you will see output as the operations are performed. The first output messages you see are from [Terraform][terraform] as it provisions your nodes.

After the nodes are provisioned, [Ansible][ansible] connects to the instances and installs Kubernetes in steps called tasks and playbooks. Near the end of the output, addons are installed.

## View cluster operations

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

## Check the files installed

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
