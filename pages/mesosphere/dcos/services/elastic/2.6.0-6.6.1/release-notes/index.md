---
layout: layout.pug
navigationTitle:
excerpt: Discover the new features, updates, and known limitations in this release of the Elastic Service
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

# Release notes for Elastic Service version 2.6.0-6.6.1

## Upgrades

- Elasticsearch and Kibana were upgraded to version
  [6.6.1](https://www.elastic.co/guide/en/elasticsearch/reference/6.6/release-notes-6.6.1.html).
  ([#2976)](https://github.com/mesosphere/dcos-commons/pull/2976)

- The SDK library was upgraded from version
  [0.55.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.1) to
  [0.55.4](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.4).
  ([commit)](https://github.com/mesosphere/dcos-commons/commit/8a12baa9327a4b7622c29f41c9e6cf2488d586c1).

  Notable changes include:
  - Pods are now automatically replaced when an agent is decomissioned. ([#2884](https://github.com/mesosphere/dcos-commons/pull/2884))
  - Scheduler doesn't evaluate existing reservations against new port specs anymore. ([#2928](https://github.com/mesosphere/dcos-commons/pull/2928))
  - Scheduler now handles duplicate StoreTaskInfoRecommendations generated during step evaluation. ([#2936](https://github.com/mesosphere/dcos-commons/pull/2936))

  Please take a look at the following SDK changelogs for more information:
  - [0.55.2](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.2)
  - [0.55.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.3)
  - [0.55.4](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.4)

## Bug Fixes

- Elastic custom YAML content is not incorrectly escaped anymore. ([#2932](https://github.com/mesosphere/dcos-commons/pull/2932))

  Before this fix, a custom YAML with:
  ```yaml
  searchguard.restapi.roles_enabled: ["sg_all_access"]
  ```

  would be compiled to:
  ```yaml
  searchguard.restapi.roles_enabled: [&#34;sg_all_access&#34;]
  ```

  The issue is now fixed.
