---
layout: layout.pug
navigationTitle:
excerpt:
title: Release Notes
menuWeight: 120
model: /services/elastic/data.yml
render: mustache
---

# Version 2.5.0-6.3.2

## Upgrades

- Elasticsearch and Kibana were upgraded to version [6.3.2](https://www.elastic.co/guide/en/elasticsearch/reference/6.3/release-notes-6.3.2.html). ([#2824)](https://github.com/mesosphere/dcos-commons/commit/c0f10eb0c8a5662df659d03d0657cc314b0ec822)
- The SDK library was upgraded to version [0.55.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.1). ([commit)](https://github.com/mesosphere/dcos-commons/commit/230032df7e44b4018036493cc240d39a515205bc). Please also take a look at at least the [0.50.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.50.0) release to understand the changes between the 0.40.x (the one Elastic 2.4.0-5.6.9 used) and 0.50.x versions of the SDK.

## New Features

- It is now possible to configure per-pod readiness checks timeouts. ([#2866)](https://github.com/mesosphere/dcos-commons/commit/41793a8becba9c7585aaeedc404887727fc612af)
- It is now possible to configure per-pod [RLIMIT<sub>NOFILE</sub>](http://man7.org/linux/man-pages/man2/getrlimit.2.html)s. ([#2873)](https://github.com/mesosphere/dcos-commons/commit/a8a900d538f6e4815c3b7c130f871b9029c86ad2)

## Bug Fixes

- Fixed scenario where heterogeneous `@zone` constraints could result in ES in being unable to allocate shards. ([#2889)](https://github.com/mesosphere/dcos-commons/commit/db6cbf0b3e44d52bac5e797573337bd0157caf9c)

## Improvements

- Sensitive environment keys are now filtered from log files. ([#2748)](https://github.com/mesosphere/dcos-commons/commit/00a0bf8deb30b65461625678931a9ed3f3f1cbec)
- Scheduler Marathon app now uses a file-based secret. ([#2748)](https://github.com/mesosphere/dcos-commons/commit/00a0bf8deb30b65461625678931a9ed3f3f1cbec)
- Service names are now validated with a regex. ([#2861)](https://github.com/mesosphere/dcos-commons/commit/825eac6f53e80eecad876ec7f446546ef0023014)
- License details were added to the package metadata. ([#2867)](https://github.com/mesosphere/dcos-commons/commit/b3d39263544892c0c5debee08fcf39ff9d874760)
- Added `service_account_credential` parameter with file name value to scheduler Marathon app's ClassicRPCAuthenticatee Mesos module. ([#2777)](https://github.com/mesosphere/dcos-commons/commit/11fa91b42941cbad2fe6015436664744476fab04)
- Move Elastic and Kibana artifacts to downloads.mesosphere.com. ([#2762)](https://github.com/mesosphere/dcos-commons/commit/54c13d866b6348caa495f40738edb8efb41fef6d)

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
