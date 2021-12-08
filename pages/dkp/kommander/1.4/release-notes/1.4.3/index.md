---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.3
title: Release Notes Kommander 1.4.3
menuWeight: 40
excerpt: View release-specific information for Kommander 1.4.3
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.3 was released on December 9, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.8/download/) and [install](/dkp/konvoy/1.8/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

## Features/Improvements

- Updated Kubecost enterprise key

### Bug fixes

- Fixed an issue where Kommander UI runs out of ports. This monitors ports and forces a restart if it runs out. 

- Fixed http proxing support in unidirectional environments (COPS-7078).

- Updated Traefik Forward Auth to 3.0.3, pulling in a fix for URL pattern matching.

- Resolved UI issue where socks requests were timing out.

### Component Versions

- Addon: 1.4.3-2
- Chart: 0.38.4
- kommander-federation (yakcl): 0.20.2
- kommander-licensing (yakcl): 0.20.2
- UI: 6.100.0
- kommander-karma: 0.3.19
- kubeaddons-catalog: 0.1.16
- kommander-thanos: 0.1.22
- kubecost: 0.13.0
- kubefed: 0.7.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.17.1
- cost-analyzer: 1.81.0
