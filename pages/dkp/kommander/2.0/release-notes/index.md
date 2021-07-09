---
layout: layout.pug
beta: true
navigationTitle: Kommander 2.0 Release Notes
title: Kommander 2.0 Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander 2.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD030 -->

**D2iQ&reg; Kommander&reg; version 2.0 beta 5 was released on 08, July 2021.**

<!--
[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/latest/download/) and [install](/dkp/konvoy/latest/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>
-->

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

### New features and capabilities

<!--#### Kommander UI for use with Konvoy-->

#### Multi-Tenant Logging Architecture

DKP 2.0 Beta Logging is disabled by default. This Beta release contains a new logging architecture implementation and the documentation for manually enabling logging at both the Workspace and Project levels. Logging at the Project-level offers the initial functionality needed for multi-tenant logging. Access the [Logging](../logging) Beta doc pages to review the new architecture and to get started with multi-tenant logging.

### Component updates

The following services and service components have been upgraded to the listed version:

- cert-manager: 0.2.7
    - cert-manager: 1.0.3
- dex: 2.9.4
    - dex: 2.27.0
- dex-k8s-authenticator: 1.2.8
    - dex-k8s-authenticator: 1.2.2
- external-dns: 2.20.5
    - external-dns: 0.7.0
- gatekeeper: 0.6.7
    - gatekeeper: v3.4.0-rc.1
- grafana-logging: 6.9.1
    - grafana: 7.4.5
- istio: 1.9.1
    - istio: 1.9.1
- jaeger: 2.21.0
    - jaeger: 1.21.2
- kiali: 1.29.0
    - kiali: 1.29.0
- kube-oidc-proxy: 0.2.5
    - kube-oidc-proxy: 0.2.0
- kube-prometheus-stack: 15.4.6
    - grafana: 7.4.5
    - prometheus: 2.26.0
    - prometheus alertmanager: 0.21.0
    - thanos: 0.17.1
- kubecost: 0.13.0
    - cost-analyzer: 1.81.0
    - prometheus: 2.19.2
    - prometheus alertmanager: 0.21.0
    - thanos: 0.19.0
- kubefed: 0.8.0
    - kubefed: 0.8.0
- kubernetes-dashboard: 4.0.3
    - kubernetes-dashboard: 2.2.0
- loki-distributed: 0.33.1
    - loki: 2.2.1
- metallb: 0.12.2
    - metallb: 0.9.3
- nvidia: 0.4.0
    - nvidia driver version: 460.73.01
- prometheus-adapter: 2.11.1
    - prometheus-adapter: 0.8.3
- reloader: 0.0.85
    - reloader: 0.0.85
- traefik: 9.19.1
    - traefik: 2.4.8
- traefik-forward-auth: 0.2.14
    - traefik-forward-auth: 2.0.5
- velero: 3.1.1
    - velero: 1.5.2

<!--### Fixes and Improvements

- Bug fixes with COPS numbers only.-->

### Known Issues

- The Traefik dashboard is currently not exposed. To access the dashboard, port-forward the service, replacing `<type_workspace_name>` with the name of the workspace that Traefik is deployed to:

  ```bash
  export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_workspace_name> -o jsonpath='{.spec.status.namespaceRef.name}')
  kubectl port-forward -n ${WORKSPACE_NAMESPACE} svc/kommander-traefik-dashboard 9000:80
  ```

  You can access the dashboard in your browser at `http://localhost:9000/dashboard/` (the trailing `/` is required).

### Additional resources

<!-- Add links to external documentation as needed -->

For information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
