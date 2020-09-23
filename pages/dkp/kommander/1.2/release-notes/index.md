---
layout: layout.pug
beta: true
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander
enterprise: false
---

<!-- markdownlint-disable MD034 -->

# Release Notes for Kommander 1.2

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

**NOTE:** You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

<!-- TBD when 1.2 goes GA:
# Release Summary

Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated and cost management, across multiple clusters, whether they are a new Konvoy cluster or existing 3rd party/DIY distribution.
-->

# Supported Versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.15.0  |
| **Maximum**        | 1.17.x  |
| **Default**        | 1.17.3  |

# Kommander 1.2.0 Beta 1 (September 14th, 2020)

## Features/Improvements

- Improved catalog handling
- Improved Access Control for editing/deleting actions

## Bug Fixes

- Fixed an issue where logout wasn't deleting any cookies
- Smaller UX Bugs and Improvements

## Component Versions

- Addon: `1.2.0-9`
- Chart: `0.11.3`
- auto-provisioning (yakcl): `0.4.5`
- kommaner-federation (yakcl): `0.4.5`
- kommander-licensing (yakcl): `0.4.5`
- UI: `6.22.0`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.12`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.12`
- grafana: `4.6.3`

# Kommander 1.2.0 Beta 0 (August 27th, 2020)

## Features/Improvements

- Changed routing from hash-based to history-based to allow redirects after login.

## Bug Fixes

- Smaller UX Bugs and Improvements

## Component Versions

- Addon: `1.2.0-5`
- Chart: `0.10.3`
- auto-provisioning (yakcl): `0.4.2`
- kommaner-federation (yakcl): `0.4.2`
- kommander-licensing (yakcl): `0.4.2`
- UI: `6.22.0`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.12`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.12`
- grafana: `4.6.3`