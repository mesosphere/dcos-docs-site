---
layout: layout.pug
navigationTitle:
excerpt:
title: Limitations
menuWeight: 100
model: /services/elastic/data.yml
render: mustache
---

## Configuration via elasticsearch.yml and/or Elastic APIs

Elasticsearch provides two ways of updating settings: persistent (through `elasticsearch.yml` file) and transient (through [Elasticsearch Cluster Update Settings API](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-update-settings.html)). The service's Configuration Options are carried over to the tasks' `elasticsearch.yml` file automatically. Out-of-band configuration changes (either via Elasticsearch's Cluster Update Settings API or externally modifying `elasticsearch.yml` files) will not persist in case of a restart, failure recovery, or upgrade.

## Kibana configured with X-Pack Security enabled

If Kibana is configured with `kibana.elasticsearch_xpack_security_enabled` set to `true` the default DC/OS service link (`https://<cluster-url>/service/<kibana-service-name>`) will not work. This is due to a change in how Kibana deals with `Authorization` HTTP headers starting in version 6.3.

As a workaround, you should be able to expose Kibana using [EdgeLB](https://docs.mesosphere.com/services/edge-lb/) by following the following how-to: [Expose Kibana using EdgeLB](/services/elastic/2.5.0-6.3.2/how-to-guides#expose-kibana-using-edgelb).

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl
#include /services/include/limitations-regions.tmpl

## Upgrades and configuration updates

Upgrades and rolling configuration updates do not wait for a cluster green health status. During deployment and upgrades, the `serial` strategy does not wait for the Elasticsearch cluster to reach green health before proceeding to the next node.

## Security

Elasticsearch's native authentication and authorization mechanisms are not *officially* supported at this time.

### Transport Encryption

Toggling Transport Encryption requires doing a full-cluster restart. This is an [Elasticsearch limitation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-tls.html). The service's default update strategy is a rolling upgrade (`serial`). If you change its configuration to enable or disable transport encryption, nodes that have been configured with TLS will be unable to communicate with nodes configured with unencrypted networking, and vice-versa. A full-cluster restart is required, using the `parallel` update strategy. Make sure you have backups, and plan for some downtime. Afterwards, you should set the update strategy back to `serial` for future updates.
