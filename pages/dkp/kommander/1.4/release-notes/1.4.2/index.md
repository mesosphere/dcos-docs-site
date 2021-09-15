---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.2
title: Release Notes Kommander 1.4.2
menuWeight: 20
excerpt: View release-specific information for Kommander 1.4.2
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.2 was released on September 23, 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

## Features/Improvements

### Bug fixes

- Fixed an issue where addon links were disabled when the `konvoyconfig-kubeaddons` `ConfigMap` did not exist. Resolves (COPS-6997).

- Because it could not be determined if Grafana was deployed in Federated Clusters, the federated Grafana dashboard ConfigMap was removed. (COPS-6999)

- The `prometheus-adapter` no longer tries to install `v1beta1.metrics.k8s.io` on clusters with metrics service, like GKE. (COPS-6982)

- Fixed the issue where clusters were not attaching successfully and were getting stuck in **Loading Data** phase. (COPS-6978)

### Component Versions

- Addon: 1.4.2-2
- Chart: 0.37.0
- kommander-federation (yakcl): 0.19.0
- kommander-licensing (yakcl): 0.19.0
- UI: 6.99.5
- kommander-karma: 0.3.19
- kubeaddons-catalog: 0.1.16
- kommander-thanos: 0.1.22
- kubecost: 0.13.0
- kubefed: 0.7.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.17.1
- cost-analyzer: 1.81.0

