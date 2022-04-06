---
layout: layout.pug
navigationTitle: Management cluster application requirements
title: Management cluster application requirements
menuWeight: 40
excerpt: Management cluster application minimum resources and storage requirements
beta: false
enterprise: true
---

This section details requirements for management cluster-specific applications. For the list of all available platform applications, see [Platform Application Configuration Requirements](../../workspaces/applications/platform-applications/platform-application-requirements/).

This table describes the workspace platform applications specific to the management cluster, minimum resource requirements, and minimum persistent storage requirements.

| Name                    | Minimum Resources Suggested  | Minimum Persistent Storage Required                       | Deployed by Default |
|-------------------------|------------------------------|-----------------------------------------------------------|---------------------|
| cert-manager            | cpu: 10m<br>memory: 32Mi     |                                                           | Yes                 |
| reloader                | cpu: 100m<br>memory: 128Mi   |                                                           | Yes                 |
| traefik                 | cpu: 500m                    |                                                           | Yes                 |
| kubecost                | cpu: 700m<br>memory: 1700Mi  | # of PVs: 3<br>PV sizes: 0.2Gi, 2Gi, 32Gi (total: 34.2Gi) | Yes                 |
| kube-prometheus-stack   | cpu: 300m<br>memory: 1500Mi  | # of PVs: 1<br>PV sizes: 50Gi                             | Yes                 |
| kube-oidc-proxy         |                              |                                                           | Yes                |
| prometheusadapter       | cpu: 1000m<br>memory: 1000Mi |                                                           | Yes                 |
| kubernetes-dashboard    |                              |                                                           | Yes                 |
| nvidia                  |                              |                                                           | No                  |
| logging-operator        |                              |                                                           | No                  |
| grafana-loki            |                              |                                                           | No                  |
| grafana-logging         |                              |                                                           | No                  |
| fluentbit               | cpu: 350m<br>memory: 350Mi   |                                                           | No                  |
| minio-operator          |                              |                                                           | No                  |
| gatekeeper              |                              |                                                           | No                  |
| kube-oidc-proxy         |                              |                                                           | Yes                 |
| traefik                 |                              |                                                           | Yes                 |
| traefik-forward-auth    | cpu: 100m<br>memory: 128Mi   |                                                           | Yes                 |
| velero                  |                              |                                                           | Yes                 |
| kubetunnel              | 0.0.8                        |                                                           |                     |
| logging-operator        | 3.15.0                       |                                                           |                     |
| metallb                 | 0.12.2                       |                                                           |                     |
| minio-operator          | 4.1.7                        |                                                           |                     |
| nfs-server-provisioner  | 0.6.0                        |                                                           |                     |
| nvidia                  | 0.4.3                        |                                                           |                     |
| project-grafana-logging | 6.16.14                      |                                                           |                     |
| project-grafana-loki    | 0.33.1                       |                                                           |                     |
| project-logging         | 1.0.0                        |                                                           |                     |
| prometheus-adapter      | 2.11.1                       |                                                           |                     |
| reloader                | 0.0.99                       |                                                           |                     |
| thanos                  | 0.4.5                        |                                                           |                     |
| traefik                 | 10.3.0                       |                                                           |                     |
| traefik-forward-auth    | 0.3.2                        |                                                           |                     |
| velero                  | 3.1.1                        |                                                           |                     |
