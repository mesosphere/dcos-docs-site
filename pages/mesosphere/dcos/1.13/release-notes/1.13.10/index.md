---
layout: layout.pug
navigationTitle: Release notes for 1.13.10
title: Release notes for 1.13.10
menuWeight: 0
excerpt: Release notes for DC/OS 1.13.10, including Open Source attribution, and version policy.
---
DC/OS&trade; 1.13.10 was released on 10 September, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.10/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.10/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

## Components
DC/OS 1.13.10 includes the following updated components:

- CockroachDB Python 0.3.5 (D2iQ-62221)

## DC/OS Fixed and Improved Issues

DC/OS 1.13.10 fixes the following issues:

- Selecting *Install DC/OS CLI* presents a URL to a binary that is incorrect. (COPS-6360) 
- Selecting **Run** on a job or selecting **Delete** to remove a group had no effect and threw an exception. (COPS-6324)
- DC/OS OSS UI was not displaying a user name, but instead showed a **User added through OIDC ID Token login** message. (COPS-6295, D2iQ-70199)
- After an upgrade, the dcos-telegraf directories had incorrect permissions leading to a problem launching tasks. (COPS-6232, D2iQ-69295)
- A critical error in Metronome where existing jobs appear to be lost after upgrade. (DCOS_OSS-5965, COPS-6174)
- Users were unable to remove empty folders from Metronome. (COPS-6139, D2iQ-68541)
- Zookeeper log messages are now being forwarded to syslog. (COPS-6128, D2iQ-68394)
- Exhibitor was writing JNA files to /tmp. (COPS-6111, D2iQ-68109, D2iQ-68868) 
- Using file-based secrets caused mount failure and issues in the json editor. (COPS-6085, D2iQ-68114, D2iQ-67819) 
- An unknown response code was received when querying DC/OS health endpoints. (COPS-5915, COPS-5979, D2iQ-65296, D2iQ-69169) 
- Unmounting external persistent volumes in Mesos. (COPS-5920, D2iQ-65497)
- The dcos-diagnostics component now rate limits diagnostic checks to avoid performance slowdowns in large clusters. (COPS-5915)
- A master node was not able to rejoin a cluster after failure/restart when another master was offline or being upgraded. (COPS-1754)
- Selecting *Enter* in the Secret ID textbox, reloaded the DC/OS UI. (D2iQ-14964)
- Tasks will not start until the Telegraf creates */run/dcos/telegraf/dcos_statsd.sock*. (COPS-6355)
- Marathon applications were not always scheduling new instances as expected. (COPS-6329)
- Hostname Resolution was failing for VIPs.	(COPS-6411)  
