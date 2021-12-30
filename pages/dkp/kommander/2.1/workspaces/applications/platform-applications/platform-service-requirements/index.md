---
layout: layout.pug
navigationTitle: Workspace Platform Application Configuration Requirements
title: Workspace Platform Application Configuration Requirements
menuWeight: 40
excerpt: Workspace Platform Application Descriptions and Resource Requirements
enterprise: false
draft: true
---

## Workspace platform application requirements

Workspace platform applications require more resources than solely deploying or attaching clusters into a workspace. Your cluster must have sufficient resources when deploying or attaching to ensure that the platform services are installed successfully.

The following table describes all the workspace platform applications that are available to the clusters in a workspace, minimum resource requirements, and whether they are enabled by default.

| Name                  | Minimum Resources Suggested                    | Minimum Persistent Storage Required                                        | Deployed by Default |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- | ------------------- |
| cert-manager          | <p>cpu: 10m<br />memory: 32Mi </p>     |                                                                            | Yes                 |
| reloader              | <p>cpu: 100m<br />memory: 128Mi </p>   |                                                                            | Yes                 |
| traefik               | cpu: 500m                                      |                                                                            | Yes                 |
| kubecost              | <p>cpu: 700m<br />memory: 1700Mi</p>  | <p># of PVs: 3<br />PV sizes: 0.2Gi, 2Gi, 32Gi (total: 34.2Gi)</p> | Yes                 |
| kube-prometheus-stack | <p>cpu: 300m<br />memory: 1500Mi </p>  | <p># of PVs: 1<br />PV sizes: 50Gi </p>                            | Yes                 |
| kube-oidc-proxy       |                                                |                                                                            |                     |
| prometheusadapter     | <p>cpu: 1000m<br />memory: 1000Mi </p> |                                                                            | Yes                 |
| kubernetes-dashboard  |                                                |                                                                            | Yes                 |
| nvidia                |                                                |                                                                            | No                  |
| logging-operator      |                                                |                                                                            | No                  |
| grafana-loki          |                                                |                                                                            | No                  |
| grafana-logging       |                                                |                                                                            | No                  |
| fluentbit             | <p>cpu: 350m<br />memory: 350Mi </p>       |                                                                            | No                  |
| minio-operator        |                                                |                                                                            | No                  |
| gatekeeper            |                                                |                                                                            | No                  |
| kube-oidc-proxy       |                                                |                                                                            | Yes                 |
| traefik               |                                                |                                                                            |                     |
| traefik-forward-auth  | <p>cpu: 100m<br />memory: 128Mi </p>   |                                                                            | Yes                 |
| velero                |                                                |                                                                            | No                  |
