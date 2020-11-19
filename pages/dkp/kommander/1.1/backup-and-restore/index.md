---
layout: layout.pug
navigationTitle: Back up and restore
title: Back up and restore
featureMaturity:
excerpt: Back up and restore Kommander data and the Konvoy cluster
category: K-Sphere
menuWeight: 11
---

Kommander stores all data as CRDs in the Kubernetes API and can be backed up and restored using the [standard Konvoy documentation](/dkp/konvoy/1.5/backup/). 

<div class="message--note" style="margin-top: 20px;">
<p style="margin-top: 10px; margin-bottom: 0px;"><strong>NOTE: </strong><code>kubecost</code> installs with Kommander and has the following storage requirements:</p>
<ul style="margin-top: 10px; margin-bottom: 0px;">
<li><code>cost-analyzer</code>: 0.2Gi</li>
<li><code>prometheus</code>: 32Gi</li>
<li><code>alertmanager</code>: 2Gi</li>
</ul>
</div>
