---
layout: layout.pug
navigationTitle: Cloud Providers
title: Cloud Providers
excerpt: Managing cloud providers used by Kommander
---

Cloud providers like AWS, Azure and Google can provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys to your preferred cloud provider. It is possible to have many accounts for a single cloud provider.

In order to provision new clusters and manage them, Kommander needs cloud provider credentials. Currently AWS, Azure, and On Premise are supported.

### Viewing and Modifying Cloud Providers

Cloud Provider credentials are configured within each workspace, so you must first select a workspace. Then, navigate to the Cloud Providers option under Administration.

![Cloud Provider Form](/ksphere/kommander/img/add-cloud-provider.png)

Figure 1 - Cloud Provider Form

- [Configure AWS with Role Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider-roles)
- [Configure AWS with Static Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider-static-credentials)
- [Configure Azure Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider)
- [Configure On-Premise Credentials](/ksphere/kommander/latest/operations/configure-on-prem-provider)

### Deleting a cloud provider

When attempting to delete a cloud provider Kommander first verifies if any existing managed clusters were created using the provider. The cloud provider cannot be deleted until all clusters created with the cloud provider have been deleted. This is to ensure Kommander has access to your cloud provider to remove all resources created for a managed cluster.
