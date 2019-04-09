---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release Notes for Confluent Kafka Service version 2.5.0-4.1.2
title: Release Notes
menuWeight: 10
model: /services/confluent-kafka/data.yml
render: mustache
---
# Release Notes for {{ model.techName }} Service version 2.5.0-4.1.2

## Updates

- Update confluent-kafka base tech to version 4.1.2, See [Confluent Platform 4.1.2 release notes](https://docs.confluent.io/4.1.2/release-notes.html) for more details
- Update dcos-coommons sdk version to 0.55.2
- Update Zookeeper Client version to 3.4.13
- Switched to file-based secret

## New Features

- Number of open file descriptors is now configurable via the `RLIMIT_NOFILE_SOFT` and `RLIMIT_NOFILE_HARD` configuration parameters.
- Timeouts for readiness checks are now configurable via the `READINESS_CHECK_INTERVAL`, `READINESS_CHECK_DELAY` and `READINESS_CHECK_TIMEOUT` configuration parameters.