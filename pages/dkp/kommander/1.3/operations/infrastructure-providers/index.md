---
layout: layout.pug
beta: false
navigationTitle: Infrastructure Providers
title: Infrastructure Providers
menuWeight: 1
excerpt: Managing infrastructure providers used by Kommander
---

Infrastructure providers like AWS, Azure, and Google provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys for your preferred infrastructure provider. You may have many accounts for a single infrastructure provider.

In order, to provision new clusters and manage them, Kommander needs infrastructure provider credentials. Currently AWS, Azure, and On Premise are supported.

### View and Modify Infrastructure Providers

Infrastructure Provider credentials are configured in each workspace, so you must first select a workspace. Then, navigate to the infrastructure Providers option under Administration.

![Empty Infrastructure Providers Page](/dkp/kommander/1.3/img/empty-infrastructure-providers.png)
<br />Adding an Infrastructure Provider

![Infrastructure Provider Form](/dkp/kommander/1.3/img/add-infrastructure-provider.png)
<br />_Infrastructure Provider Form_

#### AWS

- [Configure AWS Provider with Role Credentials](/dkp/kommander/1.3/operations/infrastructure-providers/configure-aws-infrastructure-provider-roles) (Recommended)
- [Configure AWS Provider with Static Credentials](/dkp/kommander/1.3/operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials)

#### Azure

- [Configure Azure Provider with Static Credentials](/dkp/kommander/1.3/operations/infrastructure-providers/configure-azure-infrastructure-provider)

#### On-Premise

- [Configure On-Premise Provider](/dkp/kommander/1.3/operations/infrastructure-providers/configure-on-prem-provider)

### Delete an infrastructure provider

Before deleting an infrastructure provider, Kommander verifies if any existing managed clusters were created using this provider. The infrastructure provider cannot be deleted until all clusters, created with the infrastructure provider, have been deleted. This ensures Kommander has access to your infrastructure provider to remove all resources created for a managed cluster.
