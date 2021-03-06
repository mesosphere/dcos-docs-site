---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander
enterprise: false
---

<!-- markdownlint-disable MD034 -->

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary

Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated and cost management, across multiple clusters, whether they are a new Konvoy cluster or existing 3rd party/DIY distribution.

## Improvements in Kommander 1.1.4

**D2iQ&reg; Kommander&reg; version 1.1.4 was released on 25, March 2021.**

# New features

# Bug fixes

- Ensure pre-delete hook jobs are cleaned up. (COPS-6821)
- Ensure kubectl deletes do not fail if resource already deleted.

## Component versions

- Addon: 1.1.4-2
- Chart: 0.8.47
- kommander-federation (yakcl): 0.3.5
- kommander-licensing (yakcl): 0.3.5
- UI: 3.126.1
- kommander-karma: 0.3.10
- kubeaddons-catalog: 0.1.11
- kommander-thanos: 0.1.15
- kubecost: 0.1.16
- grafana: 4.6.3
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.65.0

## Improvements in Kommander 1.1.3

**D2iQ&reg; Kommander&reg; version 1.1.3 was released on 3, November 2020.**

# New features

# Bug fixes

- Use replacement chart repository for helm stable charts

## Component versions

- Addon: 1.1.3-3
- Chart: 0.8.46
- auto-provisioning (yakcl): 0.3.5
- kommaner-federation (yakcl): 0.3.5
- kommander-licensing (yakcl): 0.3.5
- UI: 3.126.1
- kommander-karma: 0.3.10
- kubeaddons-catalog: 0.1.11
- kommander-thanos: 0.1.15
- kubecost: 0.1.12
- grafana: 4.6.3

## Improvements in Kommander 1.1.2

Kommander 1.1.2 was released on 25, August 2020, here are the improvements you can expect when upgrading to Kommander 1.1.1:

- Update YAKCL to v0.3.3

### Component Versions

- Addon: `1.1.2-1`
- Chart: `0.8.44`
- auto-provisioning (yakcl): `0.3.3`
- kommaner-federation (yakcl): `0.3.3`
- kommander-licensing (yakcl): `0.3.3`
- UI: `3.126.1`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.11`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.12`
- grafana: `4.6.3`

## Improvements in Kommander 1.1.1

Kommander 1.1.1 was released on 13, August 2020, here are the improvements you can expect when upgrading to Kommander 1.1.1:

- Aggregated cost monitoring data in Kommander is now available 5 minutes after clusters are attached

### Component Versions

- Addon: `1.1.1-1`
- Chart: `0.8.4.3`
- auto-provisioning (yakcl): `0.1.7`
- kommaner-federation (yakcl): `0.1.7`
- kommander-licensing (yakcl): `0.1.7`
- UI: `3.126.1`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.11`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.12`
- grafana: `4.6.3`

## New Features and Capabilities in Kommander 1.1.0

Kommander 1.1.0 was released on 16, July 2020.

### Centralized Cost Monitoring

Kubecost, running on Kommander, provides centralized cost monitoring for all managed clusters. This feature, installed by default in every Kommander cluster, provides a centralized view of Kubernetes resources used on all managed clusters. For more information go to [Centralized Cost Monitoring](/dkp/kommander/1.1/centralized-cost-monitoring/)

### Automatic Federation of AuthN/Z and Monitoring Stack

When attaching non-Konvoy clusters, such as Amazon EKS, Azure AKS, Google GKE, and On-Premises Kubernetes clusters, Kommander will federate a subset of standard Konvoy Addons and charts to enable SSO, AuthN/Z, observability, and cost monitoring.

### Improved RBAC

Kommander has enhanced Access Controls for users at the global, workspace, and project levels allowing greater flexibility and security when assigning roles. See [Granting Access to Kubernetes Resources in Kommander](/dkp/kommander/1.1/tutorials/configure-rbac/)

### Other Improvements

Beyond new features, here are the improvements you can expect when upgrading to Kommander 1.1:

