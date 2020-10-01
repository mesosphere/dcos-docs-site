---
layout: layout.pug
navigationTitle: Release notes for 2.2
title: Release notes for 2.2
menuWeight: 1
render: mustache
beta: true
model:  /mesosphere/dcos/2.2/data.yml
excerpt: Release notes for DC/OS 2.2, including Open Source attribution, and version policy.
---
Mesosphere&reg; DC/OS&trade; 2.2 Beta 1 was released on 17, September 2020.

[button color="light" href="https://downloads.dcos.io/dcos/testing/2.2.0-beta1/commit/bc8a362bd72269db6fc0b0ac287dc8251d4b4b35/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.io/dcos-enterprise/testing/2.2.0-beta1/commit/9d3b80b3206de4732ec81d8406f4ce1ac14a8406/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers must contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

# New features and capabilities 

## External storage with CSI volumes
DC/OS's Universal Container Runtime (UCR) now supports external volumes provided via the Container Storage Interface (CSI). Storage providers which integrate with the CSI specification provide plugins which DC/OS users may install into their cluster. These plugins allow volumes backed by that provider to be attached to task containers. This initial release of CSI support in DC/OS 2.2 has some caveats; see the [CSI documentation](/mesosphere/dcos/2.2/storage/external-storage/csi/) for more information.

# Jobs with dependencies
Metronome based jobs can have one more dependencies specified; a job will only be run when all of its dependencies have successfully run. This capability allows users to natively setup DAG based workflows in DC/OS. See the [documentation](mesosphere/dcos/2.2/deploying-jobs/quickstart#dependencies) for more information.

# Custom CA certificate rotation
DC/OS now allows an operator to rotate the custom CA certificates by simply updating configuration settings during an upgrade. This feature ensures all the services that are using the custom CA based certificates are automatically updated after an upgrade.

# Breaking changes

# Component Versions
DC/OS 2.2.0 includes the following component version updates:

# Fixed and Improved Issues

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
