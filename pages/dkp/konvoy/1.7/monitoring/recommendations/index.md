---
layout: layout.pug
navigationTitle: Recommendations
title: Recommendations
menuWeight: 11
excerpt: Recommended settings for monitoring and collecting metrics for Kubernetes, platform services, and applications deployed on the Konvoy cluster
---

At D2iQ, we conduct routine performance testing of Konvoy. The following table provides recommended settings, based on cluster size and increasing workloads, that maintain a healthy Prometheus monitoring deployment.

<p class="message--note"><strong>NOTE: </strong>The resource settings reflect some settings but do not represent the exact structure to be used in the Konvoy <code>cluster.yaml</code>.</p>

## Prometheus

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
