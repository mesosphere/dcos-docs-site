---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Release Notes

### Version v1.1.0-beta.1 - April 22 March 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- Improved attach Cluster Flow in UI
- Improved K8s Version Selector and Support for managed clusters created via UI
- Limit platform service versions to versions that are supported by all clusters in that project
- Renamed "Cloud Provider" to "Infrastructure Provider" to better fit on premise
- Improved Error messaging when trying to delete roles or groups that are used by policies
- Kommanders generated labels are now hidden in cluster overview pages
- Federate Kubekost to managed Konvoy clusters
- Improved performance for querying available versions in cluster create form.

#### Bug Fixes

- Fixed number value saving in cluster creation form
- Fixed not federating Kommander internal addons to managed clusters anymore.
- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: `1.1.0-5`
- Chart: `0.6.4`
- KCL: `0.5.3`
- UI: `3.25.5`
- kommander-karma: `0.3.9`
- kubeaddons-catalog: `0.1.6`
- kommander-thanos: `0.1.13`
- grafana: `4.5.1`

### Version v1.1.0-beta.0 - April 8 March 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- Added Support for Kommander to attach the cluster it is running on as managed Cluster
- Added ability to access the managed cluster's Kubernetes API with a valid management cluster token
- Enabled License validation
- simplify kommander's grafana dashboard job
- Added loading indicators for cluster creation form
- Added Cluster ID to UI for easier identification in other dashboard
- Displaying users Username in the UI
- Added Cluster Overview Tab to Cluster Details Page in UI
- Added a way to add clusters to projects based on labels
- Added support for nonResourceUrls in Roles in the UI
- Hide Kubeconfig download link for clusters where that config might not be available
- Improved Cluster Status Visualisation in the UI

#### Bug Fixes

- Allow retrying deleting clusters after it failed for e.g. permission reasons
- federate karma-proxy only to Konvoy clusters
- Fixed UI not showing some error messages
- Fixed UI not allowing user to change context when attaching cluster
- Disabled "View Logs" Link in UI for managed cluster which dont run Kibana
- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: `1.1.0-3`
- Chart: `0.5.7`
- KCL: `0.5.1`
- UI: `3.16.5`
- kommander-karma: `0.3.9`
- kubeaddons-catalog: `0.1.6`
- kommander-thanos: `0.1.13`
- grafana: `4.5.1`
