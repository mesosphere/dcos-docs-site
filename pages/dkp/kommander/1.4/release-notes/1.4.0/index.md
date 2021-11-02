---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.4.0
title: Release Notes Kommander 1.4.0
menuWeight: 10
excerpt: View release-specific information for Kommander 1.4.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->

**D2iQ&reg; Kommander&reg; version 1.4.0 was released on May 5, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.8/download/) and [install](/dkp/konvoy/1.8/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public IaaS, on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Kommander unlocks federated cost management across multiple clusters, whether in a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Known issues

In Kommander 1.3.2 and earlier versions, the Kubecost cost analyzer requests a PVC of size 0.2Gi by default, which can cause issues with provisioners requiring a minimum storage size of 1Gi. Upgrade to version 1.4.1 to resolve this issue. Refer [here](https://github.com/kubecost/docs/blob/master/storage.md) for more information. 

## New features

## Workspace Permissions Updates

In previous Kommander versions, Workspace roles were not automatically propagated to Project roles. A user with edit permissions for the Workspace did not automatically receive edit permissions to a Project inside the Workspace. Beginning with Kommander version 1.4, roles are propagated from Workspace to Project, and a user with edit permissions on the Workspace automatically had edit permissions on the Project.

<p class=“message--important”><strong>IMPORTANT: </strong>This change propagates to all Projects, including existing Projects.</p>

Refer to the instructions in [Access Control][access_control] to disable this propagation.

## Network Tunneling

Prior to release 1.4, Kommander required bi-directional connectivity between the Kommander management cluster and clusters that are under management. This effectively blocked several use cases, for example:

- Kommander did not have direct access to the managed cluster, for example, when the cluster was on a laptop or behind a NAT gateway.

- The managed cluster did not have direct access to Kommander when Kommander was on-premise and the managed cluster was in a public cloud provider environment.

- The managed cluster was behind a firewall, a proxy, or resident in a DMZ.

A new component, kubetunnel, provides communication between Kommander and the managed cluster through a tunneling protocol resolving these blocked use cases. The TLS-encrypted tunnel enables you to access the cluster using SSO and to receive alerts, metrics, and kubecost data.

For more information on this capability, see [Attach an Existing Kubernetes Cluster](../../clusters/attach-cluster)

## Catalog Workload Certification

D2iQ now certifies workloads for use with Kommander. All workloads that are tested and certified for successful configuration and provisioning on Konvoy are flagged in Kommander with a certification icon. For more information, see [Project Platform Services](../../projects/platform-services/).

## Helm charts
The Projects tab now shows all of the current Helm Release charts, their chart version, and the names of the clusters. For more information, see [Project Deployments](../../projects/project-deployments/).

# Breaking changes

## Docker hub rate limiting
Docker Hub announced an update to image pull policies in August, 2020. This results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence if your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../../operations/manage-docker-hub-rate-limits).

## Component versions
- Addon: 1.4.0-22
- Chart: 0.31.1
- kommander-federation (yakcl): 0.16.1
- kommander-licensing (yakcl): 0.16.1
- UI: 6.98.0
- kommander-karma: 0.3.19
- kubeaddons-catalog: 0.1.16
- kommander-thanos: 0.1.22
- kubecost: 0.9.1
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.17.1
- cost-analyzer: 1.77.1

## Fixes and Improvements 

- UI: Show status of Helm Releases in Project CD.
- Do not deploy the mtls-proxy load balancers if the connection-type is of type unidirectional.
- Add kubetunnel integration.
- UI: Add support for Catalog platform service badges to identify certified, air-gapped and D2iQ supported platform services
- Upgrade federated Prometheus to v12.11.10, which includes a change to use the kube-prometheus-stack upstream chart following the deprecation of helm/charts.
- Duplicate namespaces no longer created per workspace.
- UI: Update to handle new KUDO param types.
- Decrease the amount of time it takes to delete Kommander.
- Update the karma subchart to remove a liveness probe that could cause the karma container to be restarted unnecessarily, preventing its API from becoming available.
- UI: Allow gitops source update.
- UI: Federated addon info is now displayed properly in UI cards.
- Bump federated Kubeaddons to v0.26.1 to fix a bug causing unnecessary addon deployment delays.
- UI: Handle license loading state, show loading instead of invalid when license is missing a status. (COPS-6912)
- UI: Resolve kubecost performance issue.

[access_control]: /dkp/kommander/1.4/operations/access-control/
[attach_existing_kubernetes_cluster]: /dkp/kommander/1.4/clusters/attach-cluster
