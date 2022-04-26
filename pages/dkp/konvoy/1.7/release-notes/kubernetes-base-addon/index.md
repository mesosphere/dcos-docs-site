---
layout: layout.pug
navigationTitle: Kubernetes Base Addons
title: Kubernetes Base Addons
menuWeight: 100
excerpt: View release-specific information for Kubernetes base addons
beta: false
enterprise: false
---

<!-- markdownlint-disable MD034 -->

## Kubernetes Base Addons Updates

For instructions on how to apply KBA updates, see [Introduction to KBAs](../../addons)

September 15, 2021

[stable-1.19-3.6.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.6.0)

-   Dashboard:
    - Starting from version 4.0.0 of this chart, it will only support Helm 3 and remove the support for Helm 2.

-   Nvidia
    - Updated Nvidia addon to support driver v460

-   Prometheus
    - fix: Bump Prometheus to v2.29.2 which fixes head GC and pending readers race condition that caused issues with rule evaluations.

-   Traefik-forward-auth
    - Shorten hook names to be within 63 character length.

June 9, 2021

[stable-1.19-3.5.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.5.0)

-   Dex:
    - Defer AuthRequest creation until after initial login page to avoid too many objects.

-   Dex-k8s-authenticator:
    - Security: use a service account rather than adding extra permissions to the default namespace account

-   Fluentbit:
    - Update to the latest minor version just to keep up with upstream. The bugfixes listed should have no effect on our default configurations.
    - https://fluentbit.io/announcements/v1.6.9/
    - https://fluentbit.io/announcements/v1.6.10/

-   Opsportal
    - Fix: update UI dependencies to mitigate CVE-2021-23337
    - Fixes bug in OpsPortal & Kommander UI where LDAP Root CA is malformed when saved
    - Updated UI to only ship with needed dependencies

-   Prometheus
    -   Fix: In upgrades, use existing PVC from previous installation.
    -   Upgrades to the latest version of the kube-prometheus-stack chart. This includes upgrades for multiple applications. The changes listed should not be disruptive to the default addon configuration.
        - prometheus 2.26.0:
        - https://github.com/prometheus/prometheus/releases/tag/v2.22.2
        - https://github.com/prometheus/prometheus/releases/tag/v2.23.0
        - https://github.com/prometheus/prometheus/releases/tag/v2.24.0
        - https://github.com/prometheus/prometheus/releases/tag/v2.24.1
        - https://github.com/prometheus/prometheus/releases/tag/v2.25.0
        - https://github.com/prometheus/prometheus/releases/tag/v2.25.1
        - https://github.com/prometheus/prometheus/releases/tag/v2.25.2
        - https://github.com/prometheus/prometheus/releases/tag/v2.26.0
        - grafana 7.5.3:
        - https://github.com/grafana/grafana/releases/tag/v7.3.6
        - https://github.com/grafana/grafana/releases/tag/v7.3.7
        - https://github.com/grafana/grafana/releases/tag/v7.3.10
        - https://github.com/grafana/grafana/releases/tag/v7.4.0
        - https://github.com/grafana/grafana/releases/tag/v7.4.1
        - https://github.com/grafana/grafana/releases/tag/v7.4.2
        - https://github.com/grafana/grafana/releases/tag/v7.4.3
        - https://github.com/grafana/grafana/releases/tag/v7.4.5
        - https://github.com/grafana/grafana/releases/tag/v7.5.0
        - https://github.com/grafana/grafana/releases/tag/v7.5.1
        - https://github.com/grafana/grafana/releases/tag/v7.5.2
        - https://github.com/grafana/grafana/releases/tag/v7.5.3
        - prometheus-operator 0.47.0:
        - https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.44.1
        - https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.45.0
        - https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.46.0
        - https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.47.0

-   Traefik
    - A bug causing configuration updates to fail when a user adds an invalid tls secret has been fixed

