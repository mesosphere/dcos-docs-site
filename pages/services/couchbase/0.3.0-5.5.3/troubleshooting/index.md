---
layout: layout.pug
navigationTitle:
excerpt: Troubleshooting tips for Couchbase on DC/OS
title: Troubleshooting
menuWeight: 70
model: /services/couchbase/data.yml
render: mustache
---

#include /services/include/troubleshooting.tmpl

## {{ model.techName }} diagnostic information

More information about {{ model.techName }} troubleshooting can be found [here](https://developer.couchbase.com/documentation/server/current/troubleshooting/troubleshooting-general-tips.html).

Diagnostic information can be collected using the [cbcollect_info](https://developer.couchbase.com/documentation/server/current/cli/cbcollect-info-tool.html) command.
