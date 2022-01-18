---
layout: layout.pug
navigationTitle: Domains
title: Required Domains
menuWeight: 30
excerpt: This section describes the required domains for Konvoy
beta: false
enterprise: false
---
You must have access to the following domains through the customers networking rules so that Konvoy can download all required images:

- k8s.gcr.io
- registry.hub.docker.com
- quay.io
- gcr.io
- packages.cloud.google.com
- download.docker.com
- github.com
- grafana.com
- raw.githubusercontent.com
- mesosphere.github.io
- storage.googleapis.com
- ntp.org
- docker.elastic.org

<p class="message--note"><strong>NOTE: </strong>In an air-gapped installation, these domains do not need to be accessible.</p>