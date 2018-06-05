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

Elasticsearch provides two ways of updating settings: persistent (through `elasticsearch.yml` file) and transient (through Elastic Settings Update API). The service's Configuration Options are carried over to the tasks' elasticsearch.yml file automatically. Out-of-band configuration changes (either via Elasticsearch's Update API or externally modifying elasticsearch.yml files) will not persist in case of a restart, failure recovery, or upgrade.

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl
#include /services/include/limitations-regions.tmpl

## Upgrades and configuration updates

Upgrades and rolling configuration updates do not wait for a green status. During deployment and upgrades, the `serial` strategy does not wait for the Elastic service to reach green before proceeding to the next node.

## Security

Elastic's native authentication and authorization mechanisms are not supported at this time.

### Transport Encryption

Toggling Transport Encryption requires doing a full-cluster restart. This is an [Elasticsearch limitation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-tls.html). Since the service's default update strategy is a rolling upgrade (`serial`) changing its configuration to enable (or disable) transport encryption will result in nodes configured with TLS not being able to communicate with nodes configured with unencrypted networking (and vice-versa). A full-cluster restart is required (using the `parallel` update strategy). Make sure to have backups and plan for some downtime.

Afterwards, you should set the update strategy back to `serial` for future updates.

## Kibana configured with X-Pack enabled

The service link for Kibana in the "Services" DC/OS UI page points to `<your-cluster-URL>/service/<kibana-service-name>`, which is initially broken with a redirect loop. To access Kibana when X-Pack is enabled you need to first authenticate on `<your-cluster-URL>/service/<kibana-service-name>/login`. That will redirect you to the Kibana UI and after that the DC/OS service link will work.
