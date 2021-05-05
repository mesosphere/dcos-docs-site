---
layout: layout.pug
navigationTitle: Workspace Platform Service Configuration Requirements
title: Workspace Platform Service Configuration Requirements
menuWeight: 7
excerpt: Workspace Platform Service Descriptions and Resource Requirements
beta: false
enterprise: false
---

## Workspace Platform Service Requirements

Workspace platform services require more resources than solely deploying or attaching clusters into a workspace. Your cluster must have sufficient resources when  deploying or attaching to ensure that the platform services are installed successfully.

The following table describes all the workspace platform services that are available to the clusters in a workspace, minimum resource requirements, and whether they are enabled by default.

<table>
  <tr>
   <td><strong>Name</strong>
   </td>
   <td><strong>Minimum Resources Suggested</strong>
   </td>
   <td><strong>Minimum Persistent Storage Required</strong>
   </td>
   <td><strong>Federated by Default</strong>
   </td>
  </tr>
  <tr>
   <td>cert-manager
   </td>
   <td>cpu: 10m
<p>
memory: 32Mi
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>elasticsearch
   </td>
   <td>cpu: 4.6
<p>
memory: 21Gi
   </td>
   <td># of PVs: 7
<p>
PV sizes: 4Gi x 3, 30Gi x 4 (total: 132Gi)
   </td>
   <td>No
   </td>
  </tr>
  <tr>
   <td>elasticsearch-curator
   </td>
   <td>cpu: 100m
<p>
memory: 128Mi
   </td>
   <td>
   </td>
   <td>No
   </td>
  </tr>
  <tr>
   <td>elasticsearchexporter
   </td>
   <td>cpu: 100m
<p>
memory: 128Mi
   </td>
   <td>
   </td>
   <td>No
   </td>
  </tr>
  <tr>
   <td>fluentbit
   </td>
   <td>cpu: 350m
<p>
memory: 350Mi
   </td>
   <td>
   </td>
   <td>No
   </td>
  </tr>
  <tr>
   <td>kibana
   </td>
   <td>cpu: 100m
   </td>
   <td>
   </td>
   <td>No
   </td>
  </tr>
  <tr>
   <td>kube-oidc-proxy
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>kubecost
   </td>
   <td>cpu: 700m
<p>
memory: 1700Mi
   </td>
   <td># of PVs: 3
<p>
PV sizes: 0.2Gi, 2Gi, 32Gi (total: 34.2Gi)
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>prometheus
   </td>
   <td>cpu: 300m
<p>
memory: 1500Mi
   </td>
   <td># of PVs: 1
<p>
PV sizes: 50Gi
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>prometheusadapter
   </td>
   <td>cpu: 1000m
<p>
memory: 1000Mi
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>reloader
   </td>
   <td>cpu: 100m
<p>
memory: 128Mi
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>traefik
   </td>
   <td>cpu: 500m
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>traefik-forward-auth
   </td>
   <td>cpu: 100m
<p>
memory: 128Mi
   </td>
   <td>
   </td>
   <td>Yes
   </td>
  </tr>
</table>
