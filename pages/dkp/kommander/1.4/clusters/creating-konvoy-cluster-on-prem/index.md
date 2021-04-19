---
layout: layout.pug
beta: true
navigationTitle: Creating Konvoy Clusters on Premises
title: Creating Konvoy Clusters on Premises
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on your own premises' infrastructure
---

## Prerequisites

- A configured [On-Prem Infrastructure Provider][kommander-on-prem-provider]
- [Konvoy CLI][konvoy-cli]

## Inventory Your Hosts

You need an Ansible inventory file to describe the hosts where you want to install Konvoy. You can use Konvoy to generate the skeleton of your inventory and cluster definitions:

```bash
konvoy init --provisioner=none [--cluster-name <your-specified-name>]
```

## Cluster Configuration

After editing the inventory file, edit the generated `cluster.yaml` file. The `cluster.yaml` file provides the configuration details for creating your Konvoy cluster.

See the [Install on-premises][konvoy-on-prem-install] guide in the Konvoy documentation for more details.

## Provision in UI

![Add Cluster Options](/dkp/kommander/1.4/img/add-cluster.png)

In the Kommander UI, choose the workspace where the on premises infrastructure provider was created in the header drop-down. From the workspace dashboard, select **Actions** > **Add Cluster**, and from the **Add Cluster** menu, select the **Upload YAML to Create a Cluster** option. Select your on premises infrastructure provider from the **Select Infrastructure Provider** select field.

Paste the contents of the `cluster.yaml` and `inventory.yaml` files into the form and select **Continue** to begin provisioning Konvoy onto your hosts.

By default, your cluster has some labels that reflect the infrastructure provider provisioning. For example, your on premises cluster may be labelled with the label `provider: none`. Cluster labels are matched to the selectors created for [projects][projects]. Changing a cluster label may add or remove the cluster from projects.

Select **Continue** to begin provisioning the Konvoy cluster.

## Related information

- [Install the Konvoy CLI][konvoy-cli]
- [Create an on premises infrastructure provider][kommander-on-prem-provider]
- [Install an on premises Konvoy cluster][konvoy-on-prem-install]

[kommander-on-prem-provider]: /dkp/kommander/1.4/operations/infrastructure-providers/configure-on-prem-provider/
[konvoy-cli]: /dkp/konvoy/1.8/download/
[konvoy-on-prem-install]: /dkp/konvoy/1.8/install/install-onprem/
[projects]: /dkp/kommander/1.4/projects/
