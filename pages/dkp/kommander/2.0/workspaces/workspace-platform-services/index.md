---
layout: layout.pug
navigationTitle: Workspace Platform Services
title: Workspace Platform Services
menuWeight: 30
excerpt: How workspace platform services work
draft: true
---


When attaching a cluster, Kommander federates certain platform services on the newly attached cluster. Operators can use the Kommander UI to customize which platform services to deploy to the attached clusters in a given workspace.

On attachment, three factors impact successfully deploying a platform service on the attached cluster:

1. Is the attached cluster a Konvoy cluster or not? For example, a cluster deployed using AWS EKS.
2. Is the platform service enabled in the Workspace Platform Services settings?
3. Does the platform service support the version of Kubernetes running on the cluster?

The following tables describe the list of platform services that are federated on attachment, along with the versions of Kubernetes that they support. If the cluster is running a version of Kubernetes that is not in the supported list, the platform service is not federated to that cluster.

Currently, the monitoring stack is federated by default and the logging stack is not.

Review the [workspace platform service resource requirements](./platform-service-requirements/) to ensure that the attached clusters have sufficient resources.

### Customize a workspace's platform services

If you have access to edit a workspace, you can customize the platform services that are federated to a workspace's clusters using the Kommander UI. Access the settings page by going to the specific workspace's **Dashboard** page, locating the Workspace card, selecting the **Actions** drop-down button and selecting **Edit Workspace Platform Services**. You can also go to the Workspace Dashboard's **Actions** menu button to access the settings page.

This takes you to the settings page which provides lists of platform services that you can enable or disable along with descriptions of the services.

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the platform services, which are listed <a href="./platform-service-dependencies/">here</a>. Please review them carefully prior to customizing to ensure that the platform services are deployed successfully.</p>

Platform services support a specific set of Kubernetes versions running on the attached cluster. See the column `Kubernetes Versions Supported` in the below chart for supported Kubernetes versions per platform service. Platform services will not be deployed to clusters running Kubernetes versions outside of those listed.

If desired, the Kubeaddons Controller can also be disabled, though it is highly discouraged. All platform services require the controller in order to be installed properly. You can find the setting to turn the controller off at the bottom of the page underneath the `Foundational Components` header. Disabling the controller will automatically disable all platform services.

## Workspace platform services

| Name                                 | Federated by default | Supported Kubernetes Versions |
| ------------------------------------ | -------------------- | ----------------------------- |
| cert-manager                         | True                 | 1.16 - 1.20                   |
| elasticsearch                        | False                | 1.16 - 1.20                   |
| elasticsearch-curator                | False                | 1.16 - 1.20                   |
| elasticsearchexporter                | False                | 1.16 - 1.20                   |
| fluentbit                            | False                | 1.16 - 1.20                   |
| kibana                               | False                | 1.16 - 1.20                   |
| kube-oidc-proxy-kommander            | True                 | 1.16 - 1.20                   |
| kubecost                             | True                 | 1.16 - 1.20                   |
| prometheus                           | True                 | 1.16 - 1.20                   |
| prometheusadapter                    | True                 | 1.16 - 1.20                   |
| reloader                             | True                 | 1.16 - 1.20                   |
| traefik                              | True                 | 1.16 - 1.20                   |
| traefik-forward-auth-kommander       | True                 | 1.16 - 1.20                   |
