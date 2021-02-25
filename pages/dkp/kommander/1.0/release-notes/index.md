---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander
---

<!-- markdownlint-disable MD034 -->

## Release Notes

### Version v1.0.1 May 14 2020

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.16.0  |
| **Maximum**        | 1.16.x  |
| **Default**        | 1.16.8  |

#### Fixed Bugs

- AWS VPC route tables not removed when deploying Konvoy cluster from Kommander.

#### Changes

- Add 1.16.8 to selectable Kubernetes versions.

#### Known issues

- If you've installed Kommander v1.0 on a Konvoy v1.4.3 cluster (or older), you will not be able to create managed clusters. We recommend you upgrade to Kommander v1.1.0 and use Konvoy v1.5.0 (or newer), to be able to create clusters. Note: Kommander v1.1 is not supported on any version of Konvoy 1.4.

#### Component Versions:

- Chart: 0.4.26 -> 0.4.30
- KCL: 0.4.11 -> 0.4.12
- UI: 2.39.6
- kubeaddons-catalog: 0.1.6
- kommander-thanos: 0.1.13
- kommander-karma: 0.3.8
- grafana: 4.5.1
