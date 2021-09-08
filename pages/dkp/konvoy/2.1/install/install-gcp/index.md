---
layout: layout.pug
navigationTitle: Install on Google Cloud Platform (GCP)
title: Install on Google Cloud Platform (GCP)
menuWeight: 20
excerpt: Prepare for and install Konvoy on Google Cloud Platform (GCP)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes how to prepare your environment and install Konvoy on Google Cloud Platform (GCP). It relates to deploying the entire Kubernetes cluster onto GCP Infrastructure as a Service (IaaS). You can also manage Google Kubernetes Engine (GKE) through [D2iQ Kommander][kommander_clusters].

## Before you Begin

This requires the following configurations and background:

* [Google Cloud SDK][install_gcloud]
* [Docker Desktop][install_docker] _version 18.09.2 or higher_
* [kubectl][install_kubectl] _v1.15.4 or newer_ (for interacting with the running cluster)
* GCP account with [credentials configured][gcloud_sdk]. Be sure to set your `project` and `region` you want to use, and export it
* Latest Konvoy [Download][konvoy_download]

### To install Konvoy on GCP, you will perform the following

* Set the GCP Default Region
* Create a role using the GCP SDK commands
* Install Konvoy
* Modify the Cluster Name (optional)
* Show planned infrastructure changes

## Set the GCP Default Region

By default, Konvoy will be deployed on GCP `us-west1` region, on three zones (a, b, c). To avoid any region conflict, update your GCP config setting to align with `us-west1` region. For specific region deployment, see advanced section [here][customize_region].

  ```bash
  # set config and login with default config
  gcloud config set compute/region "us-west1"
  gcloud config set project "YOUR_PROJECT"
  gcloud auth application-default login

  # export of settings
  export GOOGLE_PROJECT=$(gcloud config get-value project)
  export GOOGLE_REGION=$(gcloud config get-value compute/region)

  # enable service APIs
  gcloud services enable cloudresourcemanager.googleapis.com
  gcloud services enable compute.googleapis.com
  gcloud services enable iam.googleapis.com
  gcloud services enable iamcredentials.googleapis.com
  gcloud services enable stackdriver.googleapis.com
  gcloud services enable pubsub.googleapis.com
  ```

### Permission Settings

