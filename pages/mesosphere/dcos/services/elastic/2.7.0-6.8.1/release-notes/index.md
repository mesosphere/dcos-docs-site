---
layout: layout.pug
navigationTitle:
excerpt: Discover the new features, updates, and known limitations in this release of the Elastic Service
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

# Release notes for Elastic Service version 2.7.0-6.8.1

- [Upgrades](#orgdf76f77)
- [New Features](#orgce810fb)
- [Bug Fixes](#orgae15112)
- [Improvements](#org630a806)


<a id="orgdf76f77"></a>

## Upgrades

-   Upgraded Elasticsearch and Kibana to [6.8.1](https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.1.html). This Elasticsearch version requires that nodes communicate through TLS if X-Pack Security is enabled. We made it so that when `elasticsearch.xpack_security_enabled` is set to `true` the scheduler will provision TLS artifacts and configure nodes to only accept TLS connections for both transport and HTTP mechanisms, similar to what one would get by setting `service.security.transport_encryption.enabled` to `true`. ([#12](https://github.com/mesosphere/dcos-elastic-service/pull/12))
-   Upgraded SDK version from `0.55.4` to `0.56.2`.

    Please take a look at the following SDK change logs for more information:

    -   [0.55.5](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.5)
    -   [0.56.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.0)
    -   [0.56.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.1)
    -   [0.56.2](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.2)

    Changes: ([#34](https://github.com/mesosphere/dcos-elastic-service/pull/34))
-   Replaced Oracle JRE (jre-8u192) with newer OpenJDK (openjdk-jre-8u212b03). ([#3060](https://github.com/mesosphere/dcos-commons/pull/3060))


<a id="orgce810fb"></a>

## New Features

-   Added support for Elasticsearch plugin installation via proxy. New settings are:

    -   `elasticsearch.plugin_http_proxy_host`
    -   `elasticsearch.plugin_http_proxy_port`
    -   `elasticsearch.plugin_https_proxy_host`
    -   `elasticsearch.plugin_https_proxy_port`

    Changes: ([#4](https://github.com/mesosphere/dcos-elastic-service/pull/4))
-   Added custom domain support for Elastic. New setting is `service.security.custom_domain`. This custom domain is used in place of the default `autoip.dcos.thisdcos.directory`. This can be used to expose the service securely outside of the cluster, but requires setting up external DNS. Check [this documentation page](https://mesosphere.github.io/dcos-commons/developer-guide/#externalizing-transport-encryption-and-security) for more information. ([#9](https://github.com/mesosphere/dcos-elastic-service/pull/9))
-   Made it possible to scale down the amount of coordinator nodes. ([#15](https://github.com/mesosphere/dcos-elastic-service/pull/15))
-   Added custom YAML configuration support to Kibana. New setting is: `kibana.custom_kibana_yml` ([#14](https://github.com/mesosphere/dcos-elastic-service/pull/14))
-   Added plugin installation support for Kibana. New setting is: `kibana.plugins` ([#16](https://github.com/mesosphere/dcos-elastic-service/pull/16))
-   Added volume profile support. New settings are:

    -   `master_nodes.volume_profile`
    -   `data_nodes.volume_profile`
    -   `ingest_nodes.volume_profile`
    -   `coordinator_nodes.volume_profile`

    Check the [Storage Service documentation](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0/) for more details. ([#18](https://github.com/mesosphere/dcos-elastic-service/pull/18))
-   Added placement constraints capability to Kibana. New setting is `kibana.placement` (array of placement constraint arrays). Check the [Marathon placement constraints documentation](https://mesosphere.github.io/marathon/docs/constraints.html) for more details. ([#27](https://github.com/mesosphere/dcos-elastic-service/pull/27))
-   Added virtual network (CNI) support to Kibana. New settings are:

    -   `virtual_network_enabled` (boolean)
    -   `virtual_network_name` (string, default `dcos`)
    -   `virtual_network_plugin_labels` (array of objects with `key` and `value` keys)

    Changes: ([#28](https://github.com/mesosphere/dcos-elastic-service/pull/28))
-   Added scheduler-plan based health checks. ([#3069](https://github.com/mesosphere/dcos-commons/pull/3069))


<a id="orgae15112"></a>

## Bug Fixes

-   Fixed Kibana service URL (`<cluster-url>/service/kibana`). This makes Kibana's service URL work out of the box even when X-Pack Security is enabled. This was a limitation in the previous version, where we required Kibana to be exposed with EdgeLB. Which is still possible, but not required anymore. ([#3036](https://github.com/mesosphere/dcos-commons/pull/3036))
-   Fixed issue where setting `http.cors.allow-origin` to `*` would cause the deploy to fail to due the Elasticsearch configuration file be compiled with incorrectly escaped content. ([#23](https://github.com/mesosphere/dcos-elastic-service/pull/23))
-   Fixed the duplicate `Xmx` and `Xms` JVM flags in the command to start the Elasticsearch process. This didn't actually cause any issues because the JVM only considers the last ones, which were the ones we were configuring, but inspecting the command with `ps aux` would show both, which could be confusing to operators. ([#2975](https://github.com/mesosphere/dcos-commons/pull/2975))


<a id="org630a806"></a>

## Improvements

-   Moved the service source code to its own repository: [mesosphere/dcos-elastic-service](https://github.com/mesosphere/dcos-elastic-service). ([#3107](https://github.com/mesosphere/dcos-commons/pull/3107))
-   Made most of the Elasticsearch settings be configurable from the service configuration file. ([#20](https://github.com/mesosphere/dcos-elastic-service/pull/20))
-   Exposed `xpack.monitoring.exporters.default_exporter.use_ingest` setting and defaulted it to `false` to avoid polluting the Elasticsearch node logs with harmless warnings. ([#26](https://github.com/mesosphere/dcos-elastic-service/pull/26))
-   Added `MARATHON_SINGLE_INSTANCE_APP` and `DCOS_PACKAGE_FRAMEWORK_NAME` to Kibana's Marathon app labels. ([#3056](https://github.com/mesosphere/dcos-commons/pull/3056))
-   Made [`search_remote_connect`](https://www.elastic.co/guide/en/elasticsearch/reference/6.0/modules-cross-cluster-search.html) default to `false`. ([#2999](https://github.com/mesosphere/dcos-commons/pull/2999))