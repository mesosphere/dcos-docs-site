---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.2.1
title: Release Notes Kommander 1.2.1
menuWeight: 20
excerpt: View release-specific information for Kommander 1.2.1
enterprise: false
---

**D2iQ&reg; Kommander&reg; version 1.2.1 was released on March 11, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.6/download/) and [install](/dkp/konvoy/1.6/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# New features

- Replace license table with single license detail view.

# Bug fixes

- Ensure pre-delete hook jobs are cleaned up.
- Ensure kubectl deletes do not fail if resource already deleted.
- Bump kubecost to fix an issue that occasionally caused pods to fail to deploy
- Fix bug in Kommander UI where LDAP Root CA is malformed when saved. (COPS-6884)

## Component versions

- Addon: 1.2.1-2
- Chart: 0.12.19
- kommander-federation (yakcl): 0.6.10
- kommander-licensing (yakcl): 0.6.10
- UI: 6.55.2
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.5.4
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.71.1
