---
layout: layout.pug
navigationTitle: Kubernetes Base Addons
title: Kubernetes Base Addons
menuWeight: 0
beta: true
excerpt: View release-specific information for Kubernetes base addons
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Kubernetes Base Addons

### March 27, 2020

[stable-1.16-1.4.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.4.1), [stable-1.15-1.4.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.4.1)

-   Velero:
    - Revert the velero refactor to stable-1.16-1.4.0 due to an instability issue.

-   Velero-minio:
    - Fix instability issues after completing upgrade.

### March 25, 2020

[stable-1.16-1.4.0], [stable-1.15-1.4.0]

<p class="message--warning"><strong>WARNING: DO NOT USE </strong>This release deletes the secret for the velero backups. The data remains but is not accessible without the secret.</p>

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

-   Fluent-bit:
    - Disable audit log collection - In production clusters the audit log can bloat the number of fields in an index. This causes filling of resource limits and throttling. This collection is pending further investigation.
-   Dex:
    - Improve the LDAP connector validation in Dex controller.
    - Fix dex addon issue that disallows adding local users.
    - Use Dex controller v0.4.1 that includes support for OIDC group claims.
    - Upgrade Dex to v2.22.0 to support group claims for OIDC connectors.
-   Dex-k8s-authenticator:
    - Allow configuring scopes. Drop `offline_access` scope as it is not used.
-   Kube-oidc-proxy:
    - Enable token passthrough.
-   Opsportal:
    - Set `opsportalRBAC.allowAllAuthenticated` to `true`.
    - Add RBAC support.
-   Traefik-forward-auth:
    - Enable RBAC and impersonation.
    - Remove whitelisting.
-   Kibana:
    - Upgrade to [6.8.2.](https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.8.2.html)
-   Elasticsearch-curator:
    - Add and enable curator to remove old indexes from ElasticSearch, freeing free up storage.

-   Add support for kubernetes clusters on GCP
-   Various chart bumps for stability, bug and security fixes.