-   Vsphere-csi-driver
    - Update vpshere-csi-driver to v2.2.0 to pull in the fix for duplicate operations failure when attaching PVs (https://github.com/kubernetes-sigs/vsphere-csi-driver/issues/580) (COPS-6906)

April 8, 2021

[stable-1.19-3.4.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.4.1)

-   Opsportal
    - Fixes bug in OpsPortal & Kommander UI where LDAP Root CA is malformed when saved
    - Updated UI to only ship with needed dependencies

March 24, 2021

[stable-1.19-3.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.4.0)

-   Opsportal
    - Fixes bug in OpsPortal where Identity Providers would not show up (COPS-6843)

-   Prometheus
    - Re-enable etcd prometheus rules

-   Reloader
    - When upgrading from a release that used helm 2 to install, reloader cannot be cleanly upgraded due to selector changes. This adds a flag that causes reloader to be uninstalled before being upgraded. This should have no effect on running applications.

March 10, 2021

[stable-1.19-3.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.3.0)

-   Elasticsearch Exporter
    - Added chart support for additional user-specified labels

-   Fluentbit
    - Upgrade fluent-bit helm chart to v0.7.13

-   Jaeger
    - Upgrade jaeger-operator-2.18.4

-   Prometheus
    - Bump k8s-sidecar to 1.3.0 to align and fix CVEs
    - Adds a missing service account which caused addon deletion/cleanup to fail occasionally

-   Prometheus Adapter
    - Fix an error were resources in reported by the Kubernetes dashboard and `kubectl top` reported double of the actual resources.

-   Reloader
    - When upgrading from a release that used helm 2 to install, reloader cannot be cleanly upgraded due to selector changes. This adds a flag that causes reloader to be uninstalled before being upgraded. This should have no effect on running applications.

February 10, 2021

[stable-1.19-3.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.19-3.2.0)

-   Default StorageClass Protection
    - Update client-go to 0.19.2 to support k8s 1.16-1.21
    - Use the distroless image and run as nonroot user to address image CVEs
    - Fix CVE-2019-14697.
    - Use unique Service selectors to avoid selecting unwanted endpoints from other charts.

-   Dex
    - Bump kube-rbac-proxy to tackle vulnerabilities from CVE-14697
    - Fix: ignore metrics auth https://github.com/mesosphere/dex-controller/compare/v0.6.5...v0.6.6#diff-5437c8653258a2e2a070c91d87e2f7581d12f6c7f103b0d8c324a37307287b65R30
    - Chore: bump kube-rbac-proxy version https://github.com/mesosphere/dex-controller/compare/v0.6.5...v0.6.6#diff-4d1856f3f2123c349e94607208c95a821f2485405db0b97ce41e87336a0ea3a7R21

-   Fluentbit
    - Fixes an issue causing some audit logs to be dropped.

-   Kiali
    - Configure to use the same version for `kiali/kiali` that matches the operator.

-   Kibana
    - Downgrade kibana and elasticsearch to 6.8.10 to fix a regression

-   Opsportal
    - Bump kommander ui version fixing the service monitor issues

-   Velero
    - Upgrade Velero to 1.5.2 and minio 8.0.8. Users can now use the official velero client, where before users needed to use a patched velero client.
    - Upgrade kubeaddons-addon-initializer init container to v0.4.3. This fixes the issue that was making it impossible to use a custom S3Url in Velero. (COPS-6675)

December 19, 2020

[stable-1.18-3.0.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.18-3.0.1)

-   Cert-manager:
    - Fix a bug that prevented upgrading when Kommander is not installed

November 12, 2020

[stable-1.18-3.0.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.18-3.0.0)

-   [experimental]Ambassador[/experimental]
    - added Ambassador addon ([#524](https://github.com/mesosphere/kubernetes-base-addons/pull/524), [@shaneutt](https://github.com/shaneutt))

-   Cert-manager:
    - v1 API
    - Renaming our API group from certmanager.k8s.io to cert-manager.io
    - Removal of the v1alpha API
    - kubectl cert-manager status command to help with investigating issues
    - Using new and stable Kubernetes APIs
    - Improved logging
    - ACME improvements
    - kubectl cert-manager create certificaterequest for signing local certificates
    - General Availability of JKS and PKCS&#35;12 keystore support
    - kubectl cert-manager CLI plugin allowing manual renewal and API version conversion
    - ACME External Account Binding support
    - Support for full set of x509 ‘subject’ parameters ([#542](https://github.com/mesosphere/kubernetes-base-addons/pull/542), [@jr0d](https://github.com/jr0d))
    - The Deployment selectors were changed, use `delete` `upgrade-strategy`.
    - support being upgraded from v0.10 to v1.0.3. ([#594](https://github.com/mesosphere/kubernetes-base-addons/pull/594), [@jr0d](https://github.com/jr0d)), ([#656](https://github.com/mesosphere/kubernetes-base-addons/pull/656), [@jr0d](https://github.com/jr0d))

-   Default StorageClass Protection
    - Add servicemonitor labels to enable metrics collection ([#619](https://github.com/mesosphere/kubernetes-base-addons/pull/619), [@gracedo](https://github.com/gracedo))

-   Dex
    - Fix to enable dex-controller metrics collection ([#621](https://github.com/mesosphere/kubernetes-base-addons/pull/621))

-   Elasticsearch:
    - Fixes regression from [helm/charts&#35;17643](https://github.com/helm/charts/pull/17643) where the explicit selectors do match the previously implicit selectors.
    - Fix plugin install initcontainer which would fail if plugin already exists. This happens when Node reboots and keeps emptyDir, or if elasticsearch image already contains plugin
    - In private environments where we replicate all the images, the test image cannot be pulled due it misses imagePullSecrets ([#497](https://github.com/mesosphere/kubernetes-base-addons/pull/497))

-   External-dns
    - Add servicemonitor label to enable metrics collection by Prometheus ([#617](https://github.com/mesosphere/kubernetes-base-addons/pull/617), [@gracedo](https://github.com/gracedo))

-   Fluent-bit:
    -   bump the fluent-bit app version to 1.5.6
        - aws: utils: fix mem leak in flb_imds_request
        - fix double free when destroying connections if the endpoint in unavailable
        - remove noisy error introduced in v1.5.5
        - fix deletion of pending connections in the destroy_queue ([#538](https://github.com/mesosphere/kubernetes-base-addons/pull/538))
    -   The Deployment selectors were changed, use `delete` `upgrade-strategy`. ([#574](https://github.com/mesosphere/kubernetes-base-addons/pull/574), [@dkoshkin](https://github.com/dkoshkin))
    -   Upgrades fluent-bit to v1.5.7. See https://fluentbit.io/announcements/v1.5.7.
    -   Adds chart value `podLabels`. ([#584](https://github.com/mesosphere/kubernetes-base-addons/pull/584))
    -   configuration to unblock output buffer. ([#589](https://github.com/mesosphere/kubernetes-base-addons/pull/589), [@alejandroEsc](https://github.com/alejandroEsc))

-   [experimental]Istio[/experimental]
    -   Bug Fixes
        - Fixed HTTP match request without headers conflict
        - Fixed Istio operator to watch multiple namespaces (Istio &#35;26317)
        - Fixed EDS cache when an endpoint appears after its service resource (Istio &#35;26983)
        - Fixed istioctl remove-from-mesh not removing init containers on CNI installations.
        - Fixed istioctl add-to-mesh and remove-from-mesh commands from affecting OwnerReferences (Istio &#35;26720)
        - Fixed cleaning up of service information when the cluster secret is deleted
        - Fixed egress gateway ports binding to 80⁄443 due to user permissions
        - Fixed gateway listeners created with traffic direction outbound to be drained properly on exit
        - Fixed headless services not updating listeners (Istio &#35;26617)
        - Fixed inaccurate endpointsPendingPodUpdate metric
        - Fixed ingress SDS from not getting secret update (Istio &#35;18912)
        - Fixed ledger capacity size
        - Fixed operator to update service monitor due to invalid permissions (Istio &#35;26961)
        - Fixed regression in gateway name resolution (Istio 26264)
        - Fixed rotated certificates not being stored to /etc/istio-certs VolumeMount (Istio &#35;26821)
        - Fixed trust domain validation in transport socket level (Istio &#35;26435)
    -   Improvements
        - Added istioctl analyzer to detect when Destination Rules do not specify caCertificates (Istio &#35;25652)
        - Added missing telemetry.loadshedding.- options to mixer container arguments
        - Improved specifying network for a cluster without meshNetworks also being configured
        - Improved the cache readiness state with TTL (Istio &#35;26418)
        - Updated SDS timeout to fetch workload certificates to 0s
        - Updated app_containers to use comma separated values for container specification
        - Updated default protocol sniffing timeout to 5s (Istio &#35;24379) ([#516](https://github.com/mesosphere/kubernetes-base-addons/pull/516), [@shaneutt](https://github.com/shaneutt))

-   Kibana
    - Fixes an issue that causes Kibana to deploy without an audit log dashboard. ([#511](https://github.com/mesosphere/kubernetes-base-addons/pull/511), [@branden](https://github.com/branden))

-   Metallb
    - Enable metrics collection ([#623](https://github.com/mesosphere/kubernetes-base-addons/pull/623))

-   Prometheus
    - Scrape external-dns metrics ([#618](https://github.com/mesosphere/kubernetes-base-addons/pull/618), [@gracedo](https://github.com/gracedo))
    - Scrape defaultstorageclass metrics ([#620](https://github.com/mesosphere/kubernetes-base-addons/pull/620), [@gracedo](https://github.com/gracedo))
    - Scrape dex-controller metrics ([#622](https://github.com/mesosphere/kubernetes-base-addons/pull/622), [@gracedo](https://github.com/gracedo))

September 25, 2020

[stable-1.17-2.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.4.0)
[stable-1.16-2.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.4.0)
[stable-1.15-2.4.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.4.0)

-   Istio:
    -   The "kubernetes-service-monitor" service monitor has been removed. ([#481](https://github.com/mesosphere/kubernetes-base-addons/pull/481), [@gracedo](https://github.com/gracedo))

    -   Bumped Istio to v1.6.8:
        -   Fixed security issues:
            - CVE-2020-12603: By sending a specially crafted packet, an attacker could cause Envoy to consume excessive amounts of memory when proxying HTTP/2 requests or responses.
            - CVE-2020-12605: An attacker could cause Envoy to consume excessive amounts of memory when processing specially crafted HTTP/1.1 packets.
            - CVE-2020-8663: An attacker could cause Envoy to exhaust file descriptors when accepting too many connections.
            - CVE-2020-12604: An attacker could cause increased memory usage when processing specially crafted packets.
            - CVE-2020-15104: When validating TLS certificates, Envoy incorrectly allows a wildcard DNS Subject Alternative Name to apply to multiple subdomains. For example, with a SAN of   .example.com, Envoy incorrectly allows nested.subdomain.example.com, when it should only allow subdomain.example.com.
            - CVE-2020-16844: Callers to TCP services that have a defined Authorization Policies with DENY actions using wildcard suffixes (e.g. *-some-suffix) for source principals or namespace fields will never be denied access.
        -   Other changes:
            - Fixed return the proper source name after Mixer does a lookup by IP if multiple pods have the same IP.
            - Improved the sidecar injection control based on revision at a per-pod level (Issue 24801)
            - Improved istioctl validate to disallow unknown fields not included in the Open API specification (Issue 24860)
            - Changed stsPort to sts_port in Envoy’s bootstrap file.
            - Preserved existing WASM state schema for state objects to reference it later as needed.
            - Added targetUri to stackdriver_grpc_service.
            - Updated WASM state to log for Access Log Service.
            - Increased default protocol detection timeout from 100 ms to 5 s (Issue 24379)
            - Removed UDP port 53 from Istiod.
            - Allowed setting status.sidecar.istio.io/port to zero (Issue 24722)
            - Fixed EDS endpoint selection for subsets with no or empty label selector. (Issue 24969)
            - Allowed k8s.overlays on BaseComponentSpec. (Issue 24476)
            - Fixed istio-agent to create elliptical curve CSRs when ECC_SIGNATURE_ALGORITHM is set.
            - Improved mapping of gRPC status codes into HTTP domain for telemetry.
            - Fixed scaleTargetRef naming in HorizontalPodAutoscaler for Istiod (Issue 24809)
            - Optimized performance in scenarios with large numbers of gateways. (Issue 25116)
            - Fixed an issue where out of order events may cause the Istiod update queue to get stuck. This resulted in proxies with stale configuration.
            - Fixed istioctl upgrade so that it no longer checks remote component versions when using --dry-run. (Issue 24865)
            - Fixed long log messages for clusters with many gateways.
            - Fixed outlier detection to only fire on user configured errors and not depend on success rate. (Issue 25220)
            - Fixed demo profile to use port 15021 as the status port. (Issue &#35;25626)
            - Fixed Galley to properly handle errors from Kubernetes tombstones.
            - Fixed an issue where manually enabling TLS/mTLS for communication between a sidecar and an egress gateway did not work. (Issue 23910)
            - Fixed Bookinfo demo application to verify if a specified namespace exists and if not, use the default namespace.
            - Added a label to the pilot_xds metric in order to give more information on data plane versions without scraping the data plane.
            - Added CA_ADDR field to allow configuring the certificate authority address on the egress gateway configuration and fixed the istio-certs mount secret name.
            - Updated Bookinfo demo application to latest versions of libraries.
            - Updated Istio to disable auto mTLS when sending traffic to headless services without a sidecar.
            - Fixed an issue which prevented endpoints not associated with pods from working. (Issue &#35;25974) ([#489](https://github.com/mesosphere/kubernetes-base-addons/pull/489), [@shaneutt](https://github.com/shaneutt))

-   Traefik-forward-auth:
    - Update traefik-foward-auth to 0.2.14
    - Add an option to bypass tfa deployment ([#456](https://github.com/mesosphere/kubernetes-base-addons/pull/456))

-   Fixed an upgrade issue for several addons which would cause them to not be properly targeted for upgrade ([#492](https://github.com/mesosphere/kubernetes-base-addons/pull/492), [@shaneutt](https://github.com/shaneutt))

September 9, 2020

[stable-1.17-2.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.3.0)
[stable-1.16-2.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.3.0)
[stable-1.15-2.3.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.3.0)

-   Azuredisk-csi-driver:
    - enable the Snapshot controller ([#443](https://github.com/mesosphere/kubernetes-base-addons/pull/443), [@dkoshkin](https://github.com/dkoshkin))

-   Cert-manager:
    - `Issuer` namespace setable
    - `Certificate` namespace setable ([#378](https://github.com/mesosphere/kubernetes-base-addons/pull/378), [@sebbrandt87](https://github.com/sebbrandt87))

-   Dex-k8s-authenticator:
    - Windows download support for the credentials plugin ([#377](https://github.com/mesosphere/kubernetes-base-addons/pull/377), [@jr0d](https://github.com/jr0d))
    - Fixed bug causing `certificate-authority=`  option to be added to token instructions on the windows tab when it should have been omitted. ([#436](https://github.com/mesosphere/kubernetes-base-addons/pull/436), [@jr0d](https://github.com/jr0d))

-   Elasticsearch-curator:
    - version 5.8.1 ([#374](https://github.com/mesosphere/kubernetes-base-addons/pull/374), [@sebbrandt87](https://github.com/sebbrandt87))
    - Added value `cronjob.startingDeadlineSeconds`: Amount of time to try reschedule job if we can't run on time ([#447](https://github.com/mesosphere/kubernetes-base-addons/pull/447))

-   Elasticsearch-exporter:
    -   updated from 2.11 to 3.7.0
        - Add a parameter for the elasticsearch-exporter: es.indices_settings as it is supported since version 1.0.4 (the elasticsearch-exporter chart is supporting the version 1.1.0)
        - Update description for envFromSecret parameter in readme
        - Feature flap the flag es.uri to allow fallback to env var ES_URI
        - Allow setting environment variables with k8s secret information to support referencing already existing sensitive parameters.
        - Add es.ssl.client.enabled value for better functionality readability
        - Add option to disable client cert auth in Elasticsearch exporter
        - Add the serviceMonitor targetLabels key as documented in the Prometheus Operator API
        - Add log.level and log.format configs
        - Add the ServiceMonitor metricRelabelings key as documented in the Prometheus Operator API
        - Add sampleLimit configuration option ([#449](https://github.com/mesosphere/kubernetes-base-addons/pull/449))

-   Fluent-bit:
    -   Three different elasticsearch indicies created
        - kubernetes_cluster-- (for container logs)
        - kubernetes_audit-- (for audit logs from kube-apiserver)
        - kubernetes_host-- (for all systemd host logs)
    -   version 1.5.2
        - Kernel messages forwarded ([#375](https://github.com/mesosphere/kubernetes-base-addons/pull/375), [@sebbrandt87](https://github.com/sebbrandt87))
    -   apply meaningful aliases to plugins and their metrics. ([#432](https://github.com/mesosphere/kubernetes-base-addons/pull/432), [@branden](https://github.com/branden))

-   Istio:
    - the "kubernetes-service-monitor" service monitor has been removed. ([#483](https://github.com/mesosphere/kubernetes-base-addons/pull/483), [@gracedo](https://github.com/gracedo))

-   Traefik-foward-auth:
    -   update to 0.2.14
        - Add an option to bypass tfa deployment ([#456](https://github.com/mesosphere/kubernetes-base-addons/pull/456))

-   Kibana:
    - version 6.8.10 ([#373](https://github.com/mesosphere/kubernetes-base-addons/pull/373), [@sebbrandt87](https://github.com/sebbrandt87))

-   Ops-portal:
    - Fix: Unable to change ops-portal password ([#379](https://github.com/mesosphere/kubernetes-base-addons/pull/379), [@GoelDeepak](https://github.com/GoelDeepak))

-   Prometheus:
    -   chore: bump chart to v9.3.1
        - refactor!: (breaking change) version 9 of the helm chart removes the existing `additionalScrapeConfigsExternal` in favor of `additionalScrapeConfigsSecret`. This change lets users specify the secret name and secret key to use for the additional scrape configuration of prometheus.
        - feat: add ingress configuration for Thanos sidecar, enabling external access from a centralized thanos querier running in another cluster
        - feat: add scrape timeout config to service monitor to avoid timeouts on slow kubelets
        - feat: add docker checksum option to improve security for deployed containers
        - feat: add option to disable availability rules
        - feat: enable scraping /metrics/resource for kubelet service
        - feat: [prometheus] enable namespace overrides
        - feat: [prometheus] allow additional volumes and volumeMounts
        - feat: [alertmanager] add volume and volume mounts to spec
        - feat: [alertmanager] add support for serviceAccount.annotations
        - feat: [grafana] enable adding annotations to all default dashboard configmaps
        - chore: bump prometheus to v2.18.2
        - chore: bump alertmanager to v0.21.0
        - chore: bump hyperkube to v1.16.12
        - chore: bump grafana to v5.3.0
        - fix: add missing grafana annotations to k8s-coredns dashboard
        - fix: reduced CPU utilization and time lag for code_verb:apiserver_request_total:increase30d scrape
        - fix: invalid image pull policy for the admission webhook patch
        - fix: alert "KubeNodeUnreachable" no longer fires on an autoscaling scale-down event ([#444](https://github.com/mesosphere/kubernetes-base-addons/pull/444), [@samvantran](https://github.com/samvantran))
    -   disable ServiceMonitors for kube-controller-manager and kube-scheduler. kubernetes has determined the ports that were used for these tests was insecure and has limited it to localhost only. This causes these specific tests to fail. The state of the controller-manager and scheduler pods are still tracked in general as pods. ([#474](https://github.com/mesosphere/kubernetes-base-addons/pull/474), [@dkoshkin](https://github.com/dkoshkin))

August 26, 2020

[stable-1.17-2.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.2.0)
[stable-1.16-2.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.2.0)
[stable-1.15-2.2.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.2.0)

-   prometheus
    - Fix an issue that may cause Grafana's home dashboard to be empty.
    - Disable ServiceMonitors for kube-controller-manager and kube-scheduler. kubernetes has determined the ports that were used for these tests was insecure and has limited it to localhost only. This causes these specific tests to fail. The state of the controller-manager and scheduler pods are still tracked in general as pods.
    - Improve Grafana dashboard names and tags for dashboards tied to addons.

-   traefik
    - Fix metrics access and reporting.

August 12, 2020

[stable-1.17-2.1.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.1.1)
[stable-1.16-2.1.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.1.1)
[stable-1.15-2.1.1](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.1.1)

-   dex-k8s-authenticator
    - Windows download support for the credentials plugin.

July 22, 2020

[stable-1.17-2.1.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.17-2.1.0)
[stable-1.16-2.1.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.16-2.1.0)
[stable-1.15-2.1.0](https://github.com/mesosphere/kubernetes-base-addons/releases/tag/stable-1.15-2.1.0)

-   traefik
    - Fix the velero-minio entrypoint to inherit global ssl and proxy protocol configurations.

-   elasticsearch
    - Default data nodes has been increased to 4.

-   external-dns
    - Disable by default

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
