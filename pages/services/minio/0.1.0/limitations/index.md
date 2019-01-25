---
layout: layout.pug
navigationTitle: Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---

#include /services/include/limitations.tmpl


## Scaling Out

DC/OS {{ model.techName }} does not support horizontal scaling; if your {{ model.techName }} cluster has started with eight {{ model.techName }} servers, then a ninth {{ model.techName }} server cannot be added to the {{ model.techName }} cluster.

<p class="message--note"><strong>NOTE: </strong> DC/OS Minio does not support Horizontal Scaling.</p>

## Auto Assignment of Ports

Auto assignment of ports is not supported by the DC/OS {{ model.techName }} framework. DC/OS {{ model.techName }} must be bound to the same port on each node to start in distributed mode. Enabling auto assignment of ports may result in binding the DC/OS {{ model.techName }} server to different ports on each pod.
