---
layout: layout.pug
navigationTitle: Cloud Providers
title: Cloud Providers
menuWeight: 1
excerpt: Managing cloud providers used by Kommander
---

Cloud providers like AWS, Azure and Google provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys to your preferred cloud provider. You may have many accounts for a single cloud provider.

In order to provision new clusters and manage them, Kommander needs cloud provider credentials. Currently AWS, Azure, and On Premise are supported.

### Viewing and Modifying Cloud Providers

Cloud Provider credentials are configured within each workspace, so you must first select a workspace. Then, navigate to the Cloud Providers option under Administration.

![Cloud Provider Form](/ksphere/kommander/img/add-cloud-provider.png)

Cloud Provider Form

- [Configure AWS with Role Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider-roles) (Recommended)
- [Configure AWS with Static Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider-static-credentials)
- [Configure Azure Credentials](/ksphere/kommander/latest/operations/configure-aws-cloud-provider)
- [Configure On-Premise Credentials](/ksphere/kommander/latest/operations/configure-on-prem-provider)

### Deleting a cloud provider

Before attempting to delete a cloud provider, Kommander first verifies if any existing managed clusters were created using this provider. The cloud provider cannot be deleted until all clusters, created with the cloud provider, have been deleted. This ensures Kommander has access to your cloud provider to remove all resources created for a managed cluster.
