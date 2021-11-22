---
layout: layout.pug
beta: false
navigationTitle: Infrastructure Providers
title: Infrastructure Providers
menuWeight: 30
excerpt: Managing infrastructure providers used by Kommander
---

Infrastructure providers, like AWS, provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys for your preferred infrastructure provider. You may have many accounts for a single infrastructure provider.

In order to provision new clusters and manage them, Kommander needs infrastructure provider credentials. Currently, AWS is supported.

### View and Modify Infrastructure Providers

Infrastructure provider credentials are configured in each workspace, so you must first select a workspace. Then, navigate to the infrastructure providers option under Administration.

#### AWS

- [Configure AWS Provider with Role Credentials](configure-aws-infrastructure-provider-roles) (Recommended if using AWS)
- [Configure AWS Provider with Static Credentials](configure-aws-infrastructure-provider-static-credentials)

### Delete an infrastructure provider

Before deleting an infrastructure provider, Kommander verifies if any existing managed clusters were created using this provider. The infrastructure provider cannot be deleted until all clusters, created with the infrastructure provider, have been deleted. This ensures Kommander has access to your infrastructure provider to remove all resources created for a managed cluster.
