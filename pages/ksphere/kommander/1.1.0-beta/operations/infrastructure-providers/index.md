---
layout: layout.pug
navigationTitle: Infrastructure Providers
title: Infrastructure Providers
menuWeight: 1
excerpt: Managing infrastructure providers used by Kommander
---

Cloud providers like AWS, Azure, and Google provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys for your preferred cloud provider. You may have many accounts for a single cloud provider.

To provision new clusters and manage them, Kommander needs cloud provider credentials. Currently AWS, Azure, and On Premise are supported.

### Viewing and Modifying Infrastructure Providers

Cloud Provider credentials are configured within each workspace, so you must first select a workspace. Then, navigate to the Cloud Providers option under Administration.

![Empty Infrastructure Providers Page](/ksphere/kommander/1.1.0-beta/img/empty-infrastructure-providers.png)
<br />_Empty Infrastructure Providers Page_

![Infrastructure Provider Form](/ksphere/kommander/1.1.0-beta/img/add-infrastructure-provider.png)
<br />_Infrastructure Provider Form_

#### Configuring an AWS Infrastructure Provider

- [Configure AWS Provider with Role Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-aws-cloud-provider-roles) (Recommended)
- [Configure AWS Provider with Static Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-aws-cloud-provider-static-credentials)

#### Configuring an Azure Infrastructure Provider

- [Configure Azure Provider with Static Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-azure-cloud-provider)

#### Configuring an On-Premise Infrastructure Provider

- [Configure On-Premise Provider](/ksphere/kommander/latest/operations/infrastructure-providers/configure-on-prem-provider)

### Deleting an infrastructure provider

Before attempting to delete an infrastructure provider, Kommander first verifies if any existing managed clusters were created using this provider. The infrastructure provider cannot be deleted until all clusters, created with the infrastructure provider, have been deleted. This ensures Kommander has access to your cloud provider to remove all resources created for a managed cluster.
