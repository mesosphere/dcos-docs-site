---
layout: layout.pug
navigationTitle:  Windows
title: External Persistent Volumes
menuWeight: 10
excerpt: Understanding the basics of DC/OS Mixed OS cluster operations
render: mustache
model: /mesosphere/dcos/2.1/data.yml
beta: true
---


#include /mesosphere/dcos/include/tutorial-disclaimer.tmpl

This DC/OS Windows tutorial will guide you through the steps necessary to get started using DC/OS Mixed OS cluster.

The tutorial describes how to start a DC/OS mixed OS Enterprise cluster. This feature is only supported on DC/OS version 2.1 and higher.

<p class="message--note"><strong>Note:</strong> Running the DC/OS installation with Universal Installer on Amazon AWS and Microsoft Azure has been fully-tested.</p>


# Supported features

These features are supported for DC/OS 2.1:
- Adding Windows DC/OS private agents to a DC/OS Cluster
- Executing under Microsoft Windows Server 1809 Core with Containers, or higher, with WINRM (HTTPS) enabled
- Provisioning Windows Nodes using universal installer (for use with Amazon AWS and Microsoft Azure)
- Provisioning On Prem (air-gapped) installations
- Docker Containerizer
- Running .NET applications in Windows Docker containers
- Running Jenkins Agent Nodes on Windows DC/OS Agents
- Load balancing using Marathon-LB
- DC/OS strict mode
- Upgrade of DC/OS Windows nodes
- Dynamic Master discovery is supported for the cluster in AWS.


# Limitations for GA

These features are not supported:
- Scalability beyond 10 Windows nodes is not tested
- DCOS-Net on Windows agent nodes
- EdgeLB
- statsd on Windows nodes is not supported
- Task commands in Mesos are incorrectly escaped, if commands contain quotes or other special characters they may not work.


## Implications of the current limitations

Because DCOS-Net is not supported, tasks running on Windows Agent nodes will not be able to resolve DNS names that use the .directory zone, which will prevent them from reaching services with names of the form, *service-name.marathon.l4lb.thisdcos.directory:port*


<p class="message--note"><strong>Note:</strong> Addresses in the format thisdcos.directory will not work. In addition, overlay network addresses will also not work.</p>

