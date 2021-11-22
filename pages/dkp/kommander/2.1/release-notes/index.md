---
layout: layout.pug
navigationTitle: Kommander 2.1 Release Notes
title: Kommander 2.1 Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander 2.1
enterprise: false
beta: false
---

<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD030 -->

**D2iQ&reg; Kommander&reg; version 2.1 was released on November 19, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

To get started with Kommander, [download](../download/) and [install](../install/) the latest version of Kommander.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

## Known issues

When you create a new Konvoy 2.1 cluster with Kommander 2.1 installed, if you want to install applications to the Kommander Host Management Cluster through the UI, you will need to select Deploy on the Foundational Applications section.

To do this, in the Kommander UI, click on the Global Workspace nav at the top of the page, and select **Management Cluster Workspace**.

Then select **Applications** in the left sidebar.

Scroll down to the **Foundational** section, and select the "Deploy" button.

After this, you can deploy different applications through the UI.

### New features and capabilities

#### DKP Major Version Upgrade

Konvoy and Kommander 2.1 represent a major version upgrade that moves forward DKP architecture to give you access to D2iQ's next generation centralized Kubernetes and smart cloud native applications. It incorporates ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable. 2.1 enhances your existing clusters to use a new architecture.

For more information on planning your upgrade, see the [DKP Major Version upgrade](https://docs.d2iq.com/dkp/konvoy/2.1/major-version-upgrade/) guide.

#### Provision Kubernetes Infrastructure from Kommander

Kommander 2.1 now allows for provisioning and managing of Kubernetes clusters making it easier than ever to get your infrastructure up and running quickly.

For more information on provisioning from Kommander, see [Managing Clusters](../clusters/).

#### Kommander Continuous Deployment

Kommander 2.1 now supports continuous delivery/deployment using Flux, which is designed for Kubernetes and supports multi-cluster and multi-tenant use cases. Configure Kommander Projects with GitOps-based Continuous Deployments using FluxCD, which enables canary and A/B deployments, as well as roll-back. Kommander now uses a completely declarative approach, where what you define for production is what you get, without the need to monitor and manually intervene when something goes wrong.

For more information on setting up continuous deployment using Flux, see [Continuous Deploymnet](../projects/project-deployments/continuous-delivery).

#### DKP Licensing through Amazon Marketplace

You can now purchase a license for Konvoy or Kommander through the AWS Marketplace, then add it to Kommander. In the Kommander UI, you can see information such as the license status (valid or expired), the license capacity (number of cores or clusters), and expiration date.

### Component updates

The following services and service components have been upgraded to the listed version:

- centralized-grafana: 17.2.1
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.20.5
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.8
- grafana-logging: 6.13.9
- grafana-loki: 0.33.1
- istio: 1.9.1
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 17.2.1
- kubecost: 0.20.0
- kubefed: 0.8.1
- kubernetes-dashboard: 5.0.2
- kubetunnel: 0.0.7
- logging-operator: 3.13.0
- metallb: 0.12.2
- minio-operator: 4.1.7
- nvidia: 0.4.3
- project-grafana-logging: 6.13.9
- project-grafana-loki: 0.33.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
- reloader: 0.0.99
- thanos: 0.4.5
- traefik: 10.3.0
- traefik-forward-auth: 0.3.2
- velero: 3.1.3

### Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
