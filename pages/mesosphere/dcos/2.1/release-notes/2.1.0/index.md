---
layout: layout.pug
navigationTitle: Release notes for 2.1.0
title: Release notes for 2.1.0
menuWeight: 10
render: mustache
beta: false
model:  /mesosphere/dcos/2.1/data.yml
excerpt: Release notes for DC/OS 2.1.0, including Open Source attribution, and version policy.
---
Mesosphere&reg; DC/OS&trade; 2.1.0 was released on 9, June 2020.

<p class="message--warning"><strong>WARNING:</strong> Upgrading from DC/OS 2.1.x to DC/OS 2.2.0 causes all Docker containers, launched by Docker Containerizer, in any cluster to be restarted due to an issue that changes the name of the 'libnetwork' certificate. Because of this, we recommend you upgrade directly to [DC/OS 2.2.1](https://docs.d2iq.com/mesosphere/dcos/2.2/release-notes/2.2.1/).</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers must contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

# New Features and Capabilities 

## Vertical Container Bursting
DC/OS now allows you to set a limit on the amount of CPUs and memory used by Marathon apps and pods. This means that services can run with a guaranteed amount of CPU and memory, while being allowed to consume up to a greater amount of these resources when free CPU cycles and/or memory is available. For more information, see [Creating Services](/mesosphere/dcos/2.1/deploying-services/creating-services/).

## Network Policies with Calico
Calico is now pre-installed in DC/OS 2.1 and can be used by containers to join overlay networks and set network policies. The DC/OS Calico component integrates Calico networking into DC/OS, providing the Calico CNI plug-in for Mesos Universal Container Runtime and the Calico libnetwork plug-in for Docker Engine. For more information, see [Calico](/mesosphere/dcos/2.1/networking/SDN/calico).

## Jobs Virtual Networking Support
Metronome based jobs can now join container networks to communicate with other services/jobs in the same network. For more information, see [Creating Jobs](/mesosphere/dcos/2.1/deploying-jobs/quickstart/).

## Custom Certificates for Admin Router
DC/OS now allows you to provide a non-CA custom external certificate and key that the Admin Router will then use for clients connecting to a cluster. For more information, see [Configuring a Custom External Certificate](/mesosphere/dcos/2.1/security/ent/tls-ssl/ar-custom/)

## Domain Sockets for Agent Executor Communication
Added a new configuration option `mesos_http_executors_domain_sockets`, which will cause the mesos-agent to use domain sockets when communicating with executors (default is enabled). This change allows administrators to write firewall rules blocking unauthorized access to the agent port 5051 since access to this will not be required anymore for executors to work.

# Breaking changes
- The configuration option `MARATHON_ACCEPTED_RESOURCE_ROLES_DEFAULT_BEHAVIOR` replaces the config option `MARATHON_DEFAULT_ACCEPTED_RESOURCE_ROLES`. Please see the Marathon [command-line flag documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/command-line-flags.md) for a description of the flag.
- Removal of`revive_offers_for_new_apps` Marathon option.
- Marathon no longer sanitizes the field `acceptedResourceRoles`. The field is an array of one or two values: `*` and the service role. Previously, when an invalid value was provided, Marathon would silently drop it. Now, it returns an error. If this causes a disruption, you can re-enable this feature by adding `MARATHON_DEPRECATED_FEATURES=sanitize_accepted_resource_roles` to the file `/var/lib/dcos/marathon/environment` on all masters. You must remove this line before upgrading to the next version of DC/OS.
- DC/OS Net now waits until agents become active before adding DNS entries for tasks on the agent to prevent resolving to unreachable addresses. (DCOS_OSS-5463)
- dcos-net (l4lb) allows for graceful shutdown of connections by changing the VIP backend weight to 0 when tasks are unhealthy or enter the TASK_KILLING state instead of removing them. (D2IQ-61077)
- Removed the spartan package from DC/OS. Is was deprecated in 1.11 and replaced by dcos-net.
- Removed the toybox package from DC/OS. Is was used only by Spartan.
- Removed the dcos-history-service from DC/OS. (DCOS-58529)
- New format for Admin Router access logs. (D2IQ-43957, DCOS-59598, D2IQ-62839)

# Component Versions
DC/OS 2.1.0 includes the following component versions:

- Apache&reg; Mesos&reg; 1.10.0-dev
- Marathon 1.10.17
- Metronome 0.6.44
- DC/OS UI to v5.0.41

# Fixed and Improved Issues
- Zookeeper log messages are now being forwarded to syslog. (COPS-6128)
- Fixed a critical error in Metronome where existing jobs appear to be lost after upgrade. (COPS-6092)
- (COPS-5951, COPS-5827)
- Fixed an issue where in some rare circumstances, after upgrading a cluster, users were no longer able to launch tasks that use the UCR containerizer. (D2IQ-64507, COPS-5868)
- Fixed an issue where image pull in UCR was not working for nvcr.io (missing ‘service’/‘scope’ parameters). (COPS-5804)
- Upgraded Java to version 8u232 to align with previous DC/OS releases. (DCOS-62548, COPS-5738)
- Fixed an issue where after a DC/OS upgrade, the executor resources used by tasks on the agent were being incorrectly counted against quota. (COPS-5725)
- DC/OS Admin Router now allows large packages of files, up to 32GB, to the Package Registry. (D2IQ-61233, COPS-5615)
- Additional logging has been added to the installation scripts to aid in debugging installation issues. (COPS-5428)
- Fixed an issue where the Mesos master crashed in some situations if an agent was drained and then subsequently reactivated. (COPS-5931, MESOS-10116)
- The dcos-diagnostics component now rate limits diagnostic checks to avoid performance slowdowns in large clusters. (COPS-5915)
- A dcos-cosmos template engine can now accept unescaped raw JSON fields. (COPS-5814)
- The dcos-telegraf component has been enhanced to allow configuration of the allowed_pending_messages parameter. (COPS-5629)
- Removed the octarine package from DC/OS.
- Removed the avro-cpp package from DC/OS.

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
