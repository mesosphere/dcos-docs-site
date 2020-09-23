---
layout: layout.pug
beta: true
navigationTitle: Creating Konvoy Clusters on Premises
title: Creating Konvoy Clusters on Premises
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on your own premises' infrastructure
---

## Prerequisites

- A configured [On-Prem Infrastructure Provider](/ksphere/kommander/1.2/operations/infrastructure-providers/configure-on-prem-provider/)
- [konvoy CLI](/ksphere/konvoy/1.5/download/)

## Inventory Your Hosts

You need an Ansible inventory file to describe the hosts where you want to install Konvoy. You can use Konvoy to generate the skeleton of your inventory and cluster definitions:

```bash
konvoy init --provisioner=none [--cluster-name <your-specified-name>]
```

## Cluster Configuration

After editing the inventory file, edit the generated cluster.yaml file. The cluster.yaml file provides the configuration details for creating your Konvoy cluster.

See the [Install on-premises](/ksphere/konvoy/1.5/install/install-onprem/) guide in the Konvoy documentation for more details.

## Provision in UI

![Add Cluster Options](/ksphere/kommander/1.2/img/add-cluster.png)

In Kommander UI, choose the workspace where the on premises infrastructure provider was created in the header drop-down. From the workspace dashboard, select **Actions** > **Add Cluster**, and from the **Add Cluster** menu, select the **Upload YAML to Create a Cluster** option. Select your on premises infrastructure provider from the **Select Infrastructure Provider** select field.

Paste the contents of the cluster.yaml and inventory.yaml files into the form and select **Continue** to begin provisioning Konvoy onto your hosts.

## Related information

- [Install the konvoy CLI](/ksphere/konvoy/1.5/download/)
- [Create an on premises infrastructure provider](/ksphere/kommander/1.2/operations/infrastructure-providers/configure-on-prem-provider/)
- [Install an on premises konvoy cluster](/ksphere/konvoy/1.5/install/install-onprem/)
