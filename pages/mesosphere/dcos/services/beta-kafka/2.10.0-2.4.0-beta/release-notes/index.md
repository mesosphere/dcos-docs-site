---
layout: layout.pug
navigationTitle:
excerpt: Release notes for 2.10.0-2.4.0-beta
title: Release Notes
menuWeight: 5
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

## Version 2.10.0-2.4.0-beta

### Updates
- Added custom TLS certificate support for Kafka.
- Upgrade the base tech version of Apache Kafka to `2.4.0`. See Kafka's Release Notes for [2.4.0](https://www.apache.org/dist/kafka/2.4.0/RELEASE_NOTES.html) for details.
- Updated the SDK to version [0.57.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3)
  - [#3215](https://github.com/mesosphere/dcos-commons/pull/3215) is a major bug-fix since `v0.57.0`. Frameworks are recommended to upgrade to `v0.57.3` and issue `pod replace` commands to exisiting deployments to mitigate the risks. Existing procedures for [migrating a existing service to the quotated role](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0#migrate-an-existing-deployed-service-to-use-quota-support) should be followed.
- Updated the scheduler JRE to `v11`.

### Important Notes
- Apache Kafka 2.4.0 introduces `[KAFKA-7335] - Store clusterId locally to ensure broker joins the right cluster`, which means that a Kafka cluster will store the clusterId locally so that it does not join the wrong Zookeeper cluster accidentally. Therefore, if your Kafka service is connected to default DC/OS Zookeeper, changing the Zookeeper path is not permitted. Please check [here](https://issues.apache.org/jira/browse/KAFKA-7335) for more information.

