---
layout: layout.pug
navigationTitle:  Supported Versions
title: Supported Versions
menuWeight: 120
excerpt: Understanding DC/OS Couchbase Services package versioning
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/couchbase/data.yml
render: mustache
---

# Supported Versions

## Package Versioning Scheme

- {{ model.techName }}: 6.0.0
- {{ model.syncGatewayName }}: 1.0.0
- {{ model.productName }}: 1.10 and 1.11

Packages are versioned with an a.b.c-x.y.z format, where a.b.c is the version of the {{ model.productName }} integration and x.y.z indicates the version of {{ model.techName }}. For example, 1.0.0-6.0.0 indicates version 1.0.0 of the {{ model.productName }} integration and version 6.0.0 of Couchbase Server.

## Version Policy

The {{ model.productName }} {{ model.techName }} Service is engineered and tested to work with a specific release of {{ model.serverName }} and {{ model.syncGatewayName }}.

## Contacting Technical Support

### Support Email of DCOS {{ model.techName }} Package

[Email: support@mesosphere.io](mailto:support@mesosphere.io)

### Mesosphere {{ model.productName }}

[Submit a request](https://support.mesosphere.com/hc/en-us/requests/new)
