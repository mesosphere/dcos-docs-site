---
layout: layout.pug
navigationTitle: DKP 2.2.3 Release Notes
title: DKP 2.2.3 Release Notes
menuWeight: 40
excerpt: View release-specific information for DKP 2.2.3
enterprise: false
beta: false
---
**D2iQ&reg; Konvoy&reg; version 2.2.3 was released on October 25th, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install DKP.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2.3! This release provides fixes reported issues, integrates changes from previous releases, and maintains compatibility and support for other packages used in Konvoy.

DKP 2.2.x supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2.x must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**  | 1.21.0  |
| **Maximum**  | 1.22.x  |
| **Default**  | 1.22.8  |

## Fixes and Improvements

### Workload clusters cannot be successfully attached when the management cluster uses a custom domain and certificate (D2IQ-93002)

A problem that caused the kommander federation-controller to use system certificates instead of the configured custom certificates was corrected.   The federation-controller now uses custom certificates if they are present.  

### Missing Cert-manager images in airgapped bundles (D2IQ-93002)

The air-gapped image bundles did not include images for cert-manager, which prevented successful deployment of the platform applications to managed and attached clusters in those environments.   The bundle has been updated to include the correct images.

## Component and Application updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

### Components

- CAPPPVersion = "v0.8.3"
- CAPZVersion  = "v1.3.1"
- Containerd 1.4.13
- KIB v1.17.2


## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
