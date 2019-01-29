---
layout: layout.pug
navigationTitle:
excerpt:
title: Release Notes
menuWeight: 120
model: /services/elastic/data.yml
render: mustache
---

# Version 2.4.0-5.6.9

## New Features

- Elasticsearch and Kibana were upgraded to version [5.6.9](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.9.html). ([#2536](https://github.com/mesosphere/dcos-commons/pull/2536))

## Improvements

- The SDK tests now validate missing values for `svc.yml` Mustache variables. ([#2527](https://github.com/mesosphere/dcos-commons/pull/2527))

# Version 2.3.1-5.6.5

## New Features

- All frameworks (Cassandra included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

# Version 2.3.0-5.6.5

## New features

- Support for deploying the service in a remote region.

# Version 2.2.0-5.6.5

## New features

- Support for the automated provisioning of TLS artifacts to secure Elastic communication (requires X-Pack)
- Support for `Zone` placement constraints in DC/OS 1.11
- Ability to pause a service pod for debugging and recovery purposes

## Updates

- Major improvements to the stability and performance of service orchestration
- JRE upgraded to 1.8u162
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

# Version 2.1.1-5.6.5

## Improvements

- Elastic updated to version 5.6.5
- Kibana updated to version 5.6.5

# Version 2.1.0-5.6.2

## New Features

* Custom configuration can now be passed to Elastic plugins. See [the documentation](/services/elastic/2.1.1-5.6.5/custom-elasticsearch-yaml/).

## Bug Fixes

* Uninstall now handles failed tasks correctly

# Version 2.0.0-5.5.1

## Improvements

- Default to 0 ingest nodes
- Automatic management of gateway settings
- Upgrade to [dcos-commons 0.30.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.30.0)

## Bug Fixes

- Numerous fixes and enhancements to service reliability

# Version 1.0.15-5.5.1-beta

## Improvements

- Upgrade to [dcos-commons 0.20.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.20.1)
- Upgrade to Elastic 5.5.1

# Version 1.0.14-5.4.1-beta

## New Features

- Installation in folders is supported
- Use of a CNI network is supported

## Improvements

- Upgrade to [dcos-commons 0.20.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.20.0)
- Upgrade to Elastic 5.5.0
- Default user is now `nobody`
- Allow configuration of scheduler log level
- Kibana's cpu and memory are now configurable

## Bug Fixes

- Stop downloading Statsd zip file twice

# Version 1.0.13-5.4.1-beta

## New Features

- Enabled Elastic framework to work in offline/airgapped cluster (#1091)

## Upgrades

- Upgraded to Elasticsearch and Kibana 5.4.1
- Upgraded to dcos-commons-0.18.0

# Version 1.0.11-5.4.0-beta

## Breaking Changes

- Kibana has been removed from the Elastic package, along with the proxylite helper service. Please see the '[Connecting Clients](/services/elastic/2.1.1-5.6.5/connecting-clients/)' section for instructions on how to provision and connect Kibana on DC/OS.

## Improvements/Features

- Added an option to toggle installation of commercial X-Pack plugin (disabled by default)
- Increased ingest node default RAM to 2GB
- Added a configurable health check user/password to use as Elastic credentials during readiness/health checks

## Upgrades

- Upgraded to Elastic 5.4.0
- Upgraded to Support Diagnostics Version 5.12
- Upgraded to dcos-commons-0.16.0
