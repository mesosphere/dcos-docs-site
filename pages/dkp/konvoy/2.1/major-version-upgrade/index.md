---
layout: layout.pug
navigationTitle: Major Version Upgrade to DKP 2.1
title: Major Version Upgrade to DKP 2.1
menuWeight: 30
excerpt: How to perform the major version upgrade from Konvoy 1.8.3 to DKP (Konvoy) 2.1
beta: true
enterprise: false
---

2.x represents a major movement forward in DKP architecture, incorporating ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable.

Moving from Konvoy 1.8.3 to DKP 2.1 is not just an upgrade - you are enhancing your existing clusters to use a new architecture. If you currently use Konvoy to manage one cluster, that single-cluster experience continues in DKP 2.1, and includes the use of the management tools offered by Kommander. If you currently use Kommander to manage more than one cluster, your multi-cluster experience continues in DKP 2.1, with enhanced management and control offered by CAPI.

## Understanding the Major Version Upgrade Process

The overall process for upgrading the major version to DKP 2.1 has the following high-level steps:

-   Upgrade all clusters to [Konvoy 1.8.3](../release-notes)

-   [Download and install DKP 2.1](../download)

-   [Review the CAPI concepts and terms](capi-concepts-and-terms), and [understand the standard configuration](understand-standard-config)

-   [Plan your major version upgrade](plan)

-   [Perform the upgrade steps](upgrade) for your specific environment

For multi-cluster customers, the DKP major version upgrade is handled through the Konvoy clusters.

<p class="message--important"><strong>IMPORTANT: </strong>You must perform the major version upgrade steps on individual clusters, one at a time. No major version upgrade for multiple clusters managed by Kommander is available.</p>
