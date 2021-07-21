---
layout: layout.pug
navigationTitle: Workspace Platform Application Dependencies
title: Workspace Platform Application Dependencies
menuWeight: 8
excerpt: Dependencies between workspace application services
draft: true
---
There are many dependencies between the platform services that are federated to a workspace's attached clusters. It is important to note these dependencies when customizing the workspace platform services to ensure that your services and applications are properly deployed to the clusters. For more information on how to customize workspace platform services, see [Workspace Platform Services](../).

## Platform Service Dependencies

When deploying or troubleshooting platform services, it helps to understand how platform services interact and may require other platform services as dependencies.

If a platform service’s dependency does not successfully deploy, the platform service requiring that dependency does not successfully deploy. <!--- TODO: The table below lists workspace platform services and their dependencies. -->

The following sections detail information about the workspace platform services.

### Foundational Components

The foundational components are essential and provide the base for all platform service capabilities and deployments on managed clusters. You must enable these components before you can enable any other platform services.

The foundational components are comprised of the following platform services:

- [cert-manager](https://cert-manager.io/docs): Certificate management controller that automates TLS certificate management and issuance.
- [reloader](https://github.com/stakater/Reloader): A controller that watches changes on ConfigMaps and Secrets, and automatically triggers updates on the dependent applications.
- [traefik](https://traefik.io/): An HTTP reverse proxy and load balancer.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| cert-manager               |                        |
| reloader                   |                        |
| traefik                    | cert-manager, reloader |

### Logging

These platform services provide the functionality to collect logs over time from Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize and query the aggregated logs.

- [loki-distributed](https://grafana.com/oss/loki/): A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. It is designed to be very cost effective and easy to operate. It does not index the contents of the logs, but rather a set of labels for each log stream.
- [grafana-logging](https://grafana.com/oss/grafana/): Allows you to query, visualize, alert on and understand your metrics no matter where they are stored.
- [logging-operator](https://banzaicloud.com/docs/one-eye/logging-operator/): Automates the deployment and configuration of a Kubernetes logging pipeline. The operator deploys and configures a Fluent Bit DaemonSet on every node to collect container and application logs from the node file system.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| loki-distributed           |                        |
| grafana-logging            |                        |
| logging-operator           |                        |

### Monitoring

These platform services provide monitoring capabilities by collecting metrics, including cost metrics, for Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize these metrics and evaluate rule expressions to trigger alerts.

- [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack): A systems and service monitoring system that collects metrics from configured targets at given intervals, evaluates rule expressions, displays the results, and can trigger alerts when specified conditions are observed. Note: [Prometheus](https://prometheus.io), [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager) and [Grafana](https://grafana.com) are included in the bundled installation.
- [prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter): Exposes custom application metrics from Prometheus.
- [kubecost](https://kubecost.com): A cost-monitoring tool that gives you visibility into your Kubernetes resources to reduce spend and prevent resource-based outages.
- [kubernetes-dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/): a web-based Kubernetes user interface. You can use Dashboard to deploy containerized applications to a Kubernetes cluster, troubleshoot your containerized application, and manage the cluster resources.
- [nvidia](https://www.nvidia.com/en-sg/):

| **Platform Service** | Dependencies                   |
| -------------------------- | ------------------------------ |
| kube-prometheus-stack      | traefik                        |
| prometheus-adapter         | kube-prometheus-stack          |
| kubecost                   | traefik                        |
| kubernetes-dashboard       | traefik                        |
| nvidia                     |                                |

### Security

These platform services allow management of security constraints and capabilities for the clusters and users.

- [gatekeeper](https://gkaccess.com/): Passwordless login to Windows, Mac, websites, desktop applications, and OTP.

| **Platform Service** | **Dependencies** |
| -------------------------- | ---------------------- |
| gatekeeper                 |                        |

### Service Mesh

These platform services allow deploying service mesh on clusters, enabling the management of microservices in cloud-native applications. Service mesh can provide a number of benefits, such as providing observability into communications, providing secure connections, or automating retries and backoff for failed requests.

- [Istio Service Mesh](https://istio.io/latest/about/service-mesh/): Addresses the challenges developers and operators face with a distributed or microservices architecture.
- [Kiali](https://kiali.io/): A management console for an Istio-based service mesh. It provides dashboards, observability, and lets you operate your mesh with robust configuration and validation capabilities.
- [Jaeger](https://www.jaegertracing.io/): Open source, end-to-end distributed tracing. Monitor and troubleshoot transactions in complex distributed systems.

| Platform Services  | Dependencies |
| ------------------ | ------------ |
| Istio Service Mesh | kube-prometheus-stack |
| Kiali              | istio                 |
| Jaeger             |                       |

### Single Sign On (SSO)

These platform applications allow you to enable SSO on attached clusters. SSO is a centralized system for connecting attached clusters to the centralized authority on the management cluster.

- [kube-oidc-proxy](https://github.com/jetstack/kube-oidc-proxy): A reverse proxy server that authenticates users using OIDC to Kubernetes API servers where OIDC authentication is not available.
- [traefik-forward-auth](https://github.com/thomseddon/traefik-forward-auth): A minimal forward authentication service that provides OAuth/SSO login and authentication for traefik

| Platform Services    | Dependencies          |
| -------------------- | --------------------- |
| kube-oidc-proxy      | cert-manager, traefik |
| traefik-forward-auth | traefik               |

### Backup

This platform application assists you with backing up and restoring your environment.

- [Velero](https://velero.io/): An open source tool to safely backup and restore, perform disaster recovery, and migrate Kubernetes cluster resources and persistent volumes.

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
