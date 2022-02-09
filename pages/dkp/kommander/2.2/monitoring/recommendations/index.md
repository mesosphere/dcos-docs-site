---
layout: layout.pug
navigationTitle: Recommendations
title: Recommendations
menuWeight: 11
beta: false
excerpt: Recommended settings for monitoring and collecting metrics for Kubernetes, platform services, and applications deployed on the cluster
---

D2iQ conducts routine performance testing of Kommander. The following table provides recommended settings, based on cluster size and increasing workloads, that maintain a healthy Prometheus monitoring deployment.

<p class="message--note"><strong>NOTE: </strong>The resource settings reflect some settings but do not represent the exact structure to be used in the platform service configuration.</p>

## Prometheus

<table>
  <tr>
    <td>Cluster Size</td>
    <td>Number of Pods</td>
    <td>Number of Services</td>
    <td>Resource settings</td>
  </tr>
  <tr>
    <td>10</td>
    <td>1k</td>
    <td>250</td>
    <td>
<pre>
resources:
  limits:
    cpu: 500m
    memory: 2192Mi
  requests:
    cpu: 100m
    memory: 500Mi
storage: 35Gi
</pre>
    </td>
    </tr>
  <tr>
    <td>25</td>
    <td>1k</td>
    <td>250</td>
    <td>
<pre>
resources:
  limits:
    cpu: 2
    memory: 6Gi
  requests:
    cpu: 1
    memory: 3Gi
storage: 60Gi
</pre>
    </td>
    </tr>
  <tr>
    <td>50</td>
    <td>1.5k</td>
    <td>500</td>
    <td>
<pre>
resources:
  limits:
    cpu: 7
    memory: 28Gi
  requests:
    cpu: 2
    memory: 8Gi
storage: 100Gi
</pre>
    </td>
    </tr>
    <tr>
      <td>100</td>
      <td>3k</td>
      <td>1k</td>
      <td>
<pre>
resources:
  limits:
    cpu: 12
    memory: 50Gi
  requests:
    cpu: 10
    memory: 48Gi
storage: 100Gi
</pre>
    </td>
    </tr>
    <tr>
      <td>200</td>
      <td>10k</td>
      <td>3k</td>
      <td>
<pre>
resources:
  limits:
    cpu: 20
    memory: 80Gi
  requests:
    cpu: 15
    memory: 50Gi
storage: 100Gi
</pre>
      </td>
      </tr>
      <tr>
        <td>300</td>
        <td>15k</td>
        <td>6k</td>
        <td>
<pre>
resources:
  limits:
    cpu: 35
    memory: 150Gi
  requests:
    cpu: 25
    memory: 120Gi
storage: 100Gi
</pre>
        </td>
  </tr>
</table>
