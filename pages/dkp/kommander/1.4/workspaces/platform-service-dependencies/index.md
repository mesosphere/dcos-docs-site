---
layout: layout.pug
beta: true
navigationTitle: Workspace Platform Service Dependencies
title: Workspace Platform Service Dependencies
menuWeight: 8
excerpt: Dependencies between workspace platform services
---

There are many dependencies between the platform services that are federated to a workspace's attached clusters. It is important to note these dependencies when customizing the workspace platform services to ensure that they are deployed properly to the clusters. For more information on how to customize workspace platform services, see [Workspace Platform Services][workspace-platform-service].

## Platform Service Dependencies

When deploying or troubleshooting platform services, it helps to understand how platform services interact and may require other platform services as dependencies.

If a platform service’s dependency does not successfully deploy, the platform service requiring that dependency does not successfully deploy. The table below lists workspace platform services and their dependencies.

<p class="message--important"><strong>IMPORTANT: </strong>All platform services are dependent on the Kubeaddons controller, which manages the installation of platform services.</p>

| **Platform Service** | **Dependencies** |
| --- | --- |
| cert-manager |  |
| elasticsearch |  |
| elasticsearch-curator | elasticsearch |
| elasticsearchexporter | elasticsearch |
| fluentbit | elasticsearch |
| kibana |  elasticsearch, traefik |
| kube-oidc-proxy | cert-manager, traefik |
| kubecost | traefik |
| prometheus | traefik |
| prometheusadapter | prometheus |
| reloader |  |
| traefik | cert-manager, reloader |
| traefik-forward-auth | traefik |

See the following sections for more information about the workspace platform services.

### Foundational Components

The foundational components are essential and provide the foundation for all platform service capabilities and deployments on managed clusters. You must enable these components to be able to enable any other platform service.

The foundational components are comprised of the Kubeaddons controller and the following platform services: cert-manager, kube-oidc-proxy, reloader, traefik, and traefik-forward-auth.

- Kubeaddons controller: Manages the installation of platform services
- [cert-manager][cert-manager]: Certificate management controller that automates TLS certificate management and issuance
- [kube-oidc-proxy][kube-oidc-proxy]: A reverse proxy server that authenticates users using OIDC to Kubernetes API servers where OIDC authentication is not available
- [reloader][reloader]: A controller that watches changes on ConfigMaps and Secrets, and automatically triggers updates on the dependent applications
- [traefik][traefik]: An HTTP reverse proxy and load balancer
- [traefik-forward-auth][traefik-forward-auth]: A minimal forward authentication service that provides OAuth/SSO login and authentication for traefik

| **Platform Service** | **Dependencies** |
| --- | --- |
| cert-manager |  |
| kube-oidc-proxy | cert-manager, traefik |
| reloader |  |
| traefik | cert-manager, reloader |
| traefik-forward-auth | traefik |

### Logging

These platform services provide the functionality to collect logs over time from Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize and query the aggregated logs.

- [elasticsearch][elasticsearch]: A distributed, RESTful search and analytics engine
- [elasticsearchexporter][elasticsearchexporter]: A Prometheus exporter for various Elasticsearch metrics
- [fluentbit][fluentbit]: A log processor that collects metrics and log data from different sources, enriches them with filters, and forwards them to multiple destinations.
- [kibana][kibana]: A user interface that provides search and data visualization capabilities for data indexed in Elasticsearch

|  **Platform Service** | **Dependencies** |
| --- | --- |
| elasticsearch |  |
| elasticsearch-curator | elasticsearch |
| elasticsearchexporter | elasticsearch |
| fluentbit | elasticsearch |
| kibana | elasticsearch, traefik |

### Monitoring

These platform services provide monitoring capabilities by collecting metrics, including cost metrics, for Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize these metrics and evaluate rule expressions to trigger alerts.

- [prometheus][prometheus]: A systems and service monitoring system that collects metrics from configured targets at given intervals, evaluates rule expressions, displays the results, and triggers alerts when specified conditions are observed. **Note:** Prometheus Alertmanager and Grafana are included in the Prometheus bundled installation.
- [prometheus-adapter][prometheus-adapter]: Exposes custom application metrics from Prometheus
- [kubecost][kubecost]: A cost-monitoring tool that gives you visibility into your Kubernetes resources to reduce spend and prevent resource-based outages

|  **Platform Service** | **Dependencies** |
| --- | --- |
| kubecost | traefik |
| prometheus | traefik |
| prometheusadapter | prometheus |


## Related information

- [Kommander security architecture][kommander-security]
- [Centralized cost monitoring][kommander-kubecost]
- [Centralized monitoring][kommander-monitoring]
- [Traefik ingress controller][konvoy-ingress]
- [Monitoring and alerts][konvoy-monitoring]
- [Logging and audits][konvoy-logging]

[cert-manager]: https://cert-manager.io/docs
[elasticsearch]: https://www.elastic.co/elasticsearch
[elasticsearchexporter]: https://github.com/justwatchcom/elasticsearch_exporter
[fluentbit]: https://fluentbit.io
[kibana]: https://www.elastic.co/kibana
[kommander-kubecost]: /dkp/kommander/1.4/centralized-cost-monitoring/
[kommander-monitoring]: /dkp/kommander/1.4/centralized-monitoring/
[kommander-security]: /dkp/kommander/1.4/security/
[konvoy-ingress]: /dkp/konvoy/1.8/networking/ingress/
[konvoy-logging]: /dkp/konvoy/1.8/logging/
[konvoy-monitoring]: /dkp/konvoy/1.8/monitoring/
[kube-oidc-proxy]: https://github.com/jetstack/kube-oidc-proxy
[kubecost]: https://kubecost.com
[prometheus]: https://prometheus.io
[prometheus-adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[reloader]: https://github.com/stakater/Reloader
[traefik]: https://traefik.io/
[traefik-forward-auth]: https://github.com/thomseddon/traefik-forward-auth
[workspace-platform-service]: /dkp/kommander/1.4/workspaces/workspace-platform-services/