<p class="message--note"><strong>NOTE: </strong>You must have, as a minimum, the following permissions setup for your Konvoy Role in your GCP project (new <code>konvoy-file.yaml</code>)</p>

  ```bash
  title: Konvoy Management
  description: Minimal set of permissions to manage konvoy clusters.
  stage: ALPHA
  includedPermissions:
  - compute.acceleratorTypes.list
  - compute.addresses.create
  - compute.addresses.delete
  - compute.addresses.get
  - compute.addresses.list
  - compute.addresses.use
  - compute.autoscalers.get
  - compute.autoscalers.create
  - compute.autoscalers.list
  - compute.autoscalers.update
  - compute.backendBuckets.create
  - compute.backendBuckets.delete
  - compute.backendBuckets.list
  - compute.backendBuckets.update
  - compute.backendServices.create
  - compute.backendServices.delete
  - compute.backendServices.get
  - compute.backendServices.list
  - compute.backendServices.update
  - compute.backendServices.use
  - compute.disks.create
  - compute.disks.delete
  - compute.disks.get
  - compute.disks.getIamPolicy
  - compute.disks.list
  - compute.disks.setIamPolicy
  - compute.disks.setLabels
  - compute.disks.use
  - compute.diskTypes.list
  - compute.firewalls.create
  - compute.firewalls.delete
  - compute.firewalls.get
  - compute.firewalls.list
  - compute.firewalls.update
  - compute.forwardingRules.create
  - compute.forwardingRules.delete
  - compute.forwardingRules.get
  - compute.forwardingRules.list
  - compute.globalAddresses.create
  - compute.globalAddresses.delete
  - compute.globalAddresses.get
  - compute.globalAddresses.list
  - compute.globalAddresses.use
  - compute.globalForwardingRules.create
  - compute.globalForwardingRules.delete
  - compute.globalForwardingRules.get
  - compute.globalForwardingRules.list
  - compute.globalOperations.get
  - compute.globalOperations.list
  - compute.healthChecks.create
  - compute.healthChecks.delete
  - compute.healthChecks.get
  - compute.healthChecks.list
  - compute.healthChecks.update
  - compute.healthChecks.use
  - compute.healthChecks.useReadOnly
  - compute.httpHealthChecks.create
  - compute.httpHealthChecks.delete
  - compute.httpHealthChecks.get
  - compute.httpHealthChecks.list
  - compute.httpHealthChecks.update
  - compute.httpHealthChecks.use
  - compute.httpHealthChecks.useReadOnly
  - compute.httpsHealthChecks.create
  - compute.httpsHealthChecks.delete
  - compute.httpsHealthChecks.get
  - compute.httpsHealthChecks.list
  - compute.httpsHealthChecks.update
  - compute.httpsHealthChecks.use
  - compute.httpsHealthChecks.useReadOnly
  - compute.images.get
  - compute.images.getFromFamily
  - compute.images.list
  - compute.instanceGroupManagers.list
  - compute.instanceGroups.create
  - compute.instanceGroups.delete
  - compute.instanceGroups.get
  - compute.instanceGroups.list
  - compute.instanceGroups.update
  - compute.instanceGroups.use
  - compute.instances.addAccessConfig
  - compute.instances.attachDisk
  - compute.instances.create
  - compute.instances.delete
  - compute.instances.deleteAccessConfig
  - compute.instances.detachDisk
  - compute.instances.get
  - compute.instances.getIamPolicy
  - compute.instances.list
  - compute.instances.listReferrers
  - compute.instances.osLogin
  - compute.instances.reset
  - compute.instances.resume
  - compute.instances.setDiskAutoDelete
  - compute.instances.setIamPolicy
  - compute.instances.setLabels
  - compute.instances.setMachineResources
  - compute.instances.setMachineType
  - compute.instances.setMetadata
  - compute.instances.setMinCpuPlatform
  - compute.instances.setScheduling
  - compute.instances.setServiceAccount
  - compute.instances.setTags
  - compute.instances.start
  - compute.instances.stop
  - compute.instances.suspend
  - compute.instances.updateAccessConfig
  - compute.instances.updateNetworkInterface
  - compute.instances.updateShieldedInstanceConfig
  - compute.instances.use
  - compute.instanceTemplates.create
  - compute.instanceTemplates.delete
  - compute.instanceTemplates.get
  - compute.instanceTemplates.list
  - compute.machineTypes.get
  - compute.machineTypes.list
  - compute.networkEndpointGroups.create
  - compute.networkEndpointGroups.delete
  - compute.networkEndpointGroups.get
  - compute.networkEndpointGroups.list
  - compute.networkEndpointGroups.use
  - compute.networks.create
  - compute.networks.delete
  - compute.networks.get
  - compute.networks.list
  - compute.networks.updatePeering
  - compute.networks.updatePolicy
  - compute.networks.use
  - compute.projects.get
  - compute.projects.setCommonInstanceMetadata
  - compute.regionBackendServices.create
  - compute.regionBackendServices.delete
  - compute.regionBackendServices.get
  - compute.regionBackendServices.list
  - compute.regionBackendServices.update
  - compute.regionBackendServices.use
  - compute.regionOperations.get
  - compute.regions.list
  - compute.resourcePolicies.create
  - compute.resourcePolicies.list
  - compute.routers.create
  - compute.routers.delete
  - compute.routers.get
  - compute.routers.list
  - compute.routers.update
  - compute.routes.create
  - compute.routes.delete
  - compute.routes.get
  - compute.routes.list
  - compute.subnetworks.create
  - compute.subnetworks.delete
  - compute.subnetworks.get
  - compute.subnetworks.list
  - compute.subnetworks.update
  - compute.subnetworks.use
  - compute.subnetworks.useExternalIp
  - compute.targetPools.addHealthCheck
  - compute.targetPools.addInstance
  - compute.targetPools.create
  - compute.targetPools.delete
  - compute.targetPools.get
  - compute.targetPools.list
  - compute.targetPools.removeHealthCheck
  - compute.targetPools.update
  - compute.targetPools.use
  - compute.targetTcpProxies.create
  - compute.targetTcpProxies.delete
  - compute.targetTcpProxies.get
  - compute.targetTcpProxies.list
  - compute.targetTcpProxies.update
  - compute.targetTcpProxies.use
  - compute.zoneOperations.get
  - compute.zones.get
  - compute.zones.list
  - iam.roles.create
  - iam.roles.delete
  - iam.roles.get
  - iam.roles.list
  - iam.roles.update
  - iam.serviceAccountKeys.create
  - iam.serviceAccountKeys.delete
  - iam.serviceAccountKeys.list
  - iam.serviceAccounts.actAs
  - iam.serviceAccounts.create
  - iam.serviceAccounts.delete
  - iam.serviceAccounts.get
  - iam.serviceAccounts.getIamPolicy
  - iam.serviceAccounts.list
  - iam.serviceAccounts.setIamPolicy
  - iam.serviceAccounts.update
  - orgpolicy.policy.get
  - pubsub.topics.create
  - resourcemanager.projects.get
  - resourcemanager.projects.getIamPolicy
  - resourcemanager.projects.setIamPolicy
  - resourcemanager.projects.update
  - servicemanagement.services.bind
  - servicemanagement.services.update
  ```

