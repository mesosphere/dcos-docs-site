---
layout: layout.pug
navigationTitle: Creating Konvoy Clusters on Premises
title: Creating Konvoy Clusters on Premises
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on your own premises' infrastructure
---

## Prerequisites

- Configured [On-Prem Cloud Provider](/dkp/kommander/1.0/operations/cloud-providers/configure-on-prem-provider/)
- [konvoy CLI](/dkp/konvoy/1.4/download/)

## Inventory Your Hosts

You need an Ansible inventory file to describe the hosts where you want to install Konvoy. You can use Konvoy to generate the skeleton of your inventory and cluster definitions:

```bash
konvoy init --provisioner=none [--cluster-name <your-specified-name>]
```

## Cluster Configuration

After editing the inventory file, edit the generated cluster.yaml file. The cluster.yaml file provides the configuration details for creating your Konvoy cluster.

See the [Install on-premise](/dkp/konvoy/1.4/install/install-onprem/) guide in the Konvoy documentation for more details.

## Provision in UI

![Add Cluster Options](/dkp/kommander/1.0/img/add-cluster.png)

From the **Add Cluster** menu, select the **Upload YAML to Create a Cluster** option and select the **On Premise Cloud Provider** from the **Select Cloud Provider** field.

Paste the contents of the cluster.yaml and inventory.yaml files into the form and select **Continue** to begin provisioning Konvoy onto your hosts.
