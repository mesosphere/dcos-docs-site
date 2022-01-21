---
layout: layout.pug
navigationTitle: Domains
title: Required Domains
menuWeight: 30
excerpt: This section describes the required domains for Kommander
beta: false
enterprise: false
---

You must have access to the following domains through the customer networking rules so that Kommander can download all required images:

 - docker.io
 - gcr.io
 - k8s.gcr.io
 - mcr.microsoft.com
 - nvcr.io
 - quay.io
 - us.gcr.io

<p class="message--note"><strong>NOTE: </strong>In an air-gapped installation, these domains do not need to be accessible.</p>