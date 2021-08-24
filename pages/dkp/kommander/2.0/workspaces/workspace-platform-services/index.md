---
layout: layout.pug
navigationTitle: Workspace Platform Services
title: Workspace Platform Services
menuWeight: 30
excerpt: How workspace platform services work
---


When attaching a cluster, Kommander deploys certain platform services on the newly attached cluster. Operators can use the Kommander UI to customize which platform services to deploy to the attached clusters in a given workspace.

The following table describes the list of platform services that are deployed on attachment.

Currently, the monitoring stack is deployed by default. The logging stack is not.

<!-- # This page not yet updated
Review the [workspace platform service resource requirements](./platform-service-requirements/) to ensure that the attached clusters have sufficient resources.
-->

### Customize a workspace's platform services

If you have access to edit a workspace, you can customize the platform services that are deployed to a workspace's clusters using the Kommander UI. Access the settings page by going to the specific workspace's **Dashboard** page, locating the Workspace card, selecting the **Actions** drop-down button and selecting **Edit Workspace Platform Services**. You can also go to the Workspace Dashboard's **Actions** menu button to access the settings page.

This takes you to the settings page which displays a list of platform services you can enable or disable along with descriptions of the services.

To use the CLI to enable or disable applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the platform services, which are listed <a href="./platform-service-dependencies/">here</a>. Review them carefully prior to customizing to ensure that the platform services are deployed successfully.</p>

## Workspace platform services

| NAME                          | APP ID                | Deployed by default |
| ----------------------------- | --------------------- | ------------------- |
| cert-manager-0.2.7            | cert-manager          | True                |
| external-dns-2.20.5           | external-dns          | False               |
| fluent-bit-0.16.2             | fluent-bit            | False               |
| gatekeeper-0.6.8              | gatekeeper            | False               |
| grafana-logging-6.13.9        | grafana-logging       | False               |
| grafana-loki-0.33.1           | grafana-loki          | False               |
| istio-1.9.1                   | istio                 | False               |
| jaeger-2.21.0                 | jaeger                | False               |
| kiali-1.29.0                  | kiali                 | False               |
| kube-oidc-proxy-0.2.5         | kube-oidc-proxy       | False               |
| kube-prometheus-stack-16.13.1 | kube-prometheus-stack | True                |
| kubecost-0.17.0               | kubecost              | True                |
| kubernetes-dashboard-4.0.3    | kubernetes-dashboard  | True                |
| logging-operator-3.13.0       | logging-operator      | False               |
| metallb-0.12.2                | metallb               | False               |
| minio-operator-4.1.7          | minio-operator        | False               |
| nvidia-0.4.0                  | nvidia                | False               |
| prometheus-adapter-2.11.1     | prometheus-adapter    | True                |
| reloader-0.0.85               | reloader              | True                |
| traefik-10.3.0                | traefik               | True                |
| traefik-forward-auth-0.3.2    | traefik-forward-auth  | True                |
| velero-3.1.3                  | velero                | False               |

<p class="message--note"><strong>NOTE: </strong>Currently, Kommander only supports a single deployment of <code>cert-manager</code> per cluster. Because of this, <code>cert-manager</code> cannot be installed on <code>Konvoy</code> managed <code>AWS</code> clusters.</p>

<p class="message--note"><strong>NOTE: </strong>Only a single deployment of <code>traefik</code> per cluster is supported.</p>
