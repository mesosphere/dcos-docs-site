---
layout: layout.pug
navigationTitle: Infrastructure Providers
title: Infrastructure Providers
menuWeight: 1
excerpt: Managing infrastructure providers used by Kommander
---

Infrastructure providers like AWS, Azure, and Google provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys for your preferred infrastructure provider. You may have many accounts for a single infrastructure provider.

To provision new clusters and manage them, Kommander needs infrastructure provider credentials. Currently AWS, Azure, and On Premise are supported.

### Viewing and Modifying Infrastructure Providers

Infrastructure Provider credentials are configured in each workspace, so you must first select a workspace. Then, navigate to the infrastructure Providers option under Administration.

![Empty Infrastructure Providers Page](/ksphere/kommander/1.1.0-beta/img/empty-infrastructure-providers.png)
<br />_Empty Infrastructure Providers Page_

![Infrastructure Provider Form](/ksphere/kommander/1.1.0-beta/img/add-infrastructure-provider.png)
<br />_Infrastructure Provider Form_

#### Configuring an AWS Infrastructure Provider

- [Configure AWS Provider with Role Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-aws-infrastructure-provider-roles) (Recommended)
- [Configure AWS Provider with Static Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials)

#### Configuring an Azure Infrastructure Provider

- [Configure Azure Provider with Static Credentials](/ksphere/kommander/latest/operations/infrastructure-providers/configure-azure-infrastructure-provider)

#### Configuring an On-Premise Infrastructure Provider

- [Configure On-Premise Provider](/ksphere/kommander/latest/operations/infrastructure-providers/configure-on-prem-provider)

### Deleting an infrastructure provider

Before deleting an infrastructure provider, Kommander verifies if any existing managed clusters were created using this provider. The infrastructure provider cannot be deleted until all clusters, created with the infrastructure provider, have been deleted. This ensures Kommander has access to your infrastructure provider to remove all resources created for a managed cluster.
