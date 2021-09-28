---
layout: layout.pug
navigationTitle: Workspace Platform Application Dependencies
title: Workspace Platform Application Dependencies
menuWeight: 8
excerpt: Dependencies between workspace applications
---

There are many dependencies between the platform applications that are deployed to a workspace's attached clusters. It is important to note these dependencies when customizing the workspace platform applications to ensure that your applications are properly deployed to the clusters. For more information on how to customize workspace platform applications, see [Workspace Platform Applications](../../workspace-platform-services#customize-a-workspaces-applications).

## Platform Application Dependencies

When deploying or troubleshooting platform applications, it helps to understand how platform applications interact and may require other platform applications as dependencies.

If a platform application’s dependency does not successfully deploy, the platform application requiring that dependency does not successfully deploy.

The following sections detail information about the workspace platform application.

### Foundational Applications

Provides the foundation for all platform application capabilities and deployments on managed clusters. These applications must be enabled for any platform applications to work properly.

The foundational applications are comprised of the following platform application:

- [cert-manager](https://cert-manager.io/docs): Automates TLS certificate management and issuance.
- [reloader](https://github.com/stakater/Reloader): A controller that watches changes on ConfigMaps and Secrets, and automatically triggers updates on the dependent applications.
- [traefik](https://traefik.io/): Provides an HTTP reverse proxy and load balancer. Requires cert-manager and reloader.

| **Platform Application** | **Dependencies**       |
| ------------------------ | ---------------------- |
| cert-manager             |                        |
| reloader                 |                        |
| traefik                  | cert-manager, reloader |

### Logging

Collects logs over time from Kubernetes and applications deployed on managed clusters. Also provides the ability to visualize and query the aggregated logs.

- [grafana-loki](https://grafana.com/oss/loki/): A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.
- [grafana-logging](https://grafana.com/oss/grafana/): Logging dashboard used to view logs aggregated to Grafana Loki.
- [logging-operator](https://banzaicloud.com/docs/one-eye/logging-operator/): Automates the deployment and configuration of a Kubernetes logging pipeline.
- [minio-operator](https://github.com/minio/operator/blob/master/README.md): A Kubernetes-native high performance object store with an S3-compatible API that supports deploying MinIO Tenants onto private and public cloud infrastructures.
- [fluent-bit](https://docs.fluentbit.io/manual/): Open source and multi-platform log processor tool which aims to be a generic Swiss knife for logs processing and distribution.

| **Platform Application** | **Dependencies** |
| ------------------------ | ---------------- |
| grafana-loki             | minio-operator   |
| grafana-logging          | grafana-loki     |
| logging-operator         |                  |
| minio-operator           |                  |
| fluent-bit               |                  |

### Monitoring

Provides monitoring capabilities by collecting metrics, including cost metrics, for Kubernetes and applications deployed on managed clusters. Also provides visualization of metrics and evaluates rule expressions to trigger alerts when specific conditions are observed.

-   [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack): A stack of applications that collect metrics and provide visualization and alerting capabilities.
    <p class="message--note"><strong>NOTE: </strong><a href="https://prometheus.io">Prometheus</a>, <a href="https://prometheus.io/docs/alerting/latest/alertmanager">Prometheus Alertmanager</a> and <a href="https://grafana.com">Grafana</a> are included in the bundled installation.</p>
-   [prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter): Provides cluster metrics from Prometheus.
-   [kubecost](https://kubecost.com): provides real-time cost visibility and insights for teams using Kubernetes, helping you continuously reduce your cloud costs.
-   [kubernetes-dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/): A general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them, as well as manage the cluster itself.
-   [nvidia](https://ngc.nvidia.com/catalog/containers/nvidia:k8s:dcgm-exporter): A suite of tools for managing and monitoring NVIDIA datacenter GPUs in cluster environments. Includes active health monitoring, comprehensive diagnostics, system alerts, and governance policies including power and clock management.

| **Platform Application** | Dependencies          |
| ------------------------ | --------------------- |
| kube-prometheus-stack    | traefik               |
| prometheus-adapter       | kube-prometheus-stack |
| kubecost                 | traefik               |
| kubernetes-dashboard     | traefik               |
| nvidia                   |                       |

### Security

Allows management of security constraints and capabilities for the clusters and users.

- [gatekeeper](https://github.com/open-policy-agent/gatekeeper): A policy Controller for Kubernetes.

| **Platform Application** | **Dependencies** |
| ------------------------ | ---------------- |
| gatekeeper               |                  |

### Single Sign On (SSO)

Group of platform applications that allow enabling SSO on attached clusters. SSO is a centralized system for connecting attached clusters to the centralized authority on the management cluster.

- [kube-oidc-proxy](https://github.com/jetstack/kube-oidc-proxy): A reverse proxy server that authenticates users using OIDC to Kubernetes API servers where OIDC authentication is not available.
- [traefik-forward-auth](https://github.com/thomseddon/traefik-forward-auth): Installs a forward authentication application providing Google OAuth based authentication for Traefik.

| **Platform Application** | **Dependencies**      |
| ------------------------ | --------------------- |
| kube-oidc-proxy          | cert-manager, traefik |
| traefik-forward-auth     | traefik               |

### Backup

This platform application assists you with backing up and restoring your environment.

- [velero](https://velero.io/): An open source tool for safely backing up and restoring resources in a Kubernetes cluster, performing disaster recovery, and migrating resources and persistent volumes to another Kubernetes cluster.

| **Platform Application** | **Dependencies** |
| ------------------------ | ---------------- |
| velero                   |                  |

### Service Mesh

Allows deploying service mesh on clusters, enabling the management of microservices in cloud-native applications. Service mesh can provide a number of benefits, such as providing observability into communications, providing secure connections, or automating retries and backoff for failed requests.

- [istio](https://istio.io/latest/about/service-mesh/): Addresses the challenges developers and operators face with a distributed or microservices architecture.
- [kiali](https://kiali.io/): A management console for an Istio-based service mesh. It provides dashboards, observability, and lets you operate your mesh with robust configuration and validation capabilities.
- [jaeger](https://www.jaegertracing.io/): A distributed tracing system used for monitoring and troubleshooting microservices-based distributed systems.

| **Catalog Application** | **Dependencies**      |
| ----------------------- | --------------------- |
| istio                   | kube-prometheus-stack |
| kiali                   | istio, jaeger         |
| jaeger                  |                       |

## Related information

- [Kommander security architecture](../../../security/)
- [Traefik Ingress controller](../../../networking/ingress/)
- [Logging and audits](../../../logging/)

<!-- These pages have not yet been migrated for kommander 2.0 & konvoy 2.0
- [Centralized cost monitoring](/dkp/kommander/1.4/centralized-cost-monitoring/)
- [Centralized monitoring](/dkp/kommander/1.4/centralized-monitoring/)
- [Monitoring and alerts](/dkp/konvoy/1.7/monitoring/) -->
