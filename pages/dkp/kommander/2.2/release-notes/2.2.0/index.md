---
layout: layout.pug
navigationTitle: DKP 2.2 Release Notes
title: DKP 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for DKP 2.2
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on April 6, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

[Download](../download/) and [install](../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2! This release continues our tradition of customer-led development making DKP even easier to deploy, supporting more platforms and applications, and includes our AI/ML solution, Kaptain, added as a catalog application. In this release, we are beginning the process of combining our two flagship products, Konvoy and Kommander, into a single DKP product with two service level options: DKP Enterprise for multi-cluster environments, and DKP Essentials for single-cluster environments.

For this release, we are maintaining the legacy Konvoy and Kommander documentation sets, while publishing some combined DKP documentation for processes, such as Upgrading DKP version.

This version supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using Kommander 2.2 must be running a Kubernetes version in this range.

## New features and capabilities

These features and capabilities are new for Version 2.2

### Upgrade catalog application via CLI and UI

You can use either the CLI or the UI to [upgrade your catalog applications](../projects/applications/catalog-applications/#upgrade-catalog-applications).

<p class="message--note"><strong>NOTE:</strong> Catalog applications must be upgraded to the latest version BEFORE upgrading the Kubernetes version (or Konvoy version for managed Konvoy clusters) on attached clusters, due to the previous versions' incompatibility with Kubernetes 1.22.</p>

### Better integration with VMware vSphere

You can use CAPI vSphere Provider while provisioning a DKP cluster on vSphere, which allows you to manage bootstrapping of VMs on a DKP cluster. This gives you improved productivity and speed of deploying VMs on DKP in a VMWare environment, including FIPS builds and air-gapped deployments.

### Zero downtime upgrades for air-gapped deployments

Kubernetes Operators and other IT operations team members can use your laptop or USB drive to transfer pre-created bundles, including OS dependencies and DKP binaries into an air-gapped environment with no external connectivity. This improves the availability of the DKP air-gapped deployment and productivity of your IT operations team.

### Unified user interfaces

This provides a smooth experience independent of where you start your journey. A DKP Essential customer can simply update your license to access DKP Enterprise features without having to learn another interface.

### Kaptain AI/ML, D2iQ’s AI/ML offering

For better integrated with DKP 2.2 you can easily launch this feature as a catalog application, as well as support other platforms such as Amazon AWS, AKS, and Microsoft Azure EKS. This extends D2iQ’s openness to support Kubernetes platforms beyond DKP with Kaptain. Kaptain enables an organization to develop, deploy, and run entire ML workloads in production, at scale, with consistency and reliability.

### DKP Insights

This new predictive analytics tool provides greater support productivity, speed, and reduced costs. An Insights module integrated into DKP collects configuration, logs, events, and metrics from DKP deployments and generates predictive insights on potential issues of varying critical levels. This enables you to quickly identify and resolve issues that would save a lot of time and money by not escalating to D2IQ's support. You can filter the insight summary cards by one or many insight categories for a selected cluster and project.

## Component updates

The following services and service components have been upgraded to the listed version:

<This is from 2.1.1, so we need to review and update. Grace has a good idea for an more user-friendly table here, to account for all versions and which versions of DKP everything synchs with. Will be easier to maintain here in the RN than buried in the full doc sets.>

- centralized-grafana: 18.1.1
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.9.10
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.8
- grafana-logging: 6.16.14
- grafana-loki: 0.33.1
- istio: 1.9.1
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- knative: 0.18.3
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 18.1.1
- kubecost: 0.20.0
- kubefed: 0.9.0
- kubernetes-dashboard: 5.0.2
- kubetunnel: 0.0.8
- logging-operator: 3.15.0
- metallb: 0.12.2
- minio-operator: 4.1.7
- nfs-server-provisioner: 0.6.0
- nvidia: 0.4.3
- project-grafana-logging: 6.16.14
- project-grafana-loki: 0.33.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
- reloader: 0.0.99
- thanos: 0.4.5
- traefik: 10.3.0
- traefik-forward-auth: 0.3.2
- velero: 3.1.3

## Known issues

## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
