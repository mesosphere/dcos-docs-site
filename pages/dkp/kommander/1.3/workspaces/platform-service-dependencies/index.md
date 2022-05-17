---
layout: layout.pug
beta: false
navigationTitle: Workspace Platform Service Dependencies
title: Workspace Platform Service Dependencies
menuWeight: 8
excerpt: Dependencies between workspace platform services
---

There are many dependencies between the platform services that are federated to a workspace's attached clusters. It is important to note these dependencies when customizing the workspace platform services to ensure that they are deployed properly to the clusters. For more information on how to customize workspace platform services, see [Workspace Platform Services](/dkp/kommander/1.3/workspaces/workspace-platform-services/).

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

The foundational components are essential and provide the foundation for all platform service capabilities and deployments on managed clusters. You must enable these components to be able to enable any other platform services.

The foundational components are comprised of the Kubeaddons controller and the following platform services: cert-manager, kube-oidc-proxy, reloader, traefik, and traefik-forward-auth.

- Kubeaddons controller: Manages the installation of platform services
- [cert-manager](https://cert-manager.io/docs): Certificate management controller that automates TLS certificate management and issuance
- [kube-oidc-proxy](https://github.com/jetstack/kube-oidc-proxy): A reverse proxy server that authenticates users using OIDC to Kubernetes API servers where OIDC authentication is not available
- [reloader](https://github.com/stakater/Reloader): A controller that watches changes on ConfigMaps and Secrets, and automatically triggers updates on the dependent applications
- [traefik](https://traefik.io/): An HTTP reverse proxy and load balancer
- [traefik-forward-auth](https://github.com/thomseddon/traefik-forward-auth): A minimal forward authentication service that provides OAuth/SSO login and authentication for traefik

| **Platform Service** | **Dependencies** |
| --- | --- |
| cert-manager |  |
| kube-oidc-proxy | cert-manager, traefik |
| reloader |  |
| traefik | cert-manager, reloader |
| traefik-forward-auth | traefik |

### Logging

These platform services provide the functionality to collect logs over time from Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize and query the aggregated logs.

- [elasticsearch](https://www.elastic.co/elasticsearch): A distributed, RESTful search and analytics engine
- [elasticsearch-curator](https://www.elastic.co/guide/en/elasticsearch/client/curator/current/about.html): Helps you curate, or manage, your Elasticsearch indices and snapshots
- [elasticsearchexporter](https://github.com/justwatchcom/elasticsearch_exporter): A Prometheus exporter for various metrics about Elasticsearch
- [fluentbit](https://fluentbit.io): A log processor and forwarder which allows you to collect any data like metrics and logs from different sources, enrich them with filters and send them to multiple destinations
- [kibana](https://www.elastic.co/kibana): A user interface that provides search and data visualization capabilities for data indexed in Elasticsearch

|  **Platform Service** | **Dependencies** |
| --- | --- |
| elasticsearch |  |
| elasticsearch-curator | elasticsearch |
| elasticsearchexporter | elasticsearch |
| fluentbit | elasticsearch |
| kibana | elasticsearch, traefik |

### Monitoring

These platform services provide monitoring capabilities by collecting metrics, including cost metrics, for Kubernetes, platform services, and applications deployed on managed clusters. They also provide the ability to visualize these metrics and evaluate rule expressions to trigger alerts.

- [prometheus](https://prometheus.io): A systems and service monitoring system that collects metrics from configured targets at given intervals, evaluates rule expressions, displays the results, and can trigger alerts when specified conditions are observed. Note: Prometheus Alertmanager and Grafana are included in the Prometheus bundled installation.
- [prometheus-adapter](https://github.com/DirectXMan12/k8s-prometheus-adapter): Exposes custom application metrics from Prometheus
- [kubecost](https://kubecost.com): A cost-monitoring tool that gives you visibility into your Kubernetes resources to reduce spend and prevent resource-based outages

|  **Platform Service** | **Dependencies** |
| --- | --- |
| kubecost | traefik |
| prometheus | traefik |
| prometheusadapter | prometheus |


## Related information

- [Kommander security architecture](/dkp/kommander/1.3/security/)
- [Centralized cost monitoring](/dkp/kommander/1.3/centralized-cost-monitoring/)
- [Centralized monitoring](/dkp/kommander/1.3/centralized-monitoring/)
- [Traefik ingress controller](/dkp/konvoy/1.7/networking/ingress/)
- [Monitoring and alerts](/dkp/konvoy/1.7/monitoring/)
- [Logging and audits](/dkp/konvoy/1.7/logging/)
