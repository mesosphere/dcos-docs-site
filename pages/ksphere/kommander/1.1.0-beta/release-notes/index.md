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

<!--
Template:

### Version <VERSION> - <DATE>

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- <FEATURES/IMPROVEMENTS>

#### Bug Fixes

- <FIXES>
- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: ``
- Chart: ``
- KCL: ``
- UI: ``
- kommander-karma: ``
- kubeaddons-catalog: ``
- kommander-thanos: ``
- grafana: ``

-->

### Version v1.1.0-rc.1 - May 29th 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.15.0  |
| **Maximum**        | 1.17.x  |
| **Default**        | 1.17.3  |

#### Features/Improvements

- Added Access Control functionalities to the UI
- Added Kubekost integration to the UI
- Removed namespace suffix from projects and platform service names
- UI now trims input values to remove leading, trailing, and duplicate spaces
- Kommander now federates Prometheus operator, prometheus alert manager, and karma to managed non-konvoy clusters.
- Improved AWS tags to include cluster name.
- Removed old, unsupported versions from version selector in create cluster form.

#### Bug Fixes

- Fixed project links on projects overview page
- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: `1.1.0-25`
- Chart: `0.8.6`
- YaKCL: `0.0.4` (replaced KCL)
- UI: `3.90.0`
- kommander-karma: `0.3.9`
- kubeaddons-catalog: `0.1.6`
- kommander-thanos: `0.1.14`
- grafana: `4.5.1`

### Version v1.1.0-beta.3 - May 14th 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- Added possibility to set metadata for Workspaces
- Added a way to deploy generic KUDO services
- Added quota support for projects
- Kommander now federates logging stack to managed non-konvoy clusters

#### Bug Fixes

- Fixed kubeconfig download for certain clusters/users
- Fixed uninstall from Kommander addon
- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: `1.1.0-15`
- Chart: `0.6.20`
- KCL: `0.5.7`
- UI: `3.58.0`
- kommander-karma: `0.3.9`
- kubeaddons-catalog: `0.1.6`
- kommander-thanos: `0.1.14`
- grafana: `4.5.1`

### Version v1.1.0-beta.2 - April 22nd 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- Improved display of resource allocations in the UI
- Federate Kubekost to managed Non-Konvoy clusters

#### Bug Fixes

- Lots of smaller UX Bugs and Improvements

#### Component Versions

- Addon: `1.1.0-10`
- Chart: `0.6.12`
- KCL: `0.5.6`
- UI: `3.31.2`
- kommander-karma: `0.3.9`
- kubeaddons-catalog: `0.1.6`
- kommander-thanos: `0.1.13`
- grafana: `4.5.1`

### Version v1.1.0-beta.1 - April 22nd 2020

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

### Version v1.1.0-beta.0 - April 8th 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Features/Improvements

- Added Support for Kommander to attach the cluster it is running on as managed Cluster
- Added ability to access the managed cluster's Kubernetes API with a valid management cluster token
- Enabled License validation
- Simplifed kommander's grafana dashboard job
- Added loading indicators for cluster creation form
- Added Cluster ID to UI for easier identification in other dashboards
- Displaying users Username in the UI
- Added Cluster Overview Tab to Cluster Details Page in UI
- Added a way to add clusters to projects based on labels
- Added support for nonResourceUrls in Roles in the UI
- Hid Kubeconfig download link for clusters where that config might not be available
- Improved Cluster Status Visualisation in the UI

#### Bug Fixes

- Allow deleting clusters retry after failing. For example when there are permission issues.
- Federate karma-proxy only to Konvoy clusters
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
