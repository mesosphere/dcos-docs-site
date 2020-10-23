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

- COPS-6506
COPS-6218
- COPS-6360
- COPS-6335
- COPS-6355
- COPS-6190
- COPS-5920
- COPS-6534
- COPS-6381
- COPS-6519
- COPS-6512
- COPS-5897
- COPS-6529
- COPS-6533
- COPS-6324
- COPS-6341
- COPS-6139
- COPS-6411
- COPS-6422
- COPS-6085
- COPS-6116
- COPS-5979
- COPS-5915
- COPS-6555
- COPS-5629
- COPS-6491
- COPS-6111
- COPS-6166
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
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
