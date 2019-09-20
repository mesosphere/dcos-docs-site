---
layout: layout.pug
navigationTitle: Release notes for 1.13.5
title: Release notes for 1.13.5
menuWeight: 2
excerpt: Release notes for DC/OS 1.13.5, including Open Source attribution, and version policy.
---
DC/OS 1.13.5 was released on September .

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.4/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.5 includes the following components:


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

- Updated to Mesos [1.8.2-dev](https://github.com/apache/mesos/blob/adc958f553c3728aab5529de56b0ddc30c0f9b68/CHANGELOG)

- Metronome post-install configuration can be added to /var/lib/dcos/metronome/environment (DCOS_OSS-5509)

- Mesos overlay networking: support dropping agents from the state. (DCOS_OSS-5536)

# Issues fixed in DC/OS 1.13.5
The issues that have been fixed in DC/OS 1.13.5 are grouped by feature, functional area, or component. 

- [enterprise][Marathon] Marathon bug fixed in which a service could get stuck if a failure occurred while Mesos tried to create a reservation (MARATHON-8693) [/enterprise]

- [Admin Router] Improved service routing robustness by omitting Marathon apps with wrongly specified DCOS_SERVICE_PORT_INDEX values. (DCOS_OSS-5491)


## Diagnostics

- [enterprise]Limit number of lines of storage logs in diagnostic bundle (DCOS-58314).[/enterprise]

- Added new diagnostics bundle REST API with performance improvements. (DCOS_OSS-5098)

- Fixes increasing diagnostics job duration when job is done (DCOS_OSS-5494)

## Installation

[enterprise]
## Security
[/enterprise]

- [enterprise][Marathon] Strict volume name validation was not relaxed enough in 1.13.4; this has been resolved (MARATHON-8697)[/enterprise]

