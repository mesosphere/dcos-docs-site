---
layout: layout.pug
beta: true
navigationTitle: Federated Platform Services
title: Federated Platform Services
menuWeight: 5
excerpt: How federated platform services work
---

## Platform services federation

When attaching a cluster, Kommander federates certain platform services on the newly attached cluster. Operators can use the Kommander UI to customize which platform services to federate to the attached clusters in a given workspace.

On attachment, two factors impact successfully deploying an addon on the attached cluster:

1. Is the attached cluster a Konvoy cluster or not? For example, a cluster deployed using AWS EKS.
2. Is the addon enabled in the Workspace Platform Services settings?
3. Does the addon support the version of Kubernetes running on the cluster?

The following tables describe the list of platform services and cluster platform services that get federated on attachment along with the versions of Kubernetes that they support. If the cluster is running a version of Kubernetes that is not in the supported list, then the platform service will not get federated to that cluster. If the addon description indicates only federated on non-Konvoy clusters, the addon will not get installed into Konvoy clusters, since it is by default installed with Konvoy via Kubernetes Base Addons.

Currently, the monitoring stack is federated by default and the logging stack is not.

### Customize a workspace's platform services

Provided you have access to edit a workspace, you can customize the platform services that are federated to a workspace's clusters using the Kommander UI. You can access this settings page by going to the desired workspace's Dashboard tab, clicking the `Actions` drop-down button and selecting `Edit Workspace Platform Services`.

<insert .png of this page with highlighted Actions tab>

This takes you to the settings page which provides lists of platform services that you can enable or disable along with some helpful descriptions.

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the platform services, which are listed [here][]. Please carefully look them over prior to customizing to ensure that the platform services are deployed smoothly.</p>

If desired, the Kubeaddons Controller can also be turned off, though it is discouraged. All platform services require the controller in order to be installed properly. You can find the setting to turn the controller off at the bottom of the page underneath the `Foundational Components` header.

## Federated platform services

| Name                                 | Federated by default | Kubernetes Versions Supported | Only federated on non-Konvoy clusters |
| ------------------------------------ | -------------------- | ----------------------------- | ------------------------------------- |
| elasticsearch                        | False                | 1.17 - 1.19                   | True                                  |
| elasticsearch-curator                | False                | 1.17 - 1.19                   | True                                  |
| elasticsearchexporter                | False                | 1.17 - 1.19                   | True                                  |
| fluentbit                            | False                | 1.17 - 1.19                   | True                                  |
| kibana                               | False                | 1.17 - 1.19                   | True                                  |
| kube-oidc-proxy-kommander            | True                 | 1.17 - 1.19                   | False                                 |
| prometheus                           | True                 | 1.17 - 1.19                   | True                                  |
| prometheusadapter                    | True                 | 1.17 - 1.19                   | True                                  |
| reloader                             | True                 | 1.17 - 1.19                   | True                                  |
| traefik-forward-auth-kommander       | True                 | 1.17 - 1.19                   | False                                 |

## Federated cluster platform services

| Name           | Federated by default | Kubernetes Versions Supported | Only federated on non-Konvoy clusters |
| -------------- | -------------------- | ----------------------------- | ------------------------------------- |
| - cert-manager | True                 | 1.17 - 1.19                   | True                                  |
| - kubecost     | True                 | 1.17 - 1.19                   | False                                 |
| - traefik      | True                 | 1.17 - 1.19                   | True                                  |