# Create a role using the GCP SDK commands
<p class="message--note"><strong>NOTE: </strong>Create or update the role with the command, if the role is not in your project.</p>

  ```bash
  gcloud iam roles create konvoy --project ${GOOGLE_PROJECT} --file ./konvoy-role.yaml
  ```

## Installation

After verifying your prerequisites, create a GCP Kubernetes cluster by running `konvoy up --provisioner gcp`. This command creates your GCP [VM instances][compute_virtual_machine], installs Kubernetes and default addons to support your Kubernetes cluster.

Specifically, the `konvoy up --provisioner gcp` command does the following:

* Provisions three `n1-standard-4` virtual machines as Kubernetes master nodes
* Provisions four `n1-standard-8` virtual machines as Kubernetes worker nodes
* Deploys all of the following default addons:
  * Calico
  * Cert-Manager
  * CoreDNS
  * Helm
  * GCE Disk CSI driver
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
  * Kudo
  * Konvoy Config

The default configuration options are recommended for a small cluster (about 10 worker nodes).

## Modifying the cluster name
By default, the cluster name is the name of the folder where the `konvoy` command is run. The cluster name is used to tag the provisioned infrastructure and the context when applying the kubeconfig file. To customize the cluster name, run the following command:

  ```bash
  konvoy up --provisioner gcp --cluster-name <YOUR_SPECIFIED_NAME>
  ```

<p class="message--note"><strong>NOTE: </strong>The cluster name may only contain the following characters: <code>a-z, 0-9, . - and _</code>.</p>

## Show planned infrastructure changes

Before running `konvoy up` or `konvoy provision`, it is also possible to show the calculated changes that would be performed on the infrastructure by [Terraform][terraform].

Running the following command should result in a similar output:

  ```bash
  $ konvoy provision --plan-only
  ...
  Plan: 41 to add, 0 to change, 0 to destroy.
  ```

<p class="message--note"><strong>NOTE: </strong>This command can be run before the initial provisioning or at any point after modifications are made to the <code>cluster.yaml</code> file.</p>

### Adding custom cloud.conf file

Konvoy will generate a default `cloud.conf` file based on the provisioned infrastructure.
If your cluster requires additional configuration, you may specify it by creating a `extras/cloud-provider/cloud.conf` file in your working directory.
Konvoy will then copy this file to the remote machines and configure the necessarily Kubernetes components to use this configuration file.

It is also possible to configure Konvoy to use the files already present on the Kubernetes machines. On the remote machines, create `/root/kubernetes/cloud.conf` files and Konvoy will configure the necessarily Kubernetes components to use this configuration file.

In the case when both files are specified, the remote `/root/kubernetes/cloud.conf` file will be used.

## Viewing installation operations

As the `konvoy up --provisioner gcp` command runs to start the cluster installation, you will see output as the operations are performed. The first output messages you see are from [Terraform][terraform] as it provisions your nodes.

After the nodes are provisioned, [Ansible][ansible] connects to the instances and installs Kubernetes in steps called tasks and playbooks. Near the end of the output, addons are installed.

## Viewing cluster operations

You can monitor your cluster through the [Operations Portal][ops_portal] user interface. After you run the `konvoy up --provisioner gcp` command, if the installation is successful, the command output displays the information you need to access the Operations Portal.

For example, you should see information similar to this:

  ```bash
  Kubernetes cluster and addons deployed successfully!

  Run `konvoy apply kubeconfig` to update kubectl credentials.
  Run `konvoy check` to verify that the cluster has reached a steady state and all deployments have finished.
  Navigate to the URL below to access various services running in the cluster.
    https://34.83.142.40/ops/landing
  And login using the credentials below.
    Username: AUTO_GENERATED_USERNAME
    Password: SOME_AUTO_GENERATED_PASSWORD_12345
  If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
  ```

## Checking the files installed

When the `konvoy up --provisioner gcp` completes its setup operations, the following files are generated:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize your [cluster configuration][cluster_configuration].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the kube-apiserver of your cluster through kubectl][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][inventory].
* `state` folder - contains Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the instances.
* `runs` folder - which contains logging information.

[ansible]: https://www.ansible.com
[cluster_configuration]: ../../reference/cluster-configuration/
[compute_virtual_machine]: https://cloud.google.com/compute/docs/instances/
[customize_region]: advanced-provisioning#customize-region-and-availability-zones
[gcloud_sdk]: https://cloud.google.com/sdk/docs/initializing
[install_docker]: https://www.docker.com/products/docker-desktop
[install_gcloud]: https://cloud.google.com/sdk/install
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[kommander_clusters]: https://docs.d2iq.com/dkp/kommander/latest/clusters/attach-cluster/
[konvoy_download]: ../../download
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl]: ../../access-authentication/access-konvoy#using-kubectl
[ops_portal]: ../../access-authentication/access-konvoy#using-the-operations-portal
[state]: https://www.terraform.io/docs/state/
[terraform]: https://www.terraform.io
