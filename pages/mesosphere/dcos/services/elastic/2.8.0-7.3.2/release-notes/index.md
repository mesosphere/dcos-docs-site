---
layout: layout.pug
navigationTitle:
excerpt: Discover the new features, updates, and known limitations in this release of the Elastic Service
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

# Release notes for Elastic Service version 2.8.0-7.3.2

- [Upgrades](#orgdf76f77)
- [New Features](#orgce810fb)
- [Bug Fixes](#orgae15112)
- [Improvements](#org630a806)


<a id="orgdf76f77"></a>

## Upgrades

-   Upgraded Elasticsearch and Kibana to [7.3.2](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/release-notes-7.3.2.html). ([#45](https://github.com/mesosphere/dcos-elastic-service/pull/45) [#47](https://github.com/mesosphere/dcos-elastic-service/pull/47))
-   Upgraded SDK version from `0.56.2` to `0.57.0`. ([#43](https://github.com/mesosphere/dcos-elastic-service/pull/43))

    Please take a look at the following SDK change logs for more information:

    -   [0.56.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.3)
    -   [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)


<a id="orgce810fb"></a>

## New Features

-   Added [Prometheus exporter](https://github.com/justwatchcom/elasticsearch_exporter) for metrics. ([#41](https://github.com/mesosphere/dcos-elastic-service/pull/41)) 

    New settings are:
    
    -   `prometheus_exporter.prometheus_exporter_enabled` (boolean, default `true`)
    -   `prometheus_exporter.configuration_options` (string, default `--es.all --es.indices --es.shards`)
    -   `prometheus_exporter.cpus` (number, default `1.0`)
    -   `prometheus_exporter.mem` (integer, default `128`)
    -   `prometheus_exporter.disk` (integer, default `256`)
    -   `prometheus_exporter.disk_type` (string, default `ROOT`)
    -   `prometheus_exporter.volume_profile` (string)
    -   `prometheus_exporter.readiness_check.interval` (integer, default `5`, minimum `5`)
    -   `prometheus_exporter.readiness_check.delay` (integer, default `0`, minimum `0`)
    -   `prometheus_exporter.readiness_check.timeout` (integer, default `10`, minimum `10`)

-   Added [Alerts](https://grafana.com/grafana/dashboards/2322) based on Prometheus metrics. ([#50](https://github.com/mesosphere/dcos-elastic-service/pull/50) [#51](https://github.com/mesosphere/dcos-elastic-service/pull/51))

-   Added [Elasticsearch Clusters Overview](https://grafana.com/grafana/dashboards/2322) dashboards based on Prometheus metrics. ([#49](https://github.com/mesosphere/dcos-elastic-service/pull/49)) 

    Check [Elasticsearch Metrics Configuration Documentation](https://docs.d2iq.com/mesosphere/dcos/services/elastic/2.8.0-7.3.2/configuration/#elasticsearch-metrics)

-   Exposed `xpack.security.transport.ssl.client_authentication` `xpack.security.http.ssl.client_authentication` `xpack.security.transport.ssl.verification_mode` ([#46](https://github.com/mesosphere/dcos-elastic-service/pull/46))

    New settings are:
    
    -   `xpack_security_transport_ssl_client_authentication` (string, default `optional`)
    -   `xpack_security_transport_ssl_verification_mode` (string, default `full`)
    -   `xpack_security_http_ssl_client_authentication` (string, default `none`)

<a id="orgae15112"></a>

## Bug Fixes

-   Fixed Kibana foldered service URL (`<cluster-url>/service/folders/kibana`) for DC/OS EE only. ([#38](https://github.com/mesosphere/dcos-elastic-service/pull/38) [#39](https://github.com/mesosphere/dcos-elastic-service/pull/39)) 


<a id="org630a806"></a>

## Improvements

-   Made possible to set [`bootstrap.memory_lock: true`](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/setup-configuration-memory.html#bootstrap-memory_lock). ([#48](https://github.com/mesosphere/dcos-elastic-service/pull/48))
-   Allowed to append or override `elasticsearch` `log4j2.properties` file. ([#44](https://github.com/mesosphere/dcos-elastic-service/pull/44))
