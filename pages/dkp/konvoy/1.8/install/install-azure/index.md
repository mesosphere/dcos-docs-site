---
layout: layout.pug
navigationTitle: Install on Azure
title: Install on Azure
menuWeight: 20
excerpt: Prepare for and install Konvoy on Azure
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes how to prepare your environment and install Konvoy on Azure. It relates to deploying the entire Kubernetes cluster onto Azure Infrastructure as a Service (IaaS). You can also manage Azure Kubernetes Service (AKS) through [D2iQ Kommander][kommander_clusters].

For a demo of installing Konvoy on Azure, see this video:

<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/I6khWLL789k" frameborder="0" allowfullscreen="true"> </iframe>
</figure>

## Before you begin

The following setup and configuration requires:

- The latest version of the [azure][install_az] command line utility
- [Docker][install_docker] _version 18.09.2 or newer_
- [kubectl][install_kubectl] _v1.20.6 or newer_ (for interacting with the running cluster)
- Latest Konvoy [Download][konvoy_download]
- A valid Azure account [used to sign in with the Azure CLI][az_login].

Log in to your Azure account with the following command:

  ```bash
  az login
  ```

This opens a browser window requesting your credentials. After supplying your credentials, the command line displays some of your account information (including your accessible subscriptions).

  ```bash
  You have logged in. Now let us find all the subscriptions to which you have access...
  {
    "cloudName": "AzureCloud",
    "homeTenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
    "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
    "isDefault": true,
    "managedByTenants": [],
    "name": "Konvoy Developer Subscription",
    "state": "Enabled",
    "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
    "user": {
      "name": "user@company.onmicrosoft.com",
      "type": "user"
    }
  }
  ```

If your account has access to many subscriptions, select a subscription to use. Enter the following command. It requires your subscription name. This is found in the output of the `az login` command.

  ```bash
  az account set --subscription "Your Subscription Label"
  ```

For your Azure account, you must have the roles of `Contributor` and `User Access Administrator` to create and assign roles to a user. To do this, you or your Azure Administrator must run the following command:

```bash
az role assignment create --assignee YOUR_USER_LOGIN --role "User Access Administrator"
```

You can confirm your own roles with following command:

```bash
az role assignment list --assignee YOUR_USER_LOGIN | grep roleDefinitionName
```

Ensure the command displays the following:

```yaml
"roleDefinitionName": "User Access Administrator"
"roleDefinitionName": "Contributor"
```

## Prepare the cluster configurations

After verifying your prerequisites, enter the following command to create all the default configuration files to launch an Azure Kubernetes cluster. This current directory where you create your configuration files and cluster is the directory where you run the Konvoy commands for future administration.

  ```bash
  konvoy init --provisioner=azure
  ```

The output should look like this:

  ```bash
  Created configuration file successfully!
  ```

If you do not want to have the cluster name generated based on the working directory, you can run the following command to customize the cluster name:

  ```bash
  konvoy up --provisioner azure --cluster-name <YOUR_SPECIFIED_NAME>
  ```

<p class="message--note"><strong>NOTE: </strong>The cluster name can use the following characters: <code>a-z, 0-9, . - and _</code>.</p>

The current directory now has two certificate files (`.pub` and `.pem`) used in the provisioning of the cluster. It also has a file named `cluster.yaml` which has all the default configurations for building a Konvoy cluster on Azure.

Here is a summary of the default cluster deployment:

<p class="message--note"><strong>NOTE: </strong>Refer to the <a href="../../reference/cluster-configuration/">cluster.yaml reference documentation</a> if you would like to customize your installation.</p>

* Provisions three `Standard_D4S_v3` virtual machines as Kubernetes master nodes
* Provisions six `Standard_D8S_v3` virtual machines as Kubernetes worker nodes
* Deploys a Kubernetes cluster with an auto generated name
* Deploys all the following default addons:
  <!-- vale Vale.Terms = NO -->
  * dashboard
  * konvoyconfig
  * reloader
  * azurediskprovisioner
  * azuredisk-csi-driver
  * cert-manager
  * opsportal
  * gatekeeper
  * defaultstorageclass-protection
  * traefik
  * prometheus
  * prometheusadapter
  * dex
  * elasticsearch
  * elasticsearch-curator
  * elasticsearchexporter
  * fluentbit
  * velero
  * dex-k8s-authenticator
  * traefik-forward-auth
  * kube-oidc-proxy
  * kommander
  * kibana
  <!-- vale Vale.Terms = YES -->

