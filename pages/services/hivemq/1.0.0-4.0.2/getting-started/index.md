---
layout: layout.pug
navigationTitle:
excerpt:
title: Getting Started
menuWeight: 10
model: /services/hivemq/data.yml
render: mustache
---

<p class="message--note"><strong>The default configuration will deploy 3 {{ model.techName }} nodes, each requiring 4 CPU cores and 4096MB RAM. In the default configuration, the instances will not be placed on individual DC/OS nodes.</strong>

<p class="message--warning"><strong>If applicable, you may want to also <a href="/services/hivemq/1.0.0-4.0.2/getting-started/#create-a-configuration-file">deploy using an options.json</a> which specifies a license, as the default deployment launches in evaluation mode.</strong>

#include /services/include/getting-started.tmpl
