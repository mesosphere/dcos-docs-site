---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration Limitations
featureMaturity:
enterprise: false
model: /services/mongodb-enterprise/data.yml
render: mustache
---

#include /services/include/limitations.tmpl

## TLS Support

This release of the {{ model.techName }} Enterprise over DC/OS does not support connecting to replica sets using a TLS/SSL security mechanism.
