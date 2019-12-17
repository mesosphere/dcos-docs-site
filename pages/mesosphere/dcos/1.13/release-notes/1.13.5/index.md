---
layout: layout.pug
navigationTitle: Release notes for 1.13.5
title: Release notes for 1.13.5
menuWeight: 10
excerpt: Release notes for DC/OS 1.13.5, including Open Source attribution, and version policy.
---
DC/OS 1.13.5 was released on 2 October 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.5/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

- Updated to Mesos [1.8.2-dev](https://github.com/apache/mesos/blob/adc958f553c3728aab5529de56b0ddc30c0f9b68/CHANGELOG)

- Updated to Marathon 1.8.227.


# Fixed and Improved Issues in DC/OS 1.13.5
<!-- The issues that have been fixed and improved in DC/OS 1.13.5 are grouped by feature, functional area, or component.  -->
- Marathon: Fixed a bug in which a service could get stuck if a failure occurred while Mesos tried to create a reservation. (MARATHON-8693) 
- [enterprise]Updated `dcos-backup` to support accessing Exhibitor through Admin Router. This is needed when [Exhibitor mutual TLS authentication](https://docs.d2iq.com/mesosphere/dcos/1.13/security/ent/tls-ssl/exhibitor/) is enabled. (DCOS-57704)[/enterprise]
- Metronome: Post-install configuration can now be added to `/var/lib/dcos/metronome/environment`. (DCOS_OSS-5509)
- Mesos overlay networking: Added an HTTP endpoint for dropping agents from the state.  (DCOS_OSS-5536, COPS-5281)
- Admin Router: Improved service routing robustness by omitting Marathon apps with wrongly specified `DCOS_SERVICE_PORT_INDEX` values. (COPS-5147, DCOS_OSS-5491)
- Strict volume name validation was not relaxed enough in DC/OS release 1.13.4; this has been resolved. (MARATHON-8697, MARATHON-8681, COPS-5219)
- Mesos: Fixed race condition between two terminal task status updates for Docker/Command executor. (COPS-4995, MESOS-9887)


## Diagnostics
- [enterprise]Reduce the amount of storage logs in the diagnostic bundle. (DCOS-58314)[/enterprise]
- Diagnostics bundle: Added a REST API with performance improvements. (DCOS_OSS-5098)
- Diagnostics bundle: Fixed a bug in which the bundle creation job duration was shown as ever-increasing, even after the job finished.  (DCOS_OSS-5494)



