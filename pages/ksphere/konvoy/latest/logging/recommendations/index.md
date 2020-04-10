---
layout: layout.pug
navigationTitle: Recommendations
title: Recommendations
menuWeight: 11
excerpt: Recommended settings for monitoring and collecting metrics for Kubernetes, platform services, and applications deployed on the Konvoy cluster
---

At D2iQ, we conduct routine performance testing of Konvoy. The following table provides recommended settings, based on cluster size and increasing workloads, that maintain a healthy ElasticSearch deployment.

<p class="message--note"><strong>NOTE: </strong>The resource settings reflect some settings but do not represent the exact structure to be used in the Konvoy <code>cluster.yaml</code>.</p>

## ElasticSearch

<table>
  <tr>
    <td>Cluster Size</td>
    <td>Number of Pods</td>
    <td>Number of Services</td>
    <td>Resource settings</td>
  </tr>
  <tr>
    <td>50</td>
    <td>1.5k</td>
    <td>500</td>
    <td>
<pre>
client:
  heapSize: 1024m
  resources:
    limits:
      cpu: 500m
      memory: 2048Mi
    requests:
      cpu: 100m
      memory: 1536Mi
master:
  heapSize: 1024m
  resources:
    limits:
      cpu: 2000m
      memory: 2048Mi
    requests:
      cpu: 500m
      memory: 1536Mi
data:
  replicas: 6
  heapSize: 3072m
  persistence:
    size: 100Gi
  resources:
    limits:
      cpu: 4000m
      memory: 8192Mi
    requests:
      cpu: 1000m
      memory: 4608Mi
</pre>
    </td>
    </tr>
    <tr>
      <td>100</td>
      <td>3k</td>
      <td>1k</td>
      <td>
<pre>
client:
  heapSize: 1024m
  resources:
    limits:
      cpu: 1000m
      memory: 2048Mi
    requests:
      cpu: 500m
      memory: 1536Mi
master:
  heapSize: 4096m
  resources:
    limits:
      cpu: 2000m
      memory: 8192Mi
    requests:
      cpu: 2000m
      memory: 4096Mi
data:
  replicas: 6
  heapSize: 8192m
  persistence:
    size: 100Gi
  resources:
    limits:
      cpu: 4000m
      memory: 16384Mi
    requests:
      cpu: 3000m
      memory: 15000Mi
</pre>
    </td>
    </tr>
    <tr>
      <td>200</td>
      <td>10k</td>
      <td>3k</td>
      <td>
<pre>
client:
  heapSize: 1024m
  resources:
    limits:
      cpu: 1000m
      memory: 2048Mi
    requests:
      cpu: 500m
      memory: 1536Mi
master:
  heapSize: 4096m
  resources:
    limits:
      cpu: 2000m
      memory: 8192Mi
    requests:
      cpu: 2000m
      memory: 4096Mi
data:
  replicas: 6
  heapSize: 3072m
  persistence:
    size: 100Gi
  resources:
    limits:
      cpu: 4000m
      memory: 16384Mi
    requests:
      cpu: 1000m
      memory: 15000Mi
</pre>
      </td>
      </tr>
      <tr>
        <td>300</td>
        <td>15k</td>
        <td>6k</td>
        <td>
<pre>
client:
  heapSize: 2048m
  resources:
    limits:
      cpu: 4000m
      memory: 4096Mi
    requests:
      cpu: 2000m
      memory: 2048Mi
master:
  heapSize: 4096m
  resources:
    limits:
      cpu: 2000m
      memory: 8192Mi
    requests:
      cpu: 1000m
      memory: 4096Mi
data:
  replicas: 6
  heapSize: 3072m
  persistence:
    size: 100Gi
  resources:
    limits:
      cpu: 4000m
      memory: 16384Mi
    requests:
      cpu: 3000m
      memory: 15000Mi
</pre>
        </td>
  </tr>
</table>
