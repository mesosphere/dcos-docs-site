---
layout: layout.pug
navigationTitle: Major Version Upgrade to DKP 2.1.x
title: Major Version Upgrade to DKP 2.1.x
menuWeight: 30
excerpt: How to perform the major version upgrade from Konvoy to DKP (Konvoy)
beta: true
enterprise: false
---

2.x represents a major movement forward in DKP architecture, incorporating ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable.

Moving from Konvoy 1.8.x to DKP 2.1.x is not just an upgrade - you are enhancing your existing clusters to use a new architecture. If you currently use Konvoy to manage one cluster, that single-cluster experience continues in DKP 2.1.x, and includes the use of the management tools offered by Kommander. If you currently use Kommander to manage more than one cluster, your multi-cluster experience continues in DKP 2.1.x, with enhanced management and control offered by CAPI.

## Upgrade paths

See the [upgrade table in the DKP 2.3 documentation](https://docs.d2iq.com/dkp/2.3/upgrade-dkp#UpgradeDKP-Supportedupgradepaths) for the full upgrade paths supported.

## Understanding the Major Version Upgrade Process

<p class="message--warning"><strong>WARNING: </strong>D2iQ does <b>NOT support</b> the upgrade of 1.x clusters to 2.x <b>when Kaptain is enabled</b>. Disable Kaptain before upgrading your clusters to 2.x. Otherwise, your upgrade process might fail. For more information on using Kaptain on DKP 2.x, refer to Kaptain's<a href="https://archive-docs.d2iq.com/dkp/kaptain/2.0.0/fresh-install/">fresh install</a>documentation.</p>

The overall process for upgrading the major version to DKP 2.1 has the following high-level steps:

-   Upgrade all clusters to [Konvoy 1.8.3](/dkp/konvoy/1.8/release-notes/1.8.3/), [Konvoy 1.8.4](/dkp/konvoy/1.8/release-notes/1.8.4/), or [Konvoy 1.8.5](/dkp/konvoy/1.8/release-notes/1.8.5/)

-   [Download and install DKP 2.1.0 or 2.1.1](../download)

-   [Review the CAPI concepts and terms](capi-concepts-and-terms), and [understand the standard configuration](understand-standard-config)

-   [Plan your major version upgrade](plan)

-   [Perform the upgrade steps](upgrade) for your specific environment

-   [Upgrade your Platform Applications](../../../kommander/2.1/major-upgrade/)

For multi-cluster customers, the DKP major version upgrade is handled through the Konvoy clusters.

<p class="message--important"><strong>IMPORTANT: </strong>You must perform the major version upgrade steps on individual clusters, one at a time. No major version upgrade for multiple clusters managed by Kommander is available.</p>
