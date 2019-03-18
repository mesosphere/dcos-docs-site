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

Elasticsearch provides two ways of updating settings: persistent (through `elasticsearch.yml` file) and transient (through Elastic Settings Update API). The service's Configuration Options are carried over to the tasks' `elasticsearch.yml` file automatically. Out-of-band configuration changes (either via Elasticsearch's Update API or externally modifying `elasticsearch.yml` files) will not persist in case of a restart, failure recovery, or upgrade.

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl
#include /services/include/limitations-regions.tmpl

## Upgrades and configuration updates

Upgrades and rolling configuration updates do not wait for a green status. During deployment and upgrades, the `serial` strategy does not wait for the Elastic service to reach green before proceeding to the next node.

## Security

Elastic's native authentication and authorization mechanisms are not supported at this time.

### Transport Encryption

Toggling Transport Encryption requires doing a full-cluster restart. This is an [Elasticsearch limitation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-tls.html). The service's default update strategy is a rolling upgrade (`serial`). If you change its configuration to enable or disable transport encryption, nodes that have been configured with TLS will be unable to communicate with nodes configured with unencrypted networking, and vice-versa. A full-cluster restart is required, using the `parallel` update strategy. Make sure you have backups, and plan for some downtime. Afterwards, you should set the update strategy back to `serial` for future updates.

## Kibana configured with X-Pack Security enabled

Currently, the default service link for Kibana 6.3.2 does not work. For now, you can expose the Kibana web server with a Marathon app:

```json
{
  "id": "/kibana-passthrough",
  "cmd": "tail -f /dev/null",
  "instances": 1,
  "cpus": 0.01,
  "mem": 16,
  "container": {
    "type": "MESOS"
  },
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "  reqirep \"^([^ :]*)\\ /service/kibana/[/]?(.*)\" \"\\1\\ /\\2\" \n  server kibana web.kibana.marathon.l4lb.thisdcos.directory:80",
    "HAPROXY_0_PORT": "5061"
  }
}
```
