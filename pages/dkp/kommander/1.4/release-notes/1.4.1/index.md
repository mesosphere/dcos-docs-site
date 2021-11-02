---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.1
title: Release Notes Kommander 1.4.1
menuWeight: 20
excerpt: View release-specific information for Kommander 1.4.1
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.1 was released on June 9, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.8/download/) and [install](/dkp/konvoy/1.8/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Known issues

In Kommander version 1.3.2 and earlier, and Kommander version 1.4.0, the Kubecost cost analyzer requests a PVC of size 0.2Gi by default. This can cause issues with provisioners requiring a minimum storage size of 1Gi. This issue is fixed in Kommander version 1.3.3 and 1.4.1. Upgrading to these versions resolves this issue. Refer [here](https://github.com/kubecost/docs/blob/master/storage.md) for more information. 

# Breaking changes

## Docker hub rate limiting
Docker Hub announced an update to image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../../operations/manage-docker-hub-rate-limits).

#### Component Versions
- Addon: 1.4.1-4
- Chart: 0.35.1
- kommander-federation (yakcl): 0.18.0
- kommander-licensing (yakcl): 0.18.0
- UI: 6.99.2
- kommander-karma: 0.3.19
- kubeaddons-catalog: 0.1.16
- kommander-thanos: 0.1.22
- kubecost: 0.13.0
- kubefed: 0.7.0
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.17.1
- cost-analyzer: 1.81.1

## Fixes and Improvements 

- Update federated Kubecost to v0.13.0. This includes an upgrade of Prometheus to v2.24.0.
- Update federated kubeaddons to v0.27.0.
- Increase the default Kubecost cost-analyzer PVC storage size from 0.2Gi to 32Gi to resolve deployment issues that occurred with provisioners that require a minimum size of 1Gi. See [Known issues](#known-issues) above if upgrading from a previous version. (COPS-6937)
