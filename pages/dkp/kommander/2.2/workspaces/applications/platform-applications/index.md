---
layout: layout.pug
navigationTitle: Workspace Platform Applications
title: Workspace Platform Applications
menuWeight: 30
excerpt: How workspace platform applications work
---

When attaching a cluster, Kommander deploys certain platform applications on the newly attached cluster. Operators can use the DKP UI to customize which platform applications to deploy to the attached clusters in a given workspace.

Currently, the monitoring stack is deployed by default. The logging stack is not.

Review the [workspace platform application resource requirements](./platform-application-requirements/) to ensure that the attached clusters have sufficient resources.

### Customize a workspace's applications

You can customize the applications that are deployed to a workspace's clusters using the DKP UI. Access the applications page by going to the specific workspace, then opening the **Applications** page from the sidebar menu.

This takes you to the **Applications** page which displays all applications that can be deployed or uninstalled.

To use the CLI to deploy or uninstall applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="./platform-application-dependencies/">in the workspace platform application dependencies</a> documentation. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Workspace platform applications

The following table describes the list of platform applications that are deployed on attachment:

| NAME                          | APP ID                | Deployed by default |
| ----------------------------- | --------------------- | ------------------- |
| cert-manager-1.7.1            | cert-manager          | True                |
| external-dns-6.1.8            | external-dns          | False               |
| fluent-bit-0.19.20            | fluent-bit            | False               |
| gatekeeper-3.7.0              | gatekeeper            | False               |
| grafana-logging-6.22.0        | grafana-logging       | False               |
| grafana-loki-0.33.2           | grafana-loki          | False               |
| istio-1.11.6                  | istio                 | False               |
| jaeger-2.29.0                 | jaeger                | False               |
| kiali-2.0.1                   | kiali                 | False               |
| kube-oidc-proxy-0.3.1         | kube-oidc-proxy       | True                |
| kube-prometheus-stack-33.1.5  | kube-prometheus-stack | True                |
| kubecost-0.23.3               | kubecost              | True                |
| kubernetes-dashboard-5.1.1    | kubernetes-dashboard  | True                |
| logging-operator-3.17.2       | logging-operator      | False               |
| metallb-0.12.3                | metallb               | False               |
| minio-operator-4.4.10         | minio-operator        | False               |
| nvidia-0.4.4                  | nvidia                | False               |
| prometheus-adapter-2.17.1     | prometheus-adapter    | True                |
| reloader-0.0.104              | reloader              | True                |
| traefik-10.9.1                | traefik               | True                |
| traefik-forward-auth-0.3.6    | traefik-forward-auth  | True                |
| velero-3.1.5                  | velero                | False               |

<p class="message--note"><strong>NOTE: </strong>Currently, Kommander only supports a single deployment of <code>cert-manager</code> per cluster. Because of this, <code>cert-manager</code> cannot be installed on <code>Konvoy</code> managed <code>AWS</code> clusters.</p>

<p class="message--note"><strong>NOTE: </strong>Only a single deployment of <code>traefik</code> per cluster is supported.</p>

<p class="message--note"><strong>NOTE: </strong>Kommander automatically manages the deployment of <code>traefik-forward-auth</code> and <code>kube-oidc-proxy</code> when clusters are attached to the workspace. These applications are not shown in the DKP UI.</p>
