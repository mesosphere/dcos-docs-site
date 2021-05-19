---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.3.2
title: Release Notes Kommander 1.3.2
menuWeight: 30
excerpt: View release-specific information for Kommander 1.3.2
enterprise: false
---

**D2iQ&reg; Kommander&reg; version 1.3.2 was released on 8, April 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Known issues

Kubecost cost-analyzer by default requests a PVC of size 0.2Gi. This may cause issues with certain provisioners that require a minimum storage size of 1Gi. To resolve this issue, upgrade to 1.3.3 following the [upgrade instructions in the 1.3.3 release notes](../1.3.3/).

# Bug fixes

- Updated UI to handle new KUDO param types.
- Duplicate namespaces are no longer created for a single workspace.

## Component versions

- Addon: 1.3.2-3
- Chart: 0.15.8
- kommander-federation (yakcl): 0.8.10
- kommander-licensing (yakcl): 0.8.10
- UI: 6.91.3
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.8.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.76.0

