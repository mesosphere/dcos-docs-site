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

<p class="message--note"><strong>NOTE: </strong>Infrastructure provider credentials are configured in each workspace.</p>

### View and Modify Infrastructure Providers

1.  From the top menu bar, select your target workspace.

1.  Select **Infrastructure Providers** in the **Administration** section of the sidebar menu.

#### AWS

- [Configure AWS Provider with Role Credentials](configure-aws-infrastructure-provider-roles) (Recommended if using AWS)
- [Configure AWS Provider with Static Credentials](configure-aws-infrastructure-provider-static-credentials)

### Delete an infrastructure provider

Before deleting an infrastructure provider, Kommander verifies if any existing managed clusters were created using this provider. The infrastructure provider cannot be deleted until all clusters, created with the infrastructure provider, have been deleted. This ensures Kommander has access to your infrastructure provider to remove all resources created for a managed cluster.
