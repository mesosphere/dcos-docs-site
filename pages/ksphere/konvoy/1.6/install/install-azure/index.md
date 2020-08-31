---
layout: layout.pug
navigationTitle: Install on Azure
title: Install on Azure
menuWeight: 20
excerpt: Prepare for and install Konvoy on Azure
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes how to prepare your environment and install Konvoy on Azure. It relates to deploying the entire Kubernetes cluster onto Azure Infrastructure as a Service (IaaS). You can also manage Azure Kubernetes Service (AKS) through [D2iQ Kommander][kommander_clusters].

For a demo of installing Konvoy on Azure, see this video:

<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/I6khWLL789k" frameborder="0" allowfullscreen="true"> </iframe>
</figure>

## Before you Begin

* The [azure][install_az] command line utility
* [Docker][install_docker] _version 18.09.2 or newer_
* [kubectl][install_kubectl] _v1.17.11 or newer_ (for interacting with the running cluster)
* Latest Konvoy [Download][konvoy_download]
* A valid Azure account [used to sign in with the Azure CLI][az_login].

First, log in to your Azure account with the following command:

  ```bash
  az login
  ```

This should open a browser window asking for your credentials. Once you supply your credentials to the Azure login webpage, the command line will return, outputting some of your account information (including the subscriptions you have access to).

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

If your account has access to multiple subscriptions, you should choose which subscription to use. You can do this by running the command below. It will require your subscription name which can be found in the output of the az login command.

  ```bash
  az account set --subscription "Your Subscription Name"
  ```

You need to be authorized as a `Contributor` in your Azure account and need to be able to assign roles to a user. To do this, you or your Azure Administrator must run the following command:

  ```bash
  az role assignment create --assignee YOUR_USER_LOGIN --role "User Access Administrator"
  ```

You will see this:

  ```bash
  {
    "canDelegate": null,
    "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2/providers/Microsoft.Authorization/roleAssignments/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX3",
    "name": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX3",
    "principalId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX4",
    "principalName": "user@company.onmicrosoft.com",
    "principalType": "User",
    "roleDefinitionId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2/providers/Microsoft.Authorization/roleDefinitions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX5",
    "roleDefinitionName": "User Access Administrator",
    "scope": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
    "type": "Microsoft.Authorization/roleAssignments"
  }
  ```

## Preparing the Cluster Configurations

After verifying your prerequisites, you can create all of the default configuration files needed to launch an Azure Kubernetes cluster by running the following command. Please note that the directory from which you create your configuration files and cluster will be the directory you will need to run any subsequent Konvoy commands for future administration.

  ```bash
  konvoy init --provisioner=azure
  ```

The output should look like this:

  ```bash
  Created configuration file successfully!
  ```

If you don't want to have the cluster name generated based on the working directory, you can instead run the following command to customize the cluster name:

  ```bash
  konvoy up --provisioner azure --cluster-name <YOUR_SPECIFIED_NAME>
  ```

<p class="message--note"><strong>NOTE: </strong>The cluster name may only contain the following characters: <code>a-z, 0-9, . - and _</code>.</p>

The directory where you ran this command will now contain two certificate files (`.pub` and `.pem`) to be used in the provisioning of the cluster. It will also contain a file named `cluster.yaml` which will have all of the default configurations for building a Konvoy cluster on Azure.

A summary of the default cluster deployment is below.

<p class="message--note"><strong>NOTE: </strong>Please refer to the <a href="../../reference/cluster-configuration/">cluster.yaml reference documentation</a> if you would like to customize your installation.</p>

* Provisions three `Standard_D4S_v3` virtual machines as Kubernetes master nodes
* Provisions six `Standard_D8S_v3` virtual machines as Kubernetes worker nodes
* Deploys a Kubernetes cluster with an auto-generated name
* Deploys all of the following default Addons:
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

The complete list of Azure infrastructure (VMs, networking, etc.) to be provisioned can be listed by running the following command:

  ```bash
  konvoy provision --plan-only
  ```

<p class="message--note"><strong>NOTE: </strong>This command can be run before the initial provisioning or at any point after modifications are made to the <code>cluster.yaml</code> file.</p>

## Preparing the Cluster Configurations

### Adding custom cloud.conf file

Konvoy will generate a default `cloud.conf` file based on the provisioned infrastructure.
If your cluster requires additional configuration, you may specify it by creating a `extras/cloud-provider/cloud.conf` file in your working directory.
Konvoy will then copy this file to the remote machines and configure the necessarily Kubernetes components to use this configuration file.

It is also possible to configure Konvoy to use the files already present on the Kubernetes machines. On the remote machines, create `/root/kubernetes/cloud.conf` files and Konvoy will configure the necessarily Kubernetes components to use this configuration file.

In the case when both files are specified, the remote `/root/kubernetes/cloud.conf` file will be used.

### Installing the cluster

To install the cluster with the configurations specified in the `cluster.yaml`, make sure you are in the directory with the certificates and `cluster.yaml` file and run the following command:

  ```bash
  konvoy up -y
  ```

This will kick off the creation of the Azure VM instances and environment and will install Kubernetes and all of the Addons specified in the `cluster.yaml`.  With the default configurations, it should take about 30 minutes for the Konvoy cluster to be provisioned.

When the deployment has completed, you should see output similar to the following:

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

**Install Errors:** If there is an error, a race condition may have occurred, and you can simply run the `up` process again to pick up where you left off:

  ```bash
  konvoy up -y
  ```

To verify that all of the Konvoy components are installed and running correctly, run this command:

  ```bash
  konvoy check
  ```

## Connecting to your Konvoy Operations Portal

You can access the user interface to monitor and operate your cluster through the [Operations Portal][ops_portal]. The URL, username, and password to connect are in the output from the `konvoy up` command. If you need to get this information again, you can run the following command:

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

## Connecting directly to your Kubernetes cluster from the command line using kubectl

In order to connect directly to the newly provisioned Kubernetes cluster with the native Kubernetes CLI (kubectl), you will first need to run a command to add the cluster connection information to kubctl's configuration file (`~./kube/config`). To do so, run this command:

  ```bash
  konvoy apply kubeconfig
  ```

After this command completes, you should be able to run any kubectl command connecting directly to the Kubernetes cluster. To test, you can run:

  ```bash
  kubectl get nodes
  ```

This should return the list of nodes that make up your new Kubernetes cluster.

## Deprovisioning the Cluster

To uninstall Konvoy and destroy all of the artifacts created in Azure by the deployment, you can run the following command:

  ```bash
  konvoy down -y
  ```

## Cluster Administration Directory

As mentioned in the [Preparing the Cluster Configurations][preparing_cluster_configs] section above, the directory from which you ran `konvoy up` will remain the directory you need to run any subsequent `konvoy` CLI commands.  The `konvoy` CLI is used to administer the cluster (upgrade, deprovision, scale, change configs, install Addons, etc.).  This directory is important since it will now contain the following generated files:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize [your cluster configuration][cluster_configuration].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][inventory].
* `state` folder - contains Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the EC2 instances.
* `runs` folder - which contains logging information.

[az_login]: https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest
[cluster_configuration]: ../../reference/cluster-configuration/
[install_az]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[kommander_clusters]: https://docs.d2iq.com/ksphere/kommander/1.1/clusters/attach-cluster/
[konvoy_download]: ../../download
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl]: ../../operations/accessing-the-cluster#using-kubectl
[ops_portal]: ../../operations/accessing-the-cluster#using-the-operations-portal
[preparing_cluster_configs]: #preparing-the-cluster-configurations
[state]: https://www.terraform.io/docs/state/
