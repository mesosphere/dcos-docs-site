---
layout: layout.pug
navigationTitle:  Supported Versions
title: Supported Versions
menuWeight: 120
excerpt: Understanding DC/OS Spinnaker Services package versioning
featureMaturity:
enterprise: false
model: /services/spinnaker/data.yml
render: mustache
---

# Supported Versions

## Package Versioning Scheme

- {{ model.techName }}: 1.9.2
- DC/OS: 1.10 and 1.11

Packages are versioned with an a.b.c-x.y.z format, where a.b.c is the version of the DC/OS integration and x.y.z indicates the version of {{ model.techName }}. For example, 0.3.0-1.9.2 indicates version 0.3.0 of the DC/OS integration and version 1.9.2 of Spinnaker.

## Version Policy

The DC/OS {{ model.techName }} Service is engineered and tested to work with a specific release of {{ model.serverName }}.

## Contacting Technical Support

### Support Email of DCOS {{ model.techName }} Package

[Email: support@mesosphere.io](mailto:support@mesosphere.io)

### Mesosphere DC/OS

[Submit a request](https://support.mesosphere.com/hc/en-us/requests/new)
