---
layout: layout.pug
navigationTitle: Release notes for 2.1.0
title: Release notes for 2.1.0
menuWeight: 1
render: mustache
beta: true
model:  /mesosphere/dcos/2.1/data.yml
excerpt: Release notes for DC/OS 2.1.0, including Open Source attribution, and version policy.
---
Mesosphere&reg; DC/OS&trade; 2.1.0 beta was released on 7 May 2020.

[button color="light" href="https://downloads.dcos.io/dcos/testing/2.1.0-beta4/commit/24132bebea79dc1f75dfa295be4542020e8bae11/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.io/dcos-enterprise/testing/2.1.0-beta4/commit/1179b61542093274c2578a5e4a074a751bcbbb1a/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

# DC/OS 

## Components

DC/OS 2.1.0 Beta includes the following component versions:

- Apache&reg; Mesos&reg; 1.10.0-dev
- OpenSSL 1.1.1d	
- DC/OS UI to v5.0.23
- Grafana 6.0 
- OpenJDK 8
- Marathon 1.10.6
- logrotate 3.14.0
- Metronome 0.6.41 
- CNI 0.7.6 
- Boost 1.65.0 
- OpenResty to 1.15.8.3. 


# New Features and Capabilities 

## Resource Limits for Containers

DC/OS now allows you to set CPU and memory limits on services that are greater than the minimum guaranteed CPU/memory resources specified. This means that services can run with a guarantee of some amount of CPU and memory, while being allowed to consume up to a greater amount of these resources when free CPU cycles and/or memory is available. For more information, see [Creating Services](/mesosphere/dcos/2.1/deploying-services/creating-services/).

## Custom Certificate for Admin Router

The new Custom Certificates feature allows you to provide a custom non-CA certificate that is used by Admin Router for external clients connecting to a cluster. For more information, see [Configuring a Custom External Certificate](/mesosphere/dcos/2.1/security/ent/tls-ssl/ar-custom/)

## Calico for Network Policy
Calico is now pre-installed in a DC/OS cluster and can be used by containers to join overlay networks and set network policies.

## Jobs support for Container Network
Metronome based jobs can now join container networks to communicate with other services/jobs in the same network.

## Domain Sockets for Agent Executor Communication
Agents and Executors now communicate over Unix Domain sockets making operators life easy in the presence of container overlay networks.
### Deprecation of Marathon LB

### Hive Metastore for Spark SQL

### Add support for 3rd party CSI Driver in DSS

### Secure Kafka TLS with User Provided TLS Certs (HPE GIT)

### Certificate ( HPE GIT)

### 3rd Party DVDI driver usage (HPE GIT)

### Jenkins Support for DC/OS Windows

### Mesos Operator API scalability

### Advanced Jobs w/ Dependencies

### Configurable Mesos Flags to enable easy install time config

### Fault tolerance for Exhibitor to enable failover

## Issues fixed in this release

The issues that have been fixed in DC/OS 2.1.0 are listed below. Most change descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference


COPS-5951
COPS-5915
COPS-5868
COPS-5827
COPS-5814
COPS-5804
COPS-5738
COPS-5629
COPS-5617
COPS-5615
COPS-5428
### Marathon Fixed and Improved Issues

https://github.com/mesosphere/marathon/blob/master/changelog.md

## Breaking changes
Remove the octarine package from DC/OS. It was originally used as a proxy for the CLI but is not used for this purpose, anymore.

DC/OS Net: wait till agents become active before fanning out Mesos tasks. (DCOS_OSS-5463)

Remove the avro-cpp package from DC/OS. It was originally used as part of the metrics-collection framework which now relies on a different infrastructure.

Remove the spartan package from DC/OS. Is was deprecated in 1.11 and replaced by dcos-net.

Remove the toybox package from DC/OS. Is was used only by Spartan.

Remove the dcos-history-service from DC/OS. (DCOS-58529)

