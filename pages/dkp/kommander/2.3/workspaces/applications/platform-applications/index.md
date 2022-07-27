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

When deploying and upgrading applications, platform applications come as a bundle; they are tested as a single unit and you must deploy or upgrade them in a single process, for each workspace. This means all clusters in a workspace have the same set and versions of platform applications deployed.

### Customize a workspace's applications

You can customize the applications that are deployed to a workspace's clusters using the DKP UI:

1.  From the top menu bar, select your target workspace.

1.  Select **Applications** from the sidebar menu to browse all applications that can be deployed or uninstalled.

To use the CLI to deploy or uninstall applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="./platform-application-dependencies/">in the workspace platform application dependencies</a> documentation. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Workspace platform applications

The following table describes the list of platform applications that are deployed on attachment:

| Common Name           | APP NAME                      | APP ID                | Deployed by default |
|-----------------------| ----------------------------- | --------------------- | ------------------- |
| Cert Manager          | cert-manager-1.7.1            | cert-manager          | True                |
| External DNS          | external-dns-6.5.5            | external-dns          | False               |
| Fluent Bit            | fluent-bit-0.19.20            | fluent-bit            | False               |
| Gatekeeper            | gatekeeper-3.8.1              | gatekeeper            | True                |
| Grafana Logging       | grafana-logging-6.28.0        | grafana-logging       | False               |
| Grafana Loki          | grafana-loki-0.48.4           | grafana-loki          | False               |
| Istio                 | istio-1.14.1                  | istio                 | False               |
| Jaeger                | jaeger-2.32.2                 | jaeger                | False               |
| Kiali                 | kiali-1.52.0                  | kiali                 | False               |
| Kube OIDC Proxy       | kube-oidc-proxy-0.3.1         | kube-oidc-proxy       | True                |
| Kube Prometheus Stack | kube-prometheus-stack-34.9.3  | kube-prometheus-stack | True                |
| Kubecost              | kubecost-0.26.0               | kubecost              | True                |
| Kubernetes Dashboard  | kubernetes-dashboard-5.1.1    | kubernetes-dashboard  | True                |
| Logging Operator      | logging-operator-3.17.7       | logging-operator      | False               |
| Minio                 | minio-operator-4.4.25         | minio-operator        | False               |
| Nvidia                | nvidia-0.4.4                  | nvidia                | False               |
| Prometheus Adapter    | prometheus-adapter-2.17.1     | prometheus-adapter    | True                |
| Reloader              | reloader-0.0.110              | reloader              | True                |
| Traefik               | traefik-10.9.1                | traefik               | True                |
| Traefik ForwardAuth   | traefik-forward-auth-0.3.8    | traefik-forward-auth  | True                |
| Velero                | velero-3.2.3                  | velero                | False               |

<p class="message--note"><strong>NOTE: </strong>Currently, Kommander only supports a single deployment of <code>cert-manager</code> per cluster. Because of this, <code>cert-manager</code> cannot be installed on <code>Konvoy</code> managed <code>AWS</code> clusters.</p>

<p class="message--note"><strong>NOTE: </strong>Only a single deployment of <code>traefik</code> per cluster is supported.</p>

<p class="message--note"><strong>NOTE: </strong>Kommander automatically manages the deployment of <code>traefik-forward-auth</code> and <code>kube-oidc-proxy</code> when clusters are attached to the workspace. These applications are not shown in the DKP UI.</p>

<p class="message--note"><strong>NOTE: </strong>Applications are enabled in DKP and then deployed to attached clusters. To confirm that your enabled application has successfully deployed, you should <a href="../platform-applications/application-deployment#verify-applications">verify via the CLI</a>.</p>

## Upgrade Platform applications from the CLI

The [DKP upgrade](../../../dkp-upgrade) process deploys and upgrades Platform applications as a bundle for each cluster or workspace. For the Management Cluster or workspace, DKP upgrade handles all Platform applications; no other steps are necessary to upgrade the Platform application bundle. However, for managed or attached clusters or workspaces, you MUST manually upgrade the Platform applications bundle with the following command.

<p class="message--warning"><strong>WARNING: </strong>If you are upgrading your Platform applications as part of the <a href="../../../dkp-upgrade">DKP upgrade</a>, upgrade your Platform applications on any additional Workspaces before proceeding with the Konvoy upgrade. Some applications in the previous release are not compatible with the <a href="../../../release-notes/">Kubernetes version</a> of this release, and upgrading Kubernetes is part of the DKP Konvoy upgrade process.
</p>

Use this command to upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster:

```bash
dkp upgrade workspace WORKSPACE_NAME [--dry-run] [flags]
```
