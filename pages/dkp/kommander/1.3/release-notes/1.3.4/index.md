---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.3.4
title: Release Notes Kommander 1.3.4
menuWeight: 50
excerpt: View release-specific information for Kommander 1.3.4
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.3.4 was released on September 23, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.7/download/) and [install](/dkp/konvoy/1.7/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

## Features/Improvements

### Bug fixes

- Because Grafana is not enabled on attached Clusters, the Grafana dashboard card was removed from the UI. (COPS-6999)

- Advance federated `traefik-forward-auth` to version 3.01 to address security issues.

### Component Versions

- Addon: 1.3.4-1
- Chart: 0.15.14
- kommander-federation (yakcl): 0.8.13
- kommander-licensing (yakcl): 0.8.13
- UI: 6.91.8
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.13.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.81.0
