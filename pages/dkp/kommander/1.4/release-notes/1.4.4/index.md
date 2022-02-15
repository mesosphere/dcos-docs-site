---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.4
title: Release Notes Kommander 1.4.4
menuWeight: 40
excerpt: View release-specific information for Kommander 1.4.4
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.4 was released on February 17th, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.8/download/) and [install](/dkp/konvoy/1.8/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.18.x  |
| **Maximum**  | 1.20.x  |
| **Default**  | 1.20.5  |

## Features/Improvements

- Size of air-gapped bundles have been reduced by updating federated addons and images to those used in Kubernetes Base Addons (KBA)

### Bug fixes

- Replace has been added as a concurrency policy to to the Grafana dashboard CronJob to prevent the unintended creation of an unbound number of pods.

### Component Versions

- Addon: 1.4.4-4
- Chart: 0.39.2
- kommander-federation (yakcl): 0.21.2
- kommander-licensing (yakcl): 0.21.2
- UI: 6.100.1
- kommander-karma: 0.3.19
- kubeaddons-catalog: 0.1.16
- kommander-thanos: 0.1.22
- kubecost: 0.13.0
- kubefed: 0.7.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.17.1
- cost-analyzer: 1.81.0
