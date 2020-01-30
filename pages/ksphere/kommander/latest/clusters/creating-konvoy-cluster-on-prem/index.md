---
layout: layout.pug
navigationTitle: Creating Konvoy Clusters on Premises
title: Creating Konvoy Clusters on Premises
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on your own premises' infrastructure
---

## Prerequisites

Configured [On-Prem Provider](/ksphere/kommander/latest/operations/cloud-providers/#configuring-an-on-premise-provider)

To start the Konvoy installation, you first need an Ansible inventory file in your current working directory to describe the hosts where you want to install Konvoy. Konvoy will automatically generate the skeleton of the inventory file for you during initialization:
