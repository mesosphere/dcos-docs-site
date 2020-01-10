---
layout: layout.pug
navigationTitle: Release Notes for 1.12.5
title: Release Notes for 1.12.5
menuWeight: 3
excerpt: Release notes for DC/OS 1.12.5
---

DC/OS Version 1.12.5 was released on 10 January 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.12.5/dcos_generate_config.ee.sh"]Download DC/OS Enterprise [/button]

DC/OS 1.12.5 includes the following components:

- Apache Mesos 1.7.3-dev [change log](https://github.com/apache/mesos/blob/d8acd9cfacd2edf8500f07f63a8837aa0ddd14ba/CHANGELOG)
- Marathon 1.7.216 [change log](https://github.com/mesosphere/marathon/blob/9e2a9b579b968a2664df03099b03eaf86ffc7efc/changelog.md)
- Metronome 0.6.33 [change log](https://github.com/dcos/metronome/blob/b8a73dd3cc3c2da035222031ccbbcf5c836ede7b/changelog.md)

# Release summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues fixed in DC/OS 1.12.5
The issues that have been fixed in DC/OS 1.12.5 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

- The DC/OS diagnostics bundle now includes Mesos state logs content, located at /var/log/mesos-state.tar.gz. (DCOS-56403)
- Added 3 new environment files to Mesos systemd. (DCOS-49092)
- [Metronome] post-install configuration can be added to /var/lib/dcos/metronome/environment (DCOS_OSS-5509)
- Changed dcos-zk backup and dcos-zk restore to exit early if ZooKeeper is running. (DCOS_OSS-5353)
- Fix preflight docker version check failing for docker 1.19. (DCOS-56831)
- DC/OS Net: Fix support for big sets in the ipset manager. (COPS-5229)
- Added new diagnostics bundle REST API with performance improvements. (DCOS_OSS-5098)
- Fixes increasing diagnostics job duration when job is done (DCOS_OSS-5494)
- Remove nogroup creation. (COPS-5220) 
- Increase number of diagnostics fetchers (DCOS-51483) 
- DC/OS overlay networks should be compared by-value. (DCOS_OSS-5620)
- Reserve all agent VTEP IPs upon recovering from replicated log. (DCOS_OSS-5626)
- Nodes and applications are not pingable on 2.0 (COPS-5575, DCOS-60956)
- DC/OS Backup fix for Exhibitor TLS (COPS-5313, DCOS-60918)
- Mesos overlay networking: support dropping agents from the state. (DCOS_OSS-5536)







_______________________


- Updated Signal service to release 1.6.0

- Signal now sends telemetry data every 5 minutes instead of every hour. This is to align the frequency with DC/OS Enterprise.


- Updated DC/OS UI to 1.12+v2.26.18.


- [Metronome] Querying run detail with embed=history, successfulFinishedRuns and failedFinishedRuns contains new field tasks which is an array of taskIds of that finished run. This will allow people to query task ids even for finished job runs.

- [Metronome] Fixes metronome where it did not use the revive operation.

- [Metronome] Updates to fix daylight saving issues.


Prune VIPs with no backends in order to avoid unbounded growth of state and messages exchanged among dcos-net processes. (DCOS_OSS-5356)



<!-- TLS + backups is only supported on 1.12.5+ (COPS-5313, DCOS-60918) This may have already been added to earlier release notes. -->
