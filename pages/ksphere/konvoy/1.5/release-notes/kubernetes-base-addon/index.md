---
layout: layout.pug
navigationTitle: Kubernetes Base Addons
title: Kubernetes Base Addons
menuWeight: 0
excerpt: View release-specific information for Kubernetes base addons
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Kubernetes Base Addons Updates

For instructions on how to apply KBA updates, see [Introduction to KBAs](../../addons)

July 15, 2020

[stable-1.17-2.0.2](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.0.2)
[stable-1.16-2.0.2](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.0.2)
[stable-1.15-2.0.2](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.0.2)

-   traefik:
    - Fix metric access and reporting.

July 14, 2020

[stable-1.17-2.0.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.0.1)
[stable-1.16-2.0.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.0.1)
[stable-1.15-2.0.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.0.1)

-   traefik:
    - Fix metric access and reporting.

-   prometheus:
    - Improve Grafana dashboard names and tags for dashboards tied to addons.

July 9, 2020

[stable-1.17-2.0.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.0.0)
[stable-1.16-2.0.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.0.0)
[stable-1.15-2.0.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.0.0)

-   awsebscsiprovisioner:
    - The manual steps to upgrade the snapshot APIs from v1alpha1 to v1beta1 are no longer required. This has been automated in the chart CRD install hook by default. If you do not want that default behavior, of cleaning up v1alpha1 snapshot CRDs, set `cleanupVolumeSnapshotCRDV1alpha1` to `false` and follow the instructions for upgrading to Kubernetes `1.17`.

-   azuredisk-csi-driver:
    - The manual steps to upgrade the snapshot APIs from v1alpha1 to v1beta1 is no longer required. It has been automated in the chart CRD install hook by default. If you do not want that default behavior of cleaning up v1alpha1 snapshot CRDs, you can set `snapshot.cleanupVolumeSnapshotCRDV1alpha1` to `false` and follow the instructions for upgrading to Kubernetes `1.17`.

-   dashboard:
    - Upgraded the Kubernetes dashboard to 2.0.3.
    - Added metrics visualizations to the Kubernetes dashboard UI.

-   dex-k8s-authenticator:
    - Fixed a bug in init container that removed custom CA certificate from main cluster login instructions.
    - You can render configure kubectl instructions with the cluster hostname.
    - Added clippy js for clipboard support.

-   gcpdisk-csi-driver:
    - The manual steps to upgrade the snapshot APIs from v1alpha1 to v1beta1 are no longer required. This is automated in the chart CRD install hook by default. If you do not want this default behavior, of cleaning up v1alpha1 snapshot CRDs, set `cleanupVolumeSnapshotCRDV1alpha1` to `false` and follow the instructions for upgrading to Kubernetes `1.17`.

-   opsportal:
    - Fixed a typo in 'lables' that caused issues during upgrades.
    - Allow landing page deployment replica count to be configured.

-   prometheus:
    - Updated prometheus-operator chart. This adds a grafana dashboard for monitoring autoscaler.
    - Increased the default Prometheus server resources.

-   prometheus-alert-manager:
    - Increased memory and cpu limits caused by OOM errors.

-   prometheus-operator:
    -   Upgraded to version [0.38.1](https://github.com/coreos/prometheus-operator/releases/tag/v0.38.1).
        -   prometheus:
            - Upgraded to version [2.17.2](https://github.com/prometheus/prometheus/releases/tag/v2.17.2).
        -   grafana:
            - Upgraded to version [6.7.3](https://github.com/grafana/grafana/releases/tag/v6.7.3).

-   traefik:
    - Fixed an issue so `clusterhostname` can also be an ipaddress.
    - Distribute pods across nodes and zones when possible.
    - You can set a `PodDisruptionBudget` to ensure at least 1 pod is running at all times.
    - Traefik is upgradeable again when the `initCertJobImage` field is modified.
    - Upgraded to 1.7.24.
    - mTLS is available.
    - `accessLogs.filters` are setable.
    - `caServer` is setable for acme challenge.
    - Access log is enabled by default.
    - Reverted changes to the service ports that broke Velero functionality.

-   traefik-foward-auth:
    - Fixed a bug that might cause `oauth` callback to be redirected to other services.

-   ValuesRemap has been added for rewriting the forward authentication url in multiple addons.

-   Konvoyconfig has a new field `caCertificate` that supports custom certificates in managed clusters.

-   Istio addon is upgraded to 1.6.3.

-   Added the Conductor service card to the cluster detail page of the UI.

June 2, 2020

[stable-1.17-1.8.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-1.8.0)

-   kibana:
    - Fixes an issue deploying an outdated version of Kibana to GCP.

May 28, 2020

[stable-1.16-1.8.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.8.0)
[stable-1.15-1.8.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.8.0)

-   kibana:
    - Fixes an issue deploying an outdated version of Kibana to GCP.

May 13, 2020

[stable-1.16-1.7.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-1.7.0)
[stable-1.15-1.7.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-1.7.0)

-   dex:
    - Supports specifying the root CA for LDAP connectors in the Dex controller.

-   dex-k8s-authenticator:
    - Adds support for the Konvoy credentials plug-in.

-   elasticsearch:
    - Default number of data replicas changed from 2 to 4.

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

-   Elasticsearch, Fluentbit:
    - Create Elasticsearch Index Template. Requires Fluentbit to deploy only after Elasticsearch deploys.

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
    - Add and enable curator to remove old indexes from Elasticsearch, freeing up storage.

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
