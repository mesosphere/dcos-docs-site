---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.0
title: Release Notes Kommander 1.4.0
menuWeight: 0
excerpt: View release-specific information for Kommander 1.4.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.0 was released on May 3, 2021.**

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

## New features

## Workspace Permissions Updates

In previous Kommander versions, Workspace roles were not automatically propagated to Project roles. A user with edit permissions for the Workspace did not automatically receive edit permissions to a Project inside the Workspace. Beginning with Kommander version 1.4, roles are propagated from Workspace to Project, and a user with edit permissions on the Workspace will also have edit permissions on the Project.

<p class=“message--important”><strong>IMPORTANT: </strong>This change will propagate to all Projects, including existing Projects.</p>

Refer to the instructions in [Access Control][access_control] to disable this propagation.

## Network Tunneling

Prior to release 1.4, Kommander required bi-directional connectivity between the Kommander management cluster and clusters that are under management. This effectively blocked several customer-specific use cases:

- Kommander does not have direct access to the managed cluster, for example, when the cluster is on a laptop or behind a NAT gateway.

- The managed cluster does not have direct access to Kommander, for example, Kommander is on-premise and the managed cluster is in a public cloud provider environment.

- The managed cluster is behind a firewall, a proxy, or resides in a DMZ.

A new component, `kubetunnel`, provides communication between Kommander and the managed cluster through a tunneling protocol resolving these blocked use cases. The TLS-encrypted tunnel enables you to access the cluster using SSO and to receive alerts, metrics, and kubecost data.

For more information on this capability, see [Attach an Existing Kubernetes Cluster][attach_existing_kubernetes_cluster]

## Helm charts
The Projects tab now shows all of the current Helm Release charts, their chart version, and the names of the clusters. 

## Cluster management
Kommander now supports attaching existing, external clusters that have additional networking restrictions in place such as a DMZ, a proxy server, or being behind a firewall. For more information see [Attach an Existing Kubernetes Cluster](https://docs.d2iq.com/dkp/kommander/1.4/clusters/attach-cluster/).

# Breaking changes

## Docker hub rate limiting 
Docker Hub announced an update to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../operations/manage-docker-hub-rate-limits).

## Component versions
- Addon: 1.4.0-6
- Chart: 0.19.0
- kommander-federation (yakcl): 0.10.0
- kommander-licensing (yakcl): 0.10.0
- UI: 6.91.1
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
