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

#include /services/include/getting-started.tmpl
