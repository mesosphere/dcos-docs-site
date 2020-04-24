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

#### Addon Changelog

- added podAnnotations to the kommander-ui chart
- updated ingress values for kubeaddons-catalog

#### Chart Changelog

_Used chart version: `0.5.7` -> `0.6.4`_

- create kubecost ns hook
- dynamically get grafana service url, add readme file
- hook should not call static service name

##### Chart Subcomponent Versions

- KCL: [0.5.1 -> 0.5.2](https://github.com/mesosphere/kommander-cluster-lifecycle/compare/v0.5.1...v0.5.2)
- UI: [3.16.5 -> 3.25.5](https://github.com/mesosphere/kommander/compare/v3.16.5...v3.25.5)
- kommander-karma: 0.3.9
- kubeaddons-catalog: 0.1.6
- kommander-thanos: 0.1.13
- grafana: 4.5.1

### Version v1.1.0-beta.0 - April 8 March 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Changelog

Used chart version: `0.4.26` -> `0.5.7`

- federate karma-proxy only to Konvoy clusters
- simplify kommander's grafana dashboard job

##### Chart Subcomponent Versions

- KCL: [0.4.11 -> 0.5.1](https://github.com/mesosphere/kommander-cluster-lifecycle/compare/v0.4.11...v0.5.1)
- UI: [2.39.6 -> 3.16.5](https://github.com/mesosphere/kommander/compare/v2.39.6...v3.16.5)
- kommander-karma: 0.3.8 -> 0.3.9
- kubeaddons-catalog: 0.1.6
- kommander-thanos: 0.1.13
- grafana: 4.5.1
