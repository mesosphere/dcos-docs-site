---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.3.1
title: Release Notes Kommander 1.3.1
menuWeight: 20
excerpt: View release-specific information for Kommander 1.3.1
enterprise: false
---

**D2iQ&reg; Kommander&reg; version 1.3.1 was released on March 11, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.7/download/) and [install](/dkp/konvoy/1.7/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Supported Versions
| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.17.0  |
| **Maximum**        | 1.19.x  |
| **Default**        | 1.18.10  |

# Known issues

In Kommander 1.3.2 and earlier versions, the Kubecost cost-analyzer requests a PVC of size 0.2Gi by default. This can cause issues with provisioners requiring a minimum storage size of 1Gi. To resolve this issue upgrade to Kommander version 1.3.3. Refer [here](https://github.com/kubecost/docs/blob/master/storage.md) for more information. 

# Breaking changes

In Kommander 1.3, all new projects were created with a default NetworkPolicy that only allowed traffic originating within your Projects namespace. This policy was also created in all existing projects that did not already have a NetworkPolicy when upgrading to Kommander 1.3.

The result of this default policy was that Pods could not talk to Pods outside of that namespace. In some cases this was not a desired default state. As of Kommander 1.3.1, no default NetworkPolicy is created in new (or existing projects) and thus no traffic blocking is done by default.

If you are upgrading from Kommander 1.3 and already made the necessary changes to address this issue (for example, by adding a NetworkPolicy with the desired traffic rules), then upgrading to Kommander 1.3.1 will not impact those existing policies.

# New features

- Add license delete mutation.
- Replace license table with single license detail view.
- Allow workspace namespace to be configurable.

# Bug fixes

- Ensure pre-delete hook jobs are cleaned up.
- Ensure kubectl deletes do not fail if resource already deleted.
- Fix empty non-Konvoy cluster Platform Services tab.
- Disable all platform services when Foundational Components are disabled in the UI.
- All federated platform services are now successfully removed when the kubeaddons controller is disabled.
- Kubecost: Ensure kubectl deletes do not fail if resource is already deleted.
- When self attaching a kommander cluster, the dex-k8s-authenticator configmap is no longer updated as this causes invalid links on the generate token page.
- Fixes bug in Kommander UI where LDAP Root CA is not correct when saved.
- Updates UI to only ship with needed dependencies.

## Component versions

- Addon: 1.3.1-5
- Chart: 0.15.3
- kommander-federation (yakcl): 0.8.8
- kommander-licensing (yakcl): 0.8.8
- UI: 6.91.1
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.5.4
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.71.1
