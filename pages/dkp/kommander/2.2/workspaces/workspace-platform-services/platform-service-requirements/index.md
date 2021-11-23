---
layout: layout.pug
navigationTitle: Workspace Platform Application Configuration Requirements
title: Workspace Platform Application Configuration Requirements
menuWeight: 40
excerpt: Workspace Platform Application Descriptions and Resource Requirements
enterprise: false
draft: true
---
## Workspace Platform Application Requirements

Workspace platform applications require more resources than solely deploying or attaching clusters into a workspace. Your cluster must have sufficient resources when deploying or attaching to ensure that the platform services are installed successfully.

The following table describes all the workspace platform applications that are available to the clusters in a workspace, minimum resource requirements, and whether they are enabled by default.

| Name | Minimum Resources Suggested | Minimum Persistent Storage Required | Deployed by Default |
| --- | --- | --- | --- |
| cert-manager| cpu: 10m<br />memory: 32Mi |  | Yes |
| fluentbit | cpu: 350m<br />memory: 350Mi |  | No |
| gatekeeper |  |  | Yes |
| grafana-logging | cpu: 200m<br />memory: 100Mi |  | No |
| grafana-loki | cpu: 200m<br />memory: 100Mi | # of PVs: 4<br />PV sizes: 10Gi x 4 (total: 40Gi) | No |
| kube-prometheus-stack | cpu: 1210m<br />memory: 4150Mi | # of PVs: 1<br />PV sizes: 100Gi | Yes |
| kube-oidc-proxy |  |  | Yes |
| kubecost | cpu: 700m<br />memory: 1700Mi | # of PVs: 3<br />PV sizes: 2Gi, 32Gi, 32Gi (total: 66Gi) | Yes |
| kubernetes-dashboard | cpu: 250m<br />memory: 300Mi |  | Yes |
| logging-operator | cpu: 600m<br />memory: 228Mi |  | No |
| minio-operator |  |  | No |
| nvidia | cpu: 100m<br />memory: 128Mi |  | No |
| prometheus-adapter | cpu: 1000m<br />memory: 1000Mi |  | Yes |
| reloader | cpu: 100m<br />memory: 128Mi |  | Yes |
| traefik | cpu: 500m |  | Yes |
| traefik-forward-auth | cpu: 100m<br />memory: 128Mi |  | Yes |
| velero | cpu: 750m<br />memory: 512Mi | # of PVs: 1<br />PV sizes: 10Gi | No |
