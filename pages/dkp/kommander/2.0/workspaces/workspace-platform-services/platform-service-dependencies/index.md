---
layout: layout.pug
navigationTitle: Workspace Platform Application Dependencies
title: Workspace Platform Application Dependencies
menuWeight: 8
excerpt: Dependencies between workspace applications and services
draft: true
---
There are many dependencies between the platform services that are federated to a workspace's attached clusters. It is important to note these dependencies when customizing the workspace platform services to ensure that your services and applications are properly deployed to the clusters. For more information on how to customize workspace platform services, see [Workspace Platform Services](../).

## Platform Service Dependencies

When deploying or troubleshooting platform services, it helps to understand how platform services interact and may require other platform services as dependencies.

If a platform service’s dependency does not successfully deploy, the platform service requiring that dependency does not successfully deploy.

The following sections detail information about the workspace platform services.

### Foundational Components

Provides the foundation for all platform application capabilities and deployments on managed clusters. These components must be enabled for any platform applications to work properly.

The foundational components are comprised of the following platform services:

- [cert-manager](https://cert-manager.io/docs): Automates TLS certificate management and issuance.
- [reloader](https://github.com/stakater/Reloader): A controller that watches changes on ConfigMaps and Secrets, and automatically triggers updates on the dependent applications.
- [traefik](https://traefik.io/): Provides an HTTP reverse proxy and load balancer. Requires Cert-Manager and Reloader.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| cert-manager               |                        |
| reloader                   |                        |
| traefik                    | cert-manager, reloader |

### Logging

Collects logs over time from Kubernetes and applications deployed on managed clusters. Also provides the ability to visualize and query the aggregated logs.

- [grafana-loki](https://grafana.com/oss/loki/): A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.
- [grafana-logging](https://grafana.com/oss/grafana/): Logging dashboard used to view logs aggregated to Grafana Loki.
- [logging-operator](https://banzaicloud.com/docs/one-eye/logging-operator/): Automates the deployment and configuration of a Kubernetes logging pipeline.
- [MinIO Operator](https://github.com/minio/operator/blob/master/README.md): A Kubernetes-native high performance object store with an S3-compatible API that supports deploying MinIO Tenants onto private and public cloud infrastructures.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| grafana-loki               | grafana-logging        |
| grafana-logging            | grafana-loki           |
| logging-operator           |                        |
| minio-operator             |                        |

### Monitoring

Provides monitoring capabilities by collecting metrics, including cost metrics, for Kubernetes and applications deployed on managed clusters. Also provides visualization of metrics and evaluates rule expressions to trigger alerts when specific conditions are observed.

-   [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack): A stack of applications that collect metrics and provide visualization and alerting capabilities.
    **Note:** [Prometheus](https://prometheus.io), [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager) and [Grafana](https://grafana.com) are included in the bundled installation.
-   [prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter): Provides cluster metrics from Prometheus.
-   [kubecost](https://kubecost.com): provides real-time cost visibility and insights for teams using Kubernetes, helping you continuously reduce your cloud costs.
-   [kubernetes-dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/): A general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them, as well as manage the cluster itself.
-   [nvidia](https://ngc.nvidia.com/catalog/containers/nvidia:k8s:dcgm-exporter): A suite of tools for managing and monitoring NVIDIA datacenter GPUs in cluster environments. Includes active health monitoring, comprehensive diagnostics, system alerts, and governance policies including power and clock management.

| **Platform Service** | Dependencies          |
| -------------------------- | --------------------- |
| kube-prometheus-stack      | traefik               |
| prometheus-adapter         | kube-prometheus-stack |
| kubecost                   | traefik               |
| kubernetes-dashboard       | traefik               |
| nvidia       |                       |

### Security

Allows management of security constraints and capabilities for the clusters and users.

- [gatekeeper](https://github.com/open-policy-agent/gatekeeper): A policy Controller for Kubernetes.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| gatekeeper                 |                        |

### Service Mesh

Allows deploying service mesh on clusters, enabling the management of microservices in cloud-native applications. Service mesh can provide a number of benefits, such as providing observability into communications, providing secure connections, or automating retries and backoff for failed requests.

- [istio](https://istio.io/latest/about/service-mesh/): Addresses the challenges developers and operators face with a distributed or microservices architecture.
- [kiali](https://kiali.io/): A management console for an Istio-based service mesh. It provides dashboards, observability, and lets you operate your mesh with robust configuration and validation capabilities.
- [jaeger](https://www.jaegertracing.io/): A distributed tracing system used for monitoring and troubleshooting microservices-based distributed systems.

| Platform Services  | Dependencies                         |
| ------------------ | ------------------------------------ |
| istio | kube-prometheus-stack                |
| kiali              | istio, jaeger |
| jaeger             |                                      |

### Single Sign On (SSO)

Group of platform applications that allow enabling SSO on attached clusters. SSO is a centralized system for connecting attached clusters to the centralized authority on the management cluster.

- [kube-oidc-proxy](https://github.com/jetstack/kube-oidc-proxy): A reverse proxy server that authenticates users using OIDC to Kubernetes API servers where OIDC authentication is not available.
- [traefik-forward-auth](https://github.com/thomseddon/traefik-forward-auth): Installs a forward authentication service providing Google OAuth based authentication for Traefik.

| Platform Services    | Dependencies          |
| -------------------- | --------------------- |
| kube-oidc-proxy      | cert-manager, traefik |
| traefik-forward-auth | traefik               |

### Backup

This platform application assists you with backing up and restoring your environment.

- [velero](https://velero.io/): An open source tool for safely backing up and restoring resources in a Kubernetes cluster, performing disaster recovery, and migrating resources and persistent volumes to another Kubernetes cluster.

| Platform Services | Dependencies |
| ----------------- | ------------ |
| velero            |              |

<!-- These pages have not yet been migrated for kommander 2.0 & konvoy 2.0
## Related information

- [Kommander security architecture](/dkp/kommander/1.4/security/)
- [Centralized cost monitoring](/dkp/kommander/1.4/centralized-cost-monitoring/)
- [Centralized monitoring](/dkp/kommander/1.4/centralized-monitoring/)
- [Traefik Ingress controller](../networking/ingress/)
- [Monitoring and alerts](/dkp/konvoy/1.7/monitoring/)
- [Logging and audits](/dkp/konvoy/1.7/logging/) -->
