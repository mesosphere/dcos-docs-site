---
layout: layout.pug
navigationTitle: Release notes for 2.0.1
title: Release notes for 2.0.1
menuWeight: 2
excerpt: Release notes for DC/OS 2.0.1
---
DC/OS 2.0.1 was released on 22 November 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.2/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 2.0.2

MARATHON-8710	Marathon hides resident pod instances with task status TASK_UNKNOWN from /v2/pods/::status
DCOS_OSS-5643	adminrouter-agent failing to start on older CPUs that are missing SSE 4.2
DCOS-62548	COPS-5738: Rationale behind an old version of Java
DCOS-62478	open_source_tests/test_metrics.py test_metrics_agent_statsd Expected statsd metrics not found
DCOS-62006	Bundle Marathon DC/OS auth requests
DCOS-61529	Backport MESOS-9968 to DC/OS 1.13
DCOS-58300	test_registry_cli.test_default_packages_presence is failing on CI. dcos-core-cli package install fails.
COPS-5738	Rationale behind an old version of Java