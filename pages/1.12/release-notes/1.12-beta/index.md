---
layout: layout.pug
navigationTitle: Release Notes for 1.12 Beta
title: Release Notes for 1.12 Beta
menuWeight: 5
excerpt: Release notes for DC/OS 1.12 Beta
---

DC/OS 1.12 Beta was released on September 17, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# Notable Changes in DC/OS 1.12 Beta

DC/OS 1.12 Beta includes the following components:
- Apache Mesos  [change log]().
- Marathon [change log]().
- Metronome  [change log]().


# Issues Fixed in DC/OS 1.12 Beta


## CLI 
- DCOS-21077 - Fix `install cli` overwrite issue on `dcos` file without displaying a warning.

## GUI
- DCOS-41769 - Fix background color/shadow issue on the `copy to clipboard` icon located in the Service endpoint tab.

## Marathon
- COPS-3554/DCOS-39582 - Re-register leader watch loop on ZooKeeper reconnect.

## Mesos
- COPS-2134 - Fix a series of errors printed by Cassandra node tasks.
- COPS-3371/DCOS-38500 - Fix health check issues for Kafka 2.0.4-1.0.0 inside /run/mesos/containers. Bump Mesos to nightly master `7ad23b8`.
- COPS-3574/DCOS-40317 - Bump Mesos to nightly `1.5.x dd68c0b`.
- COPS-3612/DCOS-40309 - Fix container launch failures that occurred due to Mesos-bridge running out of IPs.
- DCOS-24245 - Fix readiness check failure in Mesos nodes.
- DCOS-41761 - Fix SLRP to clean up plugin containers after it is removed.
- DCOS-41804 - Add implicit authorization for `VIEW_STANDALONE_CONTAINER`.
- DCOS-41855 - Fix denial of service vulnerability in `picojson (v1.3.0)` due to unsafe handling of deeply nested JSON structures.

## Metrics
- DCOS-41559/DCOS_OSS-4060 - Fix `null` value issue in `dcos_metrics` output.
- DCOS-41902 - Remove DataDog plugin.
- DCOS-41570/DCOS_OSS-4088/- DCOS_OSS-4090 - Bump the `Telegraf` package to fix 500 responses from v0 metrics API due to JSON serialization error.
- DCOS-41747 - Ensure `statsd` socket is cleaned up before launching `Telegraf`.
- DCOS_OSS-4044 - Fix `dcos_statsd` crash. Prevent `dcos_statsd` input from unusual behavior due to concurrent map reads/writes. 
- DCOS_OSS-4071 - Fix metric names such that the API provided by `Telegraf` is equivalent to the API provided by `dcos-metrics`.
- DCOS_OSS-4089 - Add `executor_id` in `Telegraf` outputs.


## Platform
- COPS-3658/DCOS-21258 - Remove `dcos-history-service` from UI.  


# About DC/OS 1.12 Beta

DC/OS 1.12 Beta includes many new capabilities with a focus on:







Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).


## New Features and Capabilities

### Platform


### Networking


[enterprise]
### Security
[/enterprise]


### Monitoring


### Storage


### Updated DC/OS Data Services

