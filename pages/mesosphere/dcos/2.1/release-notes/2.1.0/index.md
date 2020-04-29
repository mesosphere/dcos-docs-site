---
layout: layout.pug
navigationTitle: Release notes for 2.1.0
title: Release notes for 2.1.0
menuWeight: 5
render: mustache
beta: true
model: /mesosphere/dcos/2.1/data.yml
excerpt: Release notes for DC/OS 2.1.0, including Open Source attribution, and version policy.
---
DC/OS 2.1.0 Beta was released on 7 May, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known Issues and Limitations](#known-issues-and-limitations) to see if any potential operational changes for specific scenarios apply to your environment.

# DC/OS 

## Components

DC/OS 2.1.0 includes the following component versions:

- Apache&reg; Mesos&reg; 1.8.2-dev
- OpenSSL 1.1.1d	
- DC/OS UI to master+v2.150.2.
- Grafana 6.0 

# New Features and Capabilities 

### Resource Limits for Containers

DC/OS now allows you to set CPU and memory limits on services that are greater than the minimum guaranteed CPU/memory resources specified. This means that services can run with a guarantee of some amount of CPU and memory, while being allowed to consume up to a greater amount of these resources when free CPU cycles and/or memory is available. For more information, see [Creating Services](/mesosphere/dcos/2.1/deploying-services/creating-services/).



### Deprecation of Marathon LB


### Hive Metastore for Spark SQL

### Domain socket based communication

Deploy CNI Plugins that communicate to exector/agent over non-tcp/IP Sockets SO THAT I need not punch iptable holes to create degraded security posture.

### Calico in DC/OS 

Expose the Calico network in an open and enterprise DC/OS cluster
An operator should be able to specify the subnet used across the Calico network before launching the cluster
An operator should be able to create calico-network supported tasks managed by Marathon and other frameworks on Mesos.
Support Calico network policy via Calico profile
Support the default calico profile in DC/OS named calico works for applications with different kinds of labels

### High Availability Improvements

Master nodes should be able to restart when quorum of master nodes are up. Exhibitor coordination: add fault tolerance 


### Add support for 3rd party CSI Driver in DSS

### Secure Kafka TLS with User Provided TLS Certs (HPE GIT)

### Secure external Admin Router Interface with user provided 

### Certificate ( HPE GIT)

### Document 3rd Party DVDI driver usage (HPE GIT)

### Jenkins Support for DC/OS Windows

### Mesos Operator API scalability

### Advanced Jobs w/ Dependencies


### Configurable Mesos Flags to enable easy install time config

### Fault tolerance for Exhibitor to enable failover

## Custom Certificate for Admin Router

This feature allows operators to provide a custom non-CA certificate that is used by Admin Router for external clients connecting to the cluster.

## Calico for Network Policy
Calico is now pre-installed in a DC/OS cluster and can be used by containers to join overlay networks and set network policies.

## Jobs support of Container Network
Metronome based jobs can now join container networks to be able to communicate with other services/jobs in that network.

## Domain Sockets for Agent Executor Communication

Agents and Executors now communicate over Unix Domain sockets making operators life easy in the presence of container overlay networks.

## Other Improvements
Upgrade coreOS AMIs (D2IQ-64271)

Added a new configuration option mesos_http_executors_domain_sockets, which will cause the mesos-agent to use domain sockets when communicating with executors. While this change should not have any visible impact on users in itself, it does enable administrators to write firewall rules blocking unauthorized access to the agent port 5051 since access to this will not be required anymore for executors to work.

Switched from Oracle Java 8 to OpenJDK 8 (DCOS-54902)

Updated DC/OS UI to v5.0.23.

The configuration option MARATHON_ACCEPTED_RESOURCE_ROLES_DEFAULT_BEHAVIOR replaces the config option MARATHON_DEFAULT_ACCEPTED_RESOURCE_ROLES. Please see the Marathon command-line flag documentation for a description of the flag.

Updated to Mesos 1.10.0-dev

Mesos overlay networking: support dropping agents from the state. (DCOS_OSS-5536)

Update CNI to 0.7.6

Updated to Boost 1.65.0 (DCOS_OSS-5555)

Admin Router: Accept nil task list from Marathon when updating cache. (DCOS_OSS-5541)

Marathon pod instances are now included in the DC/OS diagnostic bundle (DCOS_OSS-5616)

Replace docker-gc with docker system prune. (DCOS_OSS-5441)

Port the Mesos Fluent Bit container logger module to Windows. (DCOS-58622)

Port the Mesos open source metrics module to Windows. (DCOS-58008)

Add etcd into DC/OS. (DCOS-59004)

Add etcd metrics into the DC/OS Telegraf Pipeline. (D2IQ-61004)

Update libpq to 9.6.15 (DCOS-59145)

Enable proxing of gRPC requests through Admin Router (DCOS-59091)

Calico in DC/OS: introduced Calico networking into DC/OS, and provided network policy support (DCOS-58413)

The config option calico_network_cidr can be set to a valid IPv4 CIDR range for Calico networks to use (default 172.29.0.0/16) (DCOS-60734)

Calico network: When using the Universal Runtime Engine, the contents of the DCOS_SPACE network label will be compressed to <7-char hash>...<last 53 chars> if it is longer than 63 characters. (D2IQ-62219)

Update logrotate to 3.14.0 (DCOS_OSS-5947)

Update Marathon to 1.10.6
Adds support for Mesos Resource Limits (D2IQ-61131) (D2IQ-61130)
Removes revive_offers_for_new_apps option.
Breaking changes
Remove the octarine package from DC/OS. It was originally used as a proxy for the CLI but is not used for this purpose, anymore.

DC/OS Net: wait till agents become active before fanning out Mesos tasks. (DCOS_OSS-5463)

Remove the avro-cpp package from DC/OS. It was originally used as part of the metrics-collection framework which now relies on a different infrastructure.

Remove the spartan package from DC/OS. Is was deprecated in 1.11 and replaced by dcos-net.

Remove the toybox package from DC/OS. Is was used only by Spartan.

Remove the dcos-history-service from DC/OS. (DCOS-58529)

New format for Admin Router access logs. (D2IQ-43957, DCOS-59598, D2IQ-62839)

Update OpenResty to 1.15.8.3. (DCOS-61159, D2IQ-66506)

Marathon
Marathon no longer sanitizes the field "acceptedResourceRoles". The field is an array of one or two values: * and the service role. Previously, when an invalid value was provided, Marathon would silently drop it. Now, it returns an error. If this causes a disruption, you can re-enable this feature by adding MARATHON_DEPRECATED_FEATURES=sanitize_accepted_resource_roles to the file /var/lib/dcos/marathon/environment on all masters. You must remove this line before upgrading to DC/OS 2.2.
Fixed and improved
Reserve all agent VTEP IPs upon recovering from replicated log. (DCOS_OSS-5626)

Set network interfaces as unmanaged for networkd only on coreos. (DCOS-60956)

Allow Admin Router to accept files up to 32GB, such as for uploading large packages to Package Registry. (DCOS-61233)

Update Kazoo to version 2.6.1. (DCOS-63065)

Updated dcos-config.yaml to support some Mesos Flags. (DCOS-59021)

Fix Telegraf migration when no containers present. (D2IQ-64507)

Update to OpenSSL 1.1.1g. (D2IQ-67050)

Adjust dcos-net (l4lb) to allow for graceful shutdown of connections by changing the VIP backend weight to 0 when tasks are unhealthy or enter the TASK_KILLING state instead of removing them. (D2IQ-61077)

Set "os:linux" attribute for the Linux agents. (D2IQ-67223)

Update Marathon to 1.10.6
Marathon updated to 1.9.136

/v2/tasks plaintext output in Marathon 1.5 returned container network endpoints in an unusable way (MARATHON-8721)

Marathon launched too many tasks. (DCOS_OSS-5679)

Marathon used to omit pod status report with tasks in TASK_UNKOWN state. (MARATHON-8710)

With UnreachableStrategy, setting expungeAfterSeconds and inactiveAfterSeconds to the same value will cause the instance to be expunged immediately; this helps with GROUP_BY or UNIQUE constraints. (MARATHON-8719)

Marathon was checking authorization for unrelated apps when performing a kill-and-scale operations; this has been resolved. (MARATHON-8731)

A race condition would cause Marathon to fail to start properly. (MARATHON-8741)

Update Metronome to 0.6.41
There was a case where regex validation of project ids was ineffecient for certain inputs. The regex has been optimized. (MARATHON-8730)

Metronome jobs networking is now configurable (MARATHON-8727)


# Marathon

## Components

DC/OS 2.0.3 includes the following Marathon&trade; component version:

- Marathon 1.9.136
- Metronome 0.6.41

### Marathon Fixed and Improved Issues

https://github.com/mesosphere/marathon/blob/master/changelog.md 