- Added guidance on what to do when cluster deletion fails
- Added flag (`--skip-credentials-display`) to Kommander so Konvoy does not display login information in logs
- Added ability to disable federation of monitoring stack
- Added autogenerated labels to advanced cluster create form
- Added Support for Kommander to attach the cluster it is running on as managed Cluster
- Added ability to access the managed cluster's Kubernetes API with a valid management cluster token
- Added possibility to set metadata for Workspaces
- Added a way to deploy generic KUDO services
- Added quota support for projects
- Added Cluster Overview tab to Cluster Details page in UI
- Added a way to add clusters to projects based on labels
- Added support for nonResourceUrls in Roles in the UI
- Added loading indicators for cluster creation form
- Added Cluster ID to UI for easier identification in other dashboards
- Allowed default federated addon values to be overriden
- Attaching clusters to Kommander is now considered GA
- Display users Username in the UI
- Enabled License validation
- Generated labels are now hidden in cluster overview pages
- Hid Kubeconfig download link for clusters where that config might not be available
- Improved Grafana dashboard names for addons
- Improved auth token transport for managed clusters
- Improved context handling for multiple contexts when attaching cluster
- Improved display of resource allocations in the UI
- Improved attach Cluster Flow in UI
- Improved K8s Version Selector and Support for managed clusters created through the UI
- Improved AWS tags to include cluster name.
- Improved Error messaging when trying to delete roles or groups that are used by policies
- Improved performance for querying available versions in cluster create form
- Improved Cluster Status Visualisation in the UI
- Removed suffixes from federated ConfigMaps and Secrets
- Removed namespace suffix from projects and platform service names
- Removed old, unsupported versions from version selector in create cluster form
- Renamed "Cloud Provider" to "Infrastructure Provider" to better fit on premise
- Simplifed kommander's grafana dashboard job
- UI now trims input values to remove leading, trailing, and duplicate spaces
- Updated catalog API for v1beta2 addons

### Fixed Issues

- Allow deleting clusters retry after failing. For example when there are permission issues.
- Disabled "View Logs" Link in UI for managed clusters not running Kibana
- Federate karma-proxy only to Konvoy clusters
- Fixed missing Grafana home dashboard
- Fixed cluster deletion on detail page not working
- Fixed a bug where Kommander addon was not successfully deploying on Azure
- Fixed Kommander to not show unofficially supported versions of Kubernetes by default
- Fixed possible data collision bug related to clusters
- Fixed a possible crash-loop situation for kubeaddons when cert-manager is not ready yet
- Fixed and improved LDAP Identity provider handling
- Fixed display of "nothing to report" situations vs actual errors
- Fixed bugs related to access control
- Fixed naming of roles in projects
- Fixed an issue where projects were not created due to a bug in project name suffix handling
- Fixed version selector when creating clusters through the UI
- Fixed listing of workspaces and projects for limited users
- Fixed `skipMetadataApiCheck` being removed from `cluster.yaml`
- Fixed project links on projects overview page
- Fixed kubeconfig download for certain clusters/users
- Fixed uninstall from Kommander addon
- Fixed number value saving in cluster creation form
- Fixed federating Kommander internal addons to managed clusters
- Fixed UI leaking sensitive data in some error messages
- Fixed UI not showing some error messages
- Fixed UI not allowing user to change context when attaching cluster
- Prevent minor version upgrades for Kubernetes due to compatibility issues
- Kommander Grafana was unavailable after self-attaching host cluster as managed cluster
- UX Bugs and Improvements

### Known Issues

- Currently, you can upgrade any managed Konvoy cluster via Kommander. However, after doing so, you will not be able to delete the managed cluster from the Kommander UI nor can you upgrade the Kubernetes version greater than the version the managed cluster was originally deployed with.

### Component Versions

- Addon: `1.1.0-56`
- Chart: `0.8.41`
- auto-provisioning: `0.1.6`
- kommander-federation: `0.1.6`
- kommander-licensing: `0.1.6`
- UI: `3.126.1`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.11`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.10`
- grafana: `4.6.3`