Enter the following command to list all the Azure infrastructure (VMs, networking, etc.) being provisioned:

  ```bash
  konvoy provision --plan-only
  ```

<p class="message--note"><strong>NOTE: </strong>You can run this command before the initial provisioning or at any point after making modifications to the <code>cluster.yaml</code> file.</p>

## Add custom cloud.conf file

Konvoy generates a default `cloud.conf` file based on the provisioned infrastructure.
If your cluster requires more configuration, you can specify it by creating a `extras/cloud-provider/cloud.conf` file in your working directory.
Konvoy then copies this file to the remote machines and configures the necessary Kubernetes components to use this configuration file.

You can also configure Konvoy to use the files already present on the Kubernetes machines. On the remote machines, create `/root/kubernetes/cloud.conf` files and Konvoy configures the necessarily Kubernetes components to use this configuration file.

If both files exist, Konvoy uses the remote `/root/kubernetes/cloud.conf` file.

### Install the cluster

To install the cluster, ensure the correct directory with the certificates and `cluster.yaml` file is available, and run the following command:

  ```bash
  konvoy up -y
  ```

This starts the creation of the Azure VM instances and environment. This installs Kubernetes and all the addons specified in the `cluster.yaml` file. With the default configuration, it should take about 30 minutes for the Konvoy cluster to provision.

When the deployment completes, you should see output like the following:

  ```bash
  Kubernetes cluster and addons deployed successfully!

  Run `konvoy apply kubeconfig` to update kubectl credentials.

  Run `konvoy check` to verify that the cluster has reached a steady state and all deployments have finished.

  Navigate to the URL below to access various services running in the cluster.
    https://52.137.106.92/ops/landing
  And login using the credentials below.
    Username: AUTO_GENERATED_USERNAME
    Password: SOME_AUTO_GENERATED_PASSWORD_12345

  If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
  ```

**Install Errors:** If an error occurs it may be a race condition. You can run the `up` process again to pick up where you left off:

  ```bash
  konvoy up -y
  ```

Enter the following command to verify all the Konvoy components installed and are running correctly:

  ```bash
  konvoy check
  ```

## Connect to your Konvoy operations portal

You can use the user interface to monitor and operate your cluster through the [Operations Portal][ops_portal]. The URL, username, and password information is in the output from the `konvoy up` command. If you need to access this information again, you can run the following command:

  ```bash
  konvoy get ops-portal
  ```

The output should contain this information.

  ```bash
    https://52.137.106.92/ops/landing
  And login using the credentials below.
    Username: AUTO_GENERATED_USERNAME
    Password: SOME_AUTO_GENERATED_PASSWORD_12345
  ```

Use your browser to connect to the portal using the username and password.

## Connect directly to your Kubernetes cluster from the command line using kubectl

To connect directly to the newly provisioned Kubernetes cluster using the native Kubernetes CLI (kubectl), you need to add the cluster connection information to kubctl's configuration file (`~./kube/config`). Enter the following command:

  ```bash
  konvoy apply kubeconfig
  ```

When this command completes, you can run any kubectl command connecting directly to the Kubernetes cluster. To test, you can enter the following command:

  ```bash
  kubectl get nodes
  ```

This should return the list of nodes making up your new Kubernetes cluster.

## Deprovision the cluster

To uninstall Konvoy and destroy all the artifacts created in Azure by the deployment, enter the following command:

  ```bash
  konvoy down -y
  ```

## Cluster administration directory

As mentioned in the [Preparing the Cluster Configurations][preparing_cluster_configs] section, the directory where you ran `konvoy up` is the directory you use to run additional `konvoy` CLI commands. The `konvoy` CLI administers the cluster (upgrade, deprovision, scale, change configs, install Addons, etc.).  This directory is important because it now has the following generated files:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize [your cluster configuration][cluster_configuration].
* `admin.conf` - the [kubeconfig file][kubeconfig], that has credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
* `inventory.yaml` - the [Ansible Inventory file][inventory].
* `state` folder - Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the EC2 instances.
* `runs` folder - logging information.

[az_login]: https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest
[cluster_configuration]: ../../reference/cluster-configuration/
[install_az]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[kommander_clusters]: /dkp/kommander/1.4/clusters/attach-cluster/
[konvoy_download]: ../../download
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl]: ../../access-authentication/access-konvoy#using-kubectl
[ops_portal]: ../../access-authentication/access-konvoy#using-the-operations-portal
[preparing_cluster_configs]: #prepare-the-cluster-configurations
[state]: https://www.terraform.io/docs/state/
