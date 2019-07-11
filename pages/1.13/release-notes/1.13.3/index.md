---
layout: layout.pug
navigationTitle: Release notes for 1.13.3
title: Release notes for 1.13.3
menuWeight: 4
excerpt: Release notes for DC/OS 1.13.3, including Open Source attribution, and version policy.
---
DC/OS 1.13.3 was released on July 24, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.3 includes the following components:

- DC/OS Enterprise UI updated to 1.13+v2.82.7 and plugins to 1.13+v2.82.7+33076c53.

- DC/OS Enterprise plugins updated to 1.13+v2.82.7+33076c53.

- DC/OS core CLI updated to 1.13-patch.5 bundled in the private registry.

- Apache Mesos 1.8.x [change log](https://github.com/apache/mesos/blob/07d053f68b75505a4386913f05d521fa5e36373d/CHANGELOG).

- Marathon 1.8.207 [change log](https://github.com/mesosphere/marathon/tree/9f3550487).

- Metronome 0.6.33 [change log](https://github.com/dcos/metronome/releases/tag/v0.6.33).

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Issues fixed in DC/OS 1.13.3
The issues that have been fixed in DC/OS 1.13.3 are grouped by feature, functional area, or component. 

## Backup and restore
- Consolidated `iam-database-restore` to work when no database exists. This helps recovery in rare scenarios. (DCOS_OSS-5317)

- Consolidated `dcos-zk backup` and `dcos-zk restore` to exit early with a clear error message if ZooKeeper is still running. (DCOS_OSS-5353)

## Health checks
-Made false negative results less likely by changing a timeout constant. (DCOS-53742, COPS-5041)

# Marathon
- Marathon will not get stuck anymore when trying to kill an unreachable instance. (MARATHON-8422)

- Persistent volumes tagged with a profile name now default to `DiskType.Mount`. (MARATHON-8631)

## Metrics
- Prometheus metrics can now be collected from Mesos tasks in the container networking mode. (DCOS-56018, COPS-5040)


[enterprise]
## Security
[/enterprise]

Under heavy load, direct requests to the IAM could be slowed down, making the IAM slow to respond to all requests. Mesos master now uses a login endpoint that goes through Admin Router, reducing the effect of any slow senders. This addresses a rare error condition in which the IAM system can become unavailable, potentially leading to Mesos task launch errors in the strict security mode. (DCOS-56053)