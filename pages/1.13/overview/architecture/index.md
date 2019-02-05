---
layout: layout.pug
navigationTitle:  Architecture
title: Architecture
menuWeight: 2
excerpt: Understanding DC/OS architecture
enterprise: false
---

DC/OS is a platform for running distributed containerized software, like apps, jobs, and services. As a platform, DC/OS is distinct from and agnostic with respect to the infrastructure layer. This means that the infrastructure may consist of virtual or physical hardware, as long as it provides computing resources, storage, and networking.

![DC/OS Architecture Layers](/1.13/img/architecture-layers-redesigned.png)

*Figure 1 - DC/OS architecture layers*

## Software layer

At the software layer, DC/OS provides package management and a package repository to install and manage several types of services: databases, message queues, stream processors, artifact repositories, monitoring solutions, continuous integration tools, source control management, log aggregators, and so forth. In addition to these packaged apps and services, you may install your own custom apps, services, and scheduled jobs.

For more information, see [Task Types](/1.13/overview/architecture/task-types/).

## Platform layer

At the platform layer there are dozens of components grouped into the following categories:

- Cluster Management
- Container Orchestration
- Container Runtimes
- Logging and Metrics
- Networking
- Package Management
- IAM and Security [enterprise type="inline" size="small" /]
- Storage

These components are divided across multiple node types:

- Master Nodes
- Private Agent Nodes
- Public Agent Nodes

To install DC/OS, you must first provision each node with one of the supported host operating systems. For more information, see
- [Components](/1.13/overview/architecture/components/)
- [Node Types](/1.13/overview/architecture/node-types/)
- [Host Operating System](/1.13/overview/concepts/#host-operating-system).

## Infrastructure layer

At the infrastructure layer, you can install DC/OS on public clouds, private clouds, or on-premises hardware. Some of these install targets have automated provisioning tools, but almost any infrastructure can be used, as long as it includes multiple x86 machines on a shared IPv4 network.

For more information, see [Installing](/1.13/installing/).

## External components

In addition to the software that runs in the datacenter, DC/OS includes and integrates with several external components:

- [GUI](/1.13/gui/)
- [CLI](/1.13/cli/)
- [package repository](/1.13/administering-clusters/repo/)
- [container registry](/1.13/overview/concepts/#container-registry)
