---
layout: layout.pug
navigationTitle:
excerpt:
title: Security
menuWeight: 50
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---


# DC/OS Prometheus Security

## Securing Prometheus API and UI endpoints using TLS encryption

Prometheus does not directly support Transport Layer Security (TLS) encryption for connections to Prometheus instances (i.e. to the expression browser or HTTP API). If you would like to enforce TLS for those connections, we recommend using Prometheus in conjunction with a reverse proxy and applying TLS at the proxy layer.

Refer to the [Prometheus documentation](https://prometheus.io/docs/guides/tls-encryption/). 
