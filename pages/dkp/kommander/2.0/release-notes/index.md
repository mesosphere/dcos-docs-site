---
layout: layout.pug
beta: false
navigationTitle: Kommander 2.0 Release Notes
title: Kommander 2.0 Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander 2.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD030 -->

**D2iQ&reg; Kommander&reg; version 2.0 was released on 26, August 2021.**

<!--
[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>
-->

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

### New features and capabilities

#### Platform applications

Platform applications, previously referred to as Addons, have moved to Kommander.

#### Kommander UI for use with Konvoy

Managing applications and infrastructure in single to multi-cluster environment has become even easier. Kommander provides a single pane of glass for all the observability, metrics, monitoring, and logging of all clusters in your deployments.

#### Multi-Tenant Logging Architecture

In DKP 2.0, Logging is disabled by default. This release contains a new [logging](../logging) architecture implementation as well as documentation that describes how to manually enable logging at both the Workspace and Project levels. Logging at the Project-level also supports multi-tenant logging. Access the Logging doc pages to review the new architecture and to get started with multi-tenant logging.

#### Unidirectional Network Functionality

Unidirectional Network Functionality has changed to [Network Tunneling](../clusters/attach-cluster).

#### HTTP Proxy Support

Kommander supports environments where Internet access is restricted, and must be made through an [HTTP/HTTPS proxy.](../install/http-proxy) In these environments, you can configure Kommander to use the HTTP/HTTPS proxy. In turn, Kommander then configures all platform services to use the HTTP/HTTPS proxy. Managed clusters in restricted network conditions such as behind DMZs, firewalls, and proxies with no inbound connectivity can now be managed by Kommander. Kommander can create a TLS encrypted tunnel to enable all the observability functionality provided by Kommander. You can even use SSO to authenticate to a managed cluster.

### Component updates

The following services and service components have been upgraded to the listed version:

- centralized-grafana: 17.2.1
    - grafana: 8.0.5
- centralized-kubecost: 0.17.1
    - cost-analyzer: 1.85.0
    - grafana: 7.5.6
    - prometheus: 2.22.2
    - prometheus alertmanager: 0.20.0
    - thanos: 0.22.0
- cert-manager: 0.2.7
    - cert-manager: 1.0.3
- dex: 2.9.10
    - dex: 2.27.0
- dex-k8s-authenticator: 1.2.8
    - dex-k8s-authenticator: 1.2.2
- external-dns: 2.20.5
    - external-dns: 0.7.0
- fluent-bit: 0.16.2
    - fluentbit: 1.8.3
- gatekeeper: 0.6.8
    - gatekeeper: v3.4.0-rc.1
- grafana-logging: 6.13.9
    - grafana: 8.0.5
- grafana-loki: 0.33.1
    - loki: 2.2.1
- istio: 1.9.1
    - istio: 1.9.1
- jaeger: 2.21.0
    - jaeger: 1.21.2
- karma: 2.0.0
    - karma: 0.88
- kiali: 1.29.0
    - kiali: 1.29.0
- kube-oidc-proxy: 0.2.5
    - kube-oidc-proxy: 0.2.0
- kube-prometheus-stack: 17.2.1
    - grafana: 8.0.5
    - prometheus: 2.28.1
    - prometheus alertmanager: 0.22.2
    - thanos: 0.17.2
- kubecost: 0.17.1
    - cost-analyzer: 1.85.0
    - grafana: 7.5.6
    - prometheus: 2.22.2
    - prometheus alertmanager: 0.20.0
    - thanos: 0.22.0
- kubefed: 0.8.1
    - kubefed: 0.8.1
- kubernetes-dashboard: 4.0.3
    - kubernetes-dashboard: 2.2.0
- kubetunnel: 0.0.7
    - kubetunnel: 0.0.7
- logging-operator: 3.13.0
    - logging-operator: 3.13.0
- metallb: 0.12.2
    - metallb: 0.9.3
- minio-operator: 4.1.7
    - minio-operator: 4.1.3
- nvidia: 0.4.2
    - nvidia driver version: 460.73.01
- project-grafana-logging: 6.13.9
    - grafana: 8.0.5
- project-grafana-loki: 0.33.1
    - loki: 2.2.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
    - prometheus-adapter: 0.8.3
- reloader: 0.0.99
    - reloader: 0.0.99
- thanos: 0.3.31
    - thanos: 0.17.1
- traefik: 10.3.0
    - traefik: 2.5.0
- traefik-forward-auth: 0.3.2
    - traefik-forward-auth: 3.0.2
- velero: 3.1.3
    - velero: 1.5.2

<!--### Fixes and Improvements

- Bug fixes with COPS numbers only.-->

### Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
