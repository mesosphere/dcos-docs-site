---
layout: layout.pug
navigationTitle: Release notes for 1.13.2
title: Release notes for 1.13.2
menuWeight: 5
excerpt: Release notes for DC/OS 1.13.2, including Open Source attribution, and version policy.
---
DC/OS 1.13.2 was released on July 3, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.2/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.2 includes the following components:
- Apache Mesos 1.8.0 [change log](https://github.com/apache/mesos/blob/f5770dcf322bd8a88e6c88041364a4089d92be90/CHANGELOG).
- Marathon 1.8.204 [change log](https://github.com/mesosphere/marathon/blob/5209e3183846579e095c76069464062b673e9854/changelog.md).
- Metronome 0.6.27 [change log](https://github.com/dcos/metronome/blob/b8a73dd/changelog.md).

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Issues fixed in DC/OS 1.13.2
The issues that have been fixed in DC/OS 1.13.2 are grouped by feature, functional area, or component. 

## Job management
- COPS-4706, DCOS_OSS-5019 - Improves the validation performed for secrets when running jobs.
- DCOS_OSS-5258, DCOS_OSS-5273 - Enables you to report the task IDs for finished jobs. With this release, you can query run details for jobs using the `embed=history` argument to return task IDs in the job history for both successful and failed finished jobs.

## Logging
- DCOS-53834 - Mesos task logs are sent to Fluent Bit with task metadata included. 

## Marathon
- DCOS_OSS-5260, DCOS-54927 - Fixed an issue where two independent deployments could interfere with each other resulting in too many tasks launched and/or possibly a errorneous deployment. 

## Metrics
- DCOS-54425 - Added Fluent Bit metrics to the pipeline.
- DCOS-53589 - Telegraf reports `procstat` metrics only for DC/OS systemd services, instead of all processes.

## Security 
Introduced a mechanism for protecting the Exhibitor service from unauthorized access from within the cluster, using state-of-the-art mutual TLS authentication. See [documentation](https://docs.mesosphere.com/1.13/security/ent/tls-ssl/exhibitor/). This mechanism is intended to replace the rudimentary `exhibitor_admin_password-based` mechanism.

## Storage
DCOS-43777- When creating a DC/OS storage volume using the DC/OS UI, the resulting persistent entry of the created JSON app definition does not have a type set. Hence, the default type value `root` is used. In this release, the DC/OS UI is bumped to v2.82.5.

