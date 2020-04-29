---
layout: layout.pug
navigationTitle: Release notes for 2.1.0
title: Release notes for 2.1.0
beta: true
menuWeight: 0
render: mustache
beta: true
model: /mesosphere/dcos/2.1/data.yml
excerpt: Release notes for DC/OS 2.1.0, including Open Source attribution, and version policy.
---
DC/OS 2.1.0 Beta was released on 24 April, 2020.

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

## Resource Limits for Containers

DC/OS now allows you to set CPU and memory limits on services that are greater than the minimum guaranteed CPU/memory resources specified. This means that services can run with a guarantee of some amount of CPU and memory, while being allowed to consume up to a greater amount of these resources when free CPU cycles and/or memory is available. For more information, see [Creating Services](/mesosphere/dcos/2.1/deploying-services/creating-services/).

## Custom Certificate for Admin Router

This feature allows operators to provide a custom non-CA certificate that is used by Admin Router for external clients connecting to the cluster.

## Calico for Network Policy
Calico is now pre-installed in a DC/OS cluster and can be used by containers to join overlay networks and set network policies.

## Jobs support of Container Network
Metronome based jobs can now join container networks to be able to communicate with other services/jobs in that network.

## Domain Sockets for Agent Executor Communication

Agents and Executors now communicate over Unix Domain sockets making operators life easy in the presence of container overlay networks.
