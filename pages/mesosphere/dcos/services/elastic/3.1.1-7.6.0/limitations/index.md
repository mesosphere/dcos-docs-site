---
layout: layout.pug
navigationTitle: Limitations
excerpt: Some limitations of the DC/OS Elastic service
title: Limitations
menuWeight: 100
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

## Configuration via elasticsearch.yml and/or Elastic APIs

Elasticsearch provides two ways of updating settings: persistent (through `elasticsearch.yml` file) and transient (through [Elasticsearch Cluster Update Settings API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-update-settings.html)). The service's Configuration Options are carried over to the tasks' `elasticsearch.yml` file automatically. Out-of-band configuration changes (either via Elasticsearch's Cluster Update Settings API or externally modifying `elasticsearch.yml` files) will not persist in case of a restart, failure recovery, or upgrade.

## Kibana service URL does not work on DC/OS 1.11

If Kibana is configured with `kibana.elasticsearch_xpack_security_enabled` set to `true` the default DC/OS service link (`https://<cluster-url>/service/<kibana-service-name>`) will not work. This is due to a change in how Kibana deals with `Authorization` HTTP headers starting in version 6.3.

As a workaround, you should be able to expose Kibana using [EdgeLB](/mesosphere/dcos/services/edge-lb/) by following this guide: [Expose Kibana using EdgeLB](/mesosphere/dcos/services/elastic/3.1.1-7.6.0/how-to-guides#expose-kibana-using-edgelb).

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## Upgrades and Configuration Updates

Upgrades and rolling configuration updates do not wait for a cluster green health status. During deployment and upgrades, the `serial` strategy does not wait for the Elasticsearch cluster to reach green health before proceeding to the next node.

## Security

Elasticsearch's built-in authentication mechanisms ([realms](https://www.elastic.co/guide/en/elastic-stack-overview/7.6/setting-up-authentication.html)) cannot currently be configured through service configuration options (that is, on package installs or service updates). However, since the [native](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/configuring-native-realm.html) realm is enabled by default by Elasticsearch, it is possible to configure it through the [security APIs](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/security-api.html). These APIs include both authentication and authorization mechanisms.

### Transport Encryption

Toggling Transport Encryption requires doing a full-cluster restart. This is an [Elasticsearch limitation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-tls.html). The service's default update strategy is a rolling upgrade (`serial`). If you change its configuration to enable or disable transport encryption, nodes that have been configured with TLS will be unable to communicate with nodes configured with unencrypted networking, and vice-versa. A full-cluster restart is required, using the `parallel` update strategy. Make sure you have backups, and plan for some downtime. Afterwards, you should set the update strategy back to `serial` for future updates.
