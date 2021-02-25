---
layout: layout.pug
navigationTitle: Support
title: Support
menuWeight: 60
excerpt: Support terms and policies
---

D2iQ provides support through its online [Customer Support Portal](https://support.d2iq.com/s/), which allows authorized support contacts to submit and manage SLA governed support requests at any time. If you aren’t sure if you’ve been designated as an authorized support contact on your account, please reach out to your account team to make the appropriate arrangements.

The specific SLAs associated with these severities depend on your support level and are described in more detail in our [Support Terms](https://d2iq.com/legal/support-terms).

As a self-hosted (on-prem or cloud provider) product, we support Conductor according to the following use cases:

1. We support Conductor application failures, in the case that Conductor stops functioning as expected, as described per this product documentation.

* Accordingly, Conductor is equipped with an error-tracking monitoring system, Errbit, which we our team can use to collect a diagnostic bundle in order to easier reproduce and diagnose application failures.

1. We support the installation and setup procedure of Conductor onto self-hosted Kubernetes deployments within the range of the current specified prerequisites:

- If you do not have a Konvoy Kubernetes cluster, to install Conductor, you must have:
- Kubernetes v1.13-v1.17, with admin access
- Helm v2 (v3 is not supported)
- Traefik: V1.7.x, with the exception of V1.7.23.
*** NOTE: Traefik V1.7.23 has a serious bug that breaks Conductor ***
- Traefik V2.x is not supported.
- cert-manager, v.0.10.0 or earlier.

1. We support only the backing up and restoring procedures for self-hosted deployments’ Postgresql databases, as described in this product documentation.
* We do not support any customer alterations to the database, other than those that are enabled via the application, as specified in this product documentation.
* We do not support any use of components installed by conductor for purposes other than those automatically set up by conductor

1. We do not support customer alterations to the code-base.
