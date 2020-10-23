---
layout: layout.pug
navigationTitle: DC/OS 2.2 Release Notes
title: DC/OS 2.2 Release Notes
menuWeight: 1
render: mustache
beta: false
model:  /mesosphere/dcos/2.2/data.yml
excerpt: Release notes for DC/OS 2.2, including Open Source attribution, and version policy.
---
Mesosphere&reg; DC/OS&trade; 2.2 was released on 29, October 2020.

[button color="light" href="??"]Download DC/OS Open Source[/button]

[button color="purple" href="??"]Download DC/OS Enterprise* [/button]

New customers must contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

# New features and capabilities 

## External storage with CSI volumes
DC/OS's Universal Container Runtime (UCR) now supports external volumes provided via the Container Storage Interface (CSI). Storage providers which integrate with the CSI specification provide plugins which DC/OS users may install into their cluster. These plugins allow volumes backed by that provider to be attached to task containers. This initial release of CSI support in DC/OS 2.2 has some caveats. For more information, see the [CSI](/mesosphere/dcos/2.2/storage/external-storage/csi/).

# Jobs with dependencies
Metronome based jobs can have one more dependencies specified; a job will only be run when all of its dependencies have successfully run. This capability allows users to natively setup DAG based workflows in DC/OS. For more information, see [dependencies](mesosphere/dcos/2.2/deploying-jobs/quickstart#dependencies).

# Custom CA certificate rotation
DC/OS now allows an operator to rotate the custom CA certificates by simply updating configuration settings during an upgrade. This feature ensures all the services that are using the custom CA based certificates are automatically updated after an upgrade. For more information, see [??]

# Breaking changes

# Component Versions
DC/OS 2.2.0 includes the following component version updates:

# Fixed and Improved Issues

DC/OS 2.2 fixes the following issues:



- systemd errors were being thrown during patch upgrades. (COPS-6506)
- dcos-fluent-bit.service was consuming too much memory. (COPS-6218) 
- Selecting *Install DC/OS CLI* presents a URL to a binary that is incorrect. (COPS-6360)
- Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2IQ-70037) 
- Tasks would not start until Telegraf created /run/dcos/telegraf/dcos_statsd.sock. (COPS-6355)
- DC/OS installations on Flatcar Linux would not finish due to Java processing issues. (COPS-6422, D2IQ-70809, COPS-6190) 
- Unmounting issues in Mesos external persistent volumes. (COPS-5920)
- RootCA bundle was not written soon enough for Docker to find it before it exhausts startup limits on a reboot. (COPS-6534)
- UCR fetcher had issues pulling down images. (COPS-6381) 
- dcos-net was not always able to set all Spartan IP addresses after node reboot. (COPS-6519)
- dcos-telegraf.socket was down after a patch. (COPS-6512)
- Marathon migration failed while upgrading from 1.13.7 to 2.0.2. (COPS-5897)
- Nested Marathon groups were not inheriting enforceRole behavior from top-level groups. (COPS-6529)
- enforceRole was automatically being set to false on all Marathon groups. (COPS-6533)
- Selecting *Run* on a job or selecting *Delete* to remove a group had no effect and threw an exception. (COPS-6324) 
- etcd provided an incorrect response in calicoctl. (COPS-6341)  
- Users were unable to remove empty folders from Metronome. (COPS-6139) 
- Hostname Resolution was failing for VIPs. (COPS-6411)  
- Using file-based secrets caused mount failure and issues in the json editor. (COPS-6085, D2IQ-68114)  
- dse-0-node failed with ssl verification during Datastax-DSE upgrade from 2.1.2-5.1.2 to 2.2.0-5.1.2 on DC/OS 2.0.2. (COPS-6116)
- CRDB was running and bouncer can not connect to it, because the bouncer's SELECT query fails. (COPS-5979) 
- An unknown response code was received when querying a DC/OS endpoint. (COPS-5915, D2IQ-65296)  
- DC/OS UI showed unexpected information in **Services->Tasks table->CPU** column. (COPS-6555)
- Telgraf was consuming too much CPU. (COPS-5629)
- UI failed to show manually assigned port on endpoints tab. (COPS-6491)
- Exhibitor was writing JNA files to /tmp. (COPS-6111, D2IQ-68109) 
- Renaming or deleting folders via the Jupyter UI resulted in a rename error and delete failed. (COPS-6166)
- COPS-6232
- COPS-6326
- COPS-6295
- COPS-6328
- COPS-4665
- COPS-4616
- COPS-1754
- COPS-5520
- COPS-6451
- COPS-6321
- COPS-3866
- COPS-296
- COPS-5481
- COPS-4944

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
