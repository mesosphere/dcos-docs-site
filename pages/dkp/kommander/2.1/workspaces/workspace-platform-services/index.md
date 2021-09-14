---
layout: layout.pug
navigationTitle: Workspace Platform Applications
title: Workspace Platform Applications
menuWeight: 30
excerpt: How workspace platform applications work
---


When attaching a cluster, Kommander deploys certain platform applications on the newly attached cluster. Operators can use the Kommander UI to customize which platform applications to deploy to the attached clusters in a given workspace.

The following table describes the list of platform applications that are deployed on attachment.

Currently, the monitoring stack is deployed by default. The logging stack is not.

<!-- # This page not yet updated
Review the [workspace platform service resource requirements](./platform-service-requirements/) to ensure that the attached clusters have sufficient resources.
-->

### Customize a workspace's applications

You can customize the applications that are deployed to a workspace's clusters using the Kommander UI. Access the applications page by going to the specific workspace, then opening the **Applications** page from the sidebar menu.

This takes you to the **Applications** page which displays all applications that can be deployed or uninstalled.

To use the CLI to deploy or uninstall applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="./platform-service-dependencies/">here</a>. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Workspace platform applications

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
| kiali-1.29.1                  | kiali                 | False               |
| kube-oidc-proxy-0.2.5         | kube-oidc-proxy       | False               |
| kube-prometheus-stack-16.13.1 | kube-prometheus-stack | True                |
| kubecost-0.17.2               | kubecost              | True                |
| kubernetes-dashboard-4.0.3    | kubernetes-dashboard  | True                |
| logging-operator-3.13.0       | logging-operator      | False               |
| metallb-0.12.2                | metallb               | False               |
| minio-operator-4.1.7          | minio-operator        | False               |
| nvidia-0.4.2                  | nvidia                | False               |
| prometheus-adapter-2.11.1     | prometheus-adapter    | True                |
| reloader-0.0.99               | reloader              | True                |
| traefik-10.3.0                | traefik               | True                |
| traefik-forward-auth-0.3.2    | traefik-forward-auth  | True                |
| velero-3.1.3                  | velero                | False               |

<p class="message--note"><strong>NOTE: </strong>Currently, Kommander only supports a single deployment of <code>cert-manager</code> per cluster. Because of this, <code>cert-manager</code> cannot be installed on <code>Konvoy</code> managed <code>AWS</code> clusters.</p>

<p class="message--note"><strong>NOTE: </strong>Only a single deployment of <code>traefik</code> per cluster is supported.</p>

<p class="message--note"><strong>NOTE: </strong>Kommander automatically manages the deployment of <code>traefik-forward-auth</code> when clusters are attached to the workspace. This application is not shown in the Kommander UI.</p>
