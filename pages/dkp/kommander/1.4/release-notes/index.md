---
layout: layout.pug
beta: true
navigationTitle: Release Notes Kommander 1.4.0 Beta 1
title: Release Notes Kommander 1.4.0
menuWeight: 0
excerpt: View release-specific information for Kommander 1.4.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.0 Beta 1 was released on March 11, 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Supported Versions
| Kubernetes Support | Version |
| ------------------ | ------- |
|Minimum | 1.18.0 |
|Maximum | 1.20.x |
|Default | 1.20.2 |

# Breaking changes

## Docker hub rate limiting 
Docker Hub announced an update to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../operations/manage-docker-hub-rate-limits).

## Component versions
- Addon: 1.4.0-1
- Chart: 0.16.1
- kommander-federation (yakcl): 0.10.0
- kommander-licensing (yakcl): 0.10.0
- UI: 6.91.0
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.7.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.71.1

## Fixed and Improved Issues
- Bump federated prometheus to 9.3.7
- Bump kubecost to 0.7.0 which enables PodSecurityPolicy
- Decrease the amount of time it takes to delete Kommander
