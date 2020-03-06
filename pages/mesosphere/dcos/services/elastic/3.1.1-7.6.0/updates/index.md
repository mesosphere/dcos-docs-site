---
layout: layout.pug
navigationTitle: Updates
excerpt: Updating the DC/OS Elastic service
title: Updates
menuWeight: 40
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---
When you update from an earlier version of {{ model.techName }}, your service will automatically be upgraded first to any intervening versions, and then to the latest version. See [Viewing available versions](/mesosphere/dcos/services/elastic/3.1.1-7.6.0/updates/#viewing-available-versions) to see which versions of {{ model.techName }} are currently supported.

#include /mesosphere/dcos/services/include/update.tmpl
