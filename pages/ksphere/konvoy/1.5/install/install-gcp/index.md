---
layout: layout.pug
navigationTitle: Install on Google Cloud Platform (GCP)
title: Install on Google Cloud Platform (GCP)
menuWeight: 20
excerpt: Prepare for and install Konvoy on Google Cloud Platform (GCP)
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes how to prepare your environment and install Konvoy on Google Cloud Platform (GCP).

## Prerequisites

* The [gcloud][install_gcloud] command line utility
* [Docker Desktop][install_docker] _version 18.09.2 or newer_
* [kubectl][install_kubectl] _v1.15.4 or newer_ (for interacting with the running cluster)
* A valid GCP account with [credentials configured][gcloud_sdk].
  Make sure to set your `project` and `region` you want to use, and export it

  ```bash
  # set config and login with default config
  gcloud config set compute/region "YOUR_REGION"
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

<p class="message--note"><strong>NOTE: </strong>You must have, as a minimum, the following permissions in your GCP project.</p>

```yaml
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
<p class="message--note"><strong>NOTE: </strong>Create or update the role with the command, if the role is not in your project</p>

```bash
gcloud iam roles create konvoy --project ${GOOGLE_PROJECT} --file ./konvoy-role.yaml
```

# Create a service account for `konvoy` deployment and for spinning up a Kubernetes cluster
You can do this if you do not want to use your own user [logged in][gcloud_sdk] credentials.

```bash
gcloud iam service-accounts create konvoy --description "Management of Konvoy clusters" --display-name "Konvoy Management"
gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:konvoy@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role projects/${GOOGLE_PROJECT}/roles/konvoy
gcloud iam service-accounts keys create ${HOME}/.config/gcloud/konvoy-sa-${GOOGLE_PROJECT}.json --iam-account konvoy@${GOOGLE_PROJECT}.iam.gserviceaccount.com
export GOOGLE_APPLICATION_CREDENTIALS="${HOME}/.config/gcloud/konvoy-sa-${GOOGLE_PROJECT}.json"
```

## Installation

After verifying your prerequisites, create an GCP Kubernetes cluster by running `konvoy up --provisioner gcp`.
This command creates your GCP [VM instances][compute_virtual_machine], installs Kubernetes and default add-ons to support your Kubernetes cluster.

Specifically, the `konvoy up --provisioner gcp` command does the following:

* Provisions three `n1-standard-4` virtual machines as Kubernetes master nodes
* Provisions four `n1-standard-8` virtual machines as Kubernetes worker nodes
* Deploys all of the following default add-ons:
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

By default, the cluster name is the name of the folder where the konvoy command is run.
The cluster name is used to tag the provisioned infrastructure and the context when applying the kubeconfig file.
To customize the cluster name, run the following command:

```bash
konvoy up --provisioner gcp --cluster-name <YOUR_SPECIFIED_NAME>
```

## Control plane and worker nodes

Control plane nodes are the nodes where the Kubernetes Control Plane components are installed.
The Control Plane contains [various components][control_plane], including `etcd`, `kube-apiserver` (that [you will interact with through `kubectl`][kubectl]), `kube-scheduler` and `kube-controller-manager`. Refer to the [Concepts section][concepts] for more information.
Having three control plane nodes makes the cluster "highly available" to protect against failures.
Worker nodes run your containers in [Kubernetes pods][pods].

## Default addons

The default addons help you manage your Kubernetes cluster by providing monitoring (Prometheus), logging (Elasticsearch), dashboards (Kubernetes Dashboard), storage (GCE Disk CSI Driver), ingress (Traefik) and other services.

## Viewing installation operations

As the `konvoy up --provisioner gcp` command runs, to start the cluster installation, you will see output as the operations are performed.
The first output messages you see are from [Terraform][terraform] as it provisions your nodes.

After the nodes are provisioned, [Ansible][ansible] connects to the instances and installs Kubernetes in steps called tasks and playbooks.
Near the end of the output, addons are installed.

## Viewing cluster operations

You can monitor your cluster through the [Operations Portal][ops_portal] user interface.
After you run the `konvoy up --provisioner gcp` command, if the installation is successful, the command output displays the information you need to access the Operations Portal.

For example, you should see information similar to this:

```text
Kubernetes cluster and addons deployed successfully!

Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://34.83.142.40/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

The dashboard and services may take a few minutes to be accessible.
```

## Checking the files installed

When the `konvoy up --provisioner gcp` completes its setup operations, the following files are generated:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize [your cluster configuration][cluster_configuration].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][inventory].
* `state` folder - contains Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the instances.
* `runs` folder - which contains logging information.

[gcloud_sdk]: https://cloud.google.com/sdk/docs/initializing
[install_gcloud]: https://cloud.google.com/sdk/install
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[prerequisites]: #prerequisites
[cluster_configuration]: ../../reference/cluster-configuration/
[kubectl]: ../../operations/accessing-the-cluster/index.md#using-kubectl
[ops_portal]: ../../operations/accessing-the-cluster/index.md#using-the-operations-portal
[compute_virtual_machine]: https://cloud.google.com/compute/docs/instances/
[control_plane]: https://kubernetes.io/docs/concepts/overview/components/
[pods]: https://kubernetes.io/docs/concepts/workloads/pods/pod/
[terraform]: https://www.terraform.io
[ansible]: https://www.ansible.com
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[state]: https://www.terraform.io/docs/state/
[concepts]: ../../concepts/
