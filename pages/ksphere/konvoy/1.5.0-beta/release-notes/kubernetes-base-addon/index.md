---
layout: layout.pug
navigationTitle: Kubernetes Base Addons
title: Kubernetes Base Addons
menuWeight: 0
excerpt: View release-specific information for Kubernetes base addons
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Kubernetes Base Addons

May 13, 2020

[stable-1.16-1.7.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.7.0)
[stable-1.15-1.7.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.7.0)

-   dex:
    - Supports specifying the root CA for LDAP connectors in the Dex controller.

-   dex-k8s-authenticator:
    - Adds support for the Konvoy credentials plugin.

-   prometheus:
    - Restricts api extension RBAC rules.
    - Fixes the statefulset crash loop on Kubernetes.

-   velero:
    - Increments velero to chart version 3.0.3, which includes velero-minio RELEASE.2020-04-10T03-34-42Z.
    - Switches minio backend logging from plaintext to json format.

### April 24, 2020

[stable-1.16-1.6.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.6.0),[stable-1.15-1.6.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.6.0)

-   cert-manager:
    - `usages` is no longer definable as part of `issuerRef`. It is now a key on its own.

-   dex-k8s-authenticator:
    - Now supports a kubectl credentials plugin for automatically managing identity tokens. Instructions for downloading the plugin and configuring kubectl can be found at `https://<cluster-ip>/token/plugin`.

-   Elasticsearch:
    - Fixes an issue that can cause the elasticsearch addon to fail to deploy.

### April 9, 2020

[stable-1.16-1.5.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.5.0), [stable-1.15-1.5.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.5.0)

-   awsebscsiprovisioner:
    - Upgrade awsebscsiprovisioner chart to 0.3.5 and aws-ebs-csi-driver to 0.5.0.

-   dex-k8s-authenticator:
    - Allow use of the default system CA.

-   Elasticsearch:
    - Revert the PVC size to default 30G for data nodes.

-   Istio:
    - Disable Istio PodDisruptionBudget. The default settings, and replica count of 1, prevents pods on nodes from being drained.

-   kube-oidc-proxy:
    - Allow use of the default system CA bundle.

-   Prometheus:
    - Upgrade prometheus-operator chart to v8.8.4.

-   Traefik:
    - Upgrade Traefik to 1.7.23. This change fixes the access to the Kubernetes API server when the connection needs to be upgraded to SPDY and other bug fixes. For more details, see [mesosphere/charts#514](https://github.com/mesosphere/charts/pull/514).

### March 27, 2020

[stable-1.16-1.4.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.4.1), [stable-1.15-1.4.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.4.1)

-   Velero:
    - Revert the velero refactor to stable-1.16-1.4.0 due to an instability issue.

-   Velero-minio:
    - Fix instability issues after completing upgrade.

### March 25, 2020

[stable-1.16-1.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.4.0),[stable-1.15-1.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.4.0)
<p class="message--warning"><strong>WARNING DO NOT USE:</strong> This release deletes the secret for the velero backups. The data remains but is not accessible without the secret.</p>

-   Dex:
    - Add SAML connector support in the dex controller.  This allows users to add SAML IDP using the Kubernetes API.

-   Velero:
    - Add switch to use minio helm chart, instead of operator, for backup storage. This allow users to install their own minio operator for general purpose object storage.

### March 12, 2020

[stable-1.16-1.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.3.0), [stable-1.15-1.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.3.0)

-   ElasticSearch, Fluentbit:
    - Create ElasticSearch Index Template. Requires Fluentbit to deploy only after ElasticSearch deploys.

### February 28, 2020

[stable-1.16-1.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.2.0), [stable-1.15-1.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.2.0)

-   Dex:
    - Improve the LDAP connector validation in Dex controller.
    - Fix dex addon issue that disallows adding local users.
    - Use Dex controller v0.4.1 that includes support for OIDC group claims.
    - Upgrade Dex to v2.22.0 to support group claims for OIDC connectors.

-   Dex-k8s-authenticator:
    - Allow configuring scopes. Drop `offline_access` scope as it is not used.

-   Elasticsearch-curator:
    - Add and enable curator to remove old indexes from ElasticSearch, freeing up storage.

-   Fluent-bit:
    - Disable audit log collection. In production clusters the audit log can bloat the number of fields in an index. This causes filling of resource limits and throttling. This collection is pending further investigation.

-   Kibana:
    - Upgrade to [6.8.2.](https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.8.2.html)

-   Kube-oidc-proxy:
    - Enable token passthrough.

-   Opsportal:
    - Set `opsportalRBAC.allowAllAuthenticated` to `true`.
    - Add RBAC support.

-   Traefik-forward-auth:
    - Enable RBAC and impersonation.
    - Remove whitelisting.

-   Add support for kubernetes clusters on GCP.
-   Various chart bumps for stability, bug and security fixes.
