---
layout: layout.pug
navigationTitle: Release notes for 2.0.6
title: Release notes for 2.0.6
menuWeight: 0
excerpt: Release notes for DC/OS 2.0.6, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.6 was released on ????, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.6/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.6/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 2.0.6 includes the following component versions:


### DC/OS Fixed and Improved Issues

- An issue where selecting **Install DC/OS CLI** presents a URL to a binary that is incorrect as been fixed. (COPS-6360)
- An issue where the Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode has been resolved. (COPS-6335, D2IQ-70037)
- An issue where selecting **Run** on a job or selecting **Delete** to remove a group had no effect and threw an exception has been resolved. (COPS-6324)
- An issue where DC/OS OSS UI was not displaying a user name, but instead showed a **User added through OIDC ID Token login** message has been resolved. (COPS-6295, D2IQ-70199) 
COPS-6166
COPS-6139
COPS-6111
COPS-6085
COPS-5979
COPS-5915
COPS-5629

D2IQ-69295
D2IQ-68868
D2IQ-68541
D2IQ-68114
D2IQ-68109
D2IQ-67994
D2IQ-67819
D2IQ-66022
D2IQ-65296
D2IQ-61304
D2IQ-14964
D2IQ-7844


## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
