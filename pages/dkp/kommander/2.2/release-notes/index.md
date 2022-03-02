---
layout: layout.pug
navigationTitle: Kommander 2.2 Release Notes
title: Kommander 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for Kommander 2.2
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on April 6, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

[Download](../download/) and [install](../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in DKP.

This version supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using Kommander 2.2 must be running a Kubernetes version in that range.

### New features and capabilities

#### Upgrade catalog application via CLI and UI

You can use either the CLI or the UI to [upgrade your catalog applications](../projects/applications/catalog-applications/#upgrade-catalog-applications).

<p class="message--note"><strong>NOTE: Catalog applications must be upgraded to the latest version BEFORE upgrading the Kubernetes version (or Konvoy version for managed Konvoy clusters) on attached clusters, due to the previous versions' incompatibility with Kubernetes 1.22.</p>

### Component updates

## Known issues

### Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
