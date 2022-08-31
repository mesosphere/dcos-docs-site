---
layout: layout.pug
navigationTitle: Release Notes Konvoy 2.1.2
title: Release Notes Konvoy 2.1.2
menuWeight: 30
excerpt: View release-specific information for Konvoy 2.1.2
enterprise: false
beta: false
---
**D2iQ&reg; Konvoy&reg; version 2.1.2 was released on June 1, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Konvoy, [download](../../download/) and [install](../../choose-infrastructure/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy.

## Fixes and Improvements

### Upgrade Konvoy 1.8.4 to 2.1.1 index out of range error (COPS-7183)

When attempting to upgrade a Konvoy v1.8 deployment that used an existing VPC, the `prepare-to-adopt` command triggered an error. This problem has been corrected.

<!-- vale Microsoft.HeadingColons = NO -->
### kube-oidc-proxy error: certificate signed by unknown authority (COPS-7217)
<!-- vale Microsoft.HeadingColons = YES -->

A problem that prevented successful configuration of the `kube-oidc-proxy` component when using a custom domain and TLS certificate issued by Let's Encrypt was corrected.

### Konvoy-image-builder 1.7.0 fails in certain situations (COPS-7207)

An issue that resulted in errors like "Failed to connect to the host via ssh" when running konvoy-image-builder v1.7.0 has been corrected. The fix is available in konvoy-image-builder v1.8.0.

### KIB fails to pull images in air-gapped environments  (COPS-7198)
<!-- vale Microsoft.Avoid = NO -->
Running konvoy-image-builder v1.7.0 in air-gapped environments would result in failures to pull docker images if the environment used registry mirrors and/or credentials. The problem is resolved in konvoy-image-builder v1.8.0.
<!-- vale Microsoft.Avoid = YES -->

### Machine stuck in provisioned state after pivot (COPS-7166)

After performing a Pivot operation to migrate cluster resources in DKP 2.1.1, some machines could be stuck in the provisioning state. This issue has been resolved.

### kube-prometheus-stack error during install (COPS-7163)

A problem with Prometheus where the component `kube-prometheus-stack` attempted to upgrade its CRDs to a new version with invalid specifications was resolved.

### HTTP(S)_proxy variables missing from CAPA pods (COPS-7158)

When deploying a 2.1.1 Konvoy cluster, the local environment variables for http_proxy, https_proxy and no_proxy were not propagated to CAPI/CAPA provider pods outside the kube-system namespace, which lead to timeouts in the CAPA pod.

### The Nvidia addon fails to recognize nodes with GPU when GPUs are scarce (COPS-7142)

In DKP 2.x, Nvidia fails to differentiate between nodes with and without a GPU, mistakenly deploying the Nvidia driver and DCGM exporter to every worker node in the cluster.

### Minio CVE-2021-21287 (COPS-7134)

The Minio subchart deployed with Velero has been upgraded to a version that remediates CVE-2021-21287.

### DKP CLI cannot add Azure credentials to a bootstrap cluster (COPS-7108)

An option has been added to the DKP CLI that allows you to add Azure credentials to an existing bootstrap cluster without needing to manually create a secret.

### Prometheus/Grafana kubeaddons cronjob spawns excessive pods (COPS-7105)

As a result of a misconfiguration, the`prometheus-kubeaddons-set-grafana-home-dashboard` can get stuck in a pending state. When this happened, the cronjob associated with Grafana would keep spawning a pod every 5 minutes, which resulted in an excessive number of pods. The Grafana cronjob has been modified to avoid spawning excess pods in this situation.

## Component updates

The following services and service components are upgraded to the listed version:

- centralized-grafana: 18.1.3
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.9.10
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.9
- grafana-logging: 6.16.14
- grafana-loki: 0.33.1
- istio: 1.9.2
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- knative: 0.18.3
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 18.1.3
- kubecost: 0.20.0
- kubefed: 0.9.0
- kubernetes-dashboard: 5.0.2
- kubetunnel: 0.0.8
- logging-operator: 3.15.0
- metallb: 0.12.2
- minio-operator: 4.1.7
- nfs-server-provisioner: 0.6.0
- nvidia: 0.4.3
- project-grafana-logging: 6.16.14
- project-grafana-loki: 0.33.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
- reloader: 0.0.99
- thanos: 0.4.5
- traefik: 10.3.0
- traefik-forward-auth: 0.3.2
- velero: 3.1.5

## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kubernetes-doc]: https://kubernetes.io/docs/home/
[konvoy-self-managed]: /dkp/konvoy/2.1/choose-infrastructure/aws/advanced/self-managed
[flux-cli]: https://fluxcd.io/docs/installation/
[acme]: https://cert-manager.io/docs/configuration/acme/
[config_kub]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[selfsigned]: https://cert-manager.io/docs/configuration/selfsigned/
