---
layout: layout.pug
navigationTitle: Release notes for 2.1.1
title: Release notes for 2.1.1
menuWeight: 5
excerpt: Release notes for DC/OS 2.1.1, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.1.1 was released on 27 August, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 2.1.1 includes the following component versions:

- Apache Mesos 1.9.1-dev
- Marathon 1.9.136
- DC/OS UI 5.1.7
- Fluentbit 1.4.6

### DC/OS Fixed and Improved Issues

DC/OS 2.1.1 fixes the following issues:

- Selecting **Install DC/OS CLI** presents a URL to a binary that is incorrect. (COPS-6360)
- The Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2IQ-70037)
- Selecting **Run** on a job or selecting **Delete** to remove a group had no effect and threw an exception. (COPS-6324)
- DC/OS OSS UI was not displaying a user name, but instead showed a **User added through OIDC ID Token login** message. (COPS-6295, D2IQ-70199) 
- Renaming or deleting folders via the Jupyter UI resulted in a Rename Error and Delete Failed. (COPS-6166, DCOS_OSS-5967)
- Users were unable to remove empty folders from Metronome. (COPS-6139, D2IQ-68541)
- Exhibitor was writing JNA files to /tmp. (COPS-6111, D2IQ-68109, D2IQ-68868) 
- Using file-based secrets caused mount failure and issues in the json editor. (COPS-6085, D2IQ-68114, D2IQ-67819) 
- An unknown response code was received when querying DC/OS health endpoints. (COPS-5915, COPS-5979, D2IQ-65296, D2IQ-69169) 
- After an upgrade, the dcos-telegraf directories had incorrect permissions leading to a problem launching tasks. (COPS-6232, D2IQ-69295)
- In the DC/OS UI, selecting **Enter** in the Secret ID textbox reloaded the page. (D2IQ-14964) 
- Running two CLI installers from the same machine aborted with an error. (D2IQ-7844) 
- A master node was not able to rejoin a cluster after failure/restart when another master was offline or being upgraded. (COPS-1754, D2iQ-4248) 
- An error was thrown when unmounting external persistent volumes in Mesos. (COPS-5920, D2IQ-65497)
- A critical error in Metronome where existing jobs appear to be lost after upgrade. (DCOS_OSS-5965, COPS-6174)
- DC/OS installations on Flatcar Linux would not finish due to Java processing issues. (COPS-6422, D2IQ-70809, COPS-6190)
- Exhibitor endpoint responses were inconsistent. (D2IQ-70393, COPS-6326) 
- The Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2IQ-70025) 
- The file bootstrap.py was updated to check for changes to the signing certificate authority. (D2IQ-69408) 
- Frameworks could interfere with Marathon pods by launching tasks on resources reserved to Marathon. (D2IQ-68800)
- etcd was providing an incorrect response in calicoctl. (COPS-6341) 
- dcos-fluent-bit.service was consuming too much memory. (COPS-6218)

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/802a50f4902f1f5ca3829dca4a472d8a582f7b9b/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
