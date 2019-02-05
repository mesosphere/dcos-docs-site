---
layout: layout.pug
navigationTitle:  Features
title: Features
menuWeight: 3
excerpt: Understanding the unique features of DC/OS
---

This is an overview of the unique features of DC/OS.


## <a name="high-resource-utilization"></a>High resource utilization

DC/OS makes it easy to get the most out of your computing resources. Deciding where to run processes to best utilize cluster resources is hard. Deciding where to place long-running services which have changing resource requirements over time is even harder. In reality, there is no single scheduler that can efficiently and effectively place all types of tasks.

DC/OS manages this problem by separating resource management from task scheduling. Mesos manages CPU, memory, disk, and GPU resources. Task placement is delegated to higher level schedulers that are more aware of their task's specific requirements and constraints. This model, known as two-level scheduling, enables multiple workloads to be colocated efficiently.

## <a name="mixed-workload-colocation"></a>Mixed workload colocation

DC/OS makes it easy to run all your computing tasks on the same hardware.

- For scheduling long-running services, DC/OS tightly integrates with Marathon to provide a solid stage on which to launch microservices, web applications, or other schedulers.
- For other types of work, DC/OS makes it easy to select and install from a library of industry-standard schedulers. This opens the door to running batch jobs, analytics pipelines, message queues, big data storage, and more.
- For complex custom workloads, you can even write your own scheduler to optimize and precisely control the scheduling logic for specific tasks.


## <a name="container-orchestration"></a>Container orchestration

DC/OS provides easy-to-use container orchestration right out of the box.

Docker provides a great development experience, but trying to run Docker containers in production presents significant challenges. To overcome these challenges, DC/OS includes Marathon as a core component, giving you a production-grade, well-tested scheduler that is capable of orchestrating both containerized and non-containerized workloads. With Marathon, you have the ability to reach extreme scale, scheduling tens of thousands of tasks across thousands of nodes. You can use highly configurable declarative application definitions to enforce advanced placement constraints with node, cluster, and grouping affinities.

## <a name="extensible-resource-isolation"></a>Extensible resource isolation

DC/OS makes it possible to configure multiple resource isolation zones.

Not all tasks have the same requirements. Some require maximum isolation for security or performance guarantees. Others are ephemeral, public, or easily restarted. The simplest isolation method is to just delegate to Docker. It is trivial to run Docker containers on DC/OS, but Docker is a bit of a blunt instrument when it comes to isolation. The [Mesos containerizer](http://mesos.apache.org/documentation/latest/mesos-containerizer/) is much more flexible, with multiple independently configurable isolators, and pluggable custom isolators. The Mesos containerizer can even run Docker containers without being chained to the fragility of `dockerd`.

## <a name="stateful-storage-support"></a>Stateful storage support

DC/OS gives your services multiple persistent and ephemeral storage options.

External persistent volumes, the basic requirements of block storage, are available on many platforms. These are easy to use and reason about because they work just like legacy server disks; however, by design, they compromise speed for elasticity and replication. Distributed file systems are a staple of cloud native applications, but they tend to require thinking about storage in new ways and are almost always slower due to network-based interaction.

Local ephemeral storage is the Mesos default for allocating temporary disk space to a service. This is enough for many stateless or semi-stateless 12-factor and cloud native applications, but may not be good enough for stateful services.

Local persistent volumes bridge the gap and provide fast, persistent storage. If your service is replicating data already, or your drives are a RAID backed up to nearline or tape drive, local volumes might give you enough fault tolerance without the speed tax.

## <a name="package-management"></a>Public management

DC/OS makes it easy to install both public community and private proprietary packaged services.

The Mesosphere Universe Package Repository connects you with a library of open source industry-standard schedulers, services, and applications. You can take advantage of community projects to handle batch job scheduling, highly available data storage, robust message queuing, and more. DC/OS also supports installing from multiple package repositories: you can host your own private packages to be shared within your company or with your customers.


## <a name="cloud-agnostic-installer"></a>Cloud-agnostic installer

The DC/OS Installer makes it easy to install DC/OS on any cluster of physical or virtual machines.

- For users with their own on-premise hardware or virtual machine provisioning infrastructure, the CLI Installer provides a quick, intuitive way to install DC/OS.
- For users deploying to the public cloud, DC/OS offers several configurable cloud provisioning templates for AWS, Azure, and Packet.
- For the advanced user, the Advanced Installer provides a scriptable, automatable interface to integrate with your prefered configuration management system.


## <a name="web-and-command-line-interfaces"></a>Web and command line interfaces

The DC/OS web and command line interfaces make it easy to monitor and manage the cluster and its services.

The DC/OS web interface lets you monitor resource allocation, running services, current tasks, component health, available packages, and more with intuitive browser-based navigation, real-time graphs, and interactive debugging tools.

The DC/OS command line interface provides control of DC/OS from a terminal. It is powerful, yet easily scriptable, with several plugins to interact with installed services.


## <a name="elastic-scalability"></a>Elastic scalability

DC/OS gives you the power to easily scale your services up and down with the turn of a dial.

Horizontal scaling is trivial in Marathon, as long as your service supports it. You can change the number of service instances at any time. DC/OS even lets you autoscale the number of instances based on session count, using the Marathon Load Balancer.

Vertical scaling is also supported in Marathon, allowing you to allocate more or fewer resources to services, and automatically performing a rolling update to reschedule the instances without downtime.

Adding nodes to a DC/OS cluster is easy. The DC/OS Installer uses immutable artifacts that allow you to provision new nodes without having to recompile, reconfigure, or re-download component packages from remote repositories.


## <a name="high-availability"></a>High availability

DC/OS is highly available and makes it easy for your services to be highly available too.

Mission-critical services require health monitoring, self-healing, and fault tolerance both for themselves and the platform and infrastructure they run on. DC/OS gives you multiple layers of protection.

To achieve self-healing, DC/OS services are monitored by Marathon and are restarted when they fail. Even legacy services that don't support distribution or replication can be automatically restarted by Marathon to maximize uptime and reduce service interruption. On top of that, all core DC/OS components, including Marathon, are monitored by the DC/OS diagnostics service and restarted by `systemd` when they fail.

To achieve fault tolerance, DC/OS can run in multiple master configurations. This provides not just system-level fault tolerance but also scheduler-level fault tolerance. DC/OS can even survive node failure during an upgrade with no loss of service.

## <a name="zero-downtime-upgrades"></a>Zero downtime upgrades

DC/OS provides automation for updating services and systems with zero downtime.

DC/OS services running on Marathon can all be updated with rolling, blue-green, or canary deployment patterns. If the update fails, you may roll it back with a single click. These powerful tools are critical for minimizing downtime and user interruption. DC/OS also supports zero-downtime upgrades with its powerful installer. You can stay up-to-date with the latest open source components with a single combined update.

## <a name="integration-tested-components"></a>Integration-tested components

DC/OS provides a well-tested set of open source components and brings them together with a single combined installer. Mixing and matching open source components can be difficult. You never know which versions will work together or what the side effects of their interactions will be. DC/OS allows you to get to production quickly, and focus on the quality of your products, not the stability of your platform.

## <a name="service-discovery-and-dist-load-balancing"></a>Service discovery and distributed load balancing

DC/OS includes several options for automating service discovery and load balancing.

Distributed services create distributed problems, but you do not have to solve them all yourself. DC/OS includes automatic DNS endpoint generation, an API for service lookup, transport layer (L4) virtual IP proxying for high speed internal communication, and application layer (L7) load balancing for external-facing services.

[enterprise]
## <a name="lb—mgmt-plane"></a>Control and management plane for distributed load balancers
[/enterprise]

DC/OS Enterprise provides a centralized management and control plane for service availability and performance monitoring.

While Distributed Load Balancers are ideal for service discovery and service availability of DC/OS Services, monitoring and managing them requires tooling and effort. DC/OS Enterprise comes with a centralized control and management plane for the DC/OS Distributed Load balancer, consisting of an aggregation API which unifies all distributed engines into a single service centric view and single set of service health metrics. DC/OS Enterprise also includes a Service Performance and health monitoring UI that helps monitor service performance, detect root cause service degradation issues, and identify root causes.

## <a name="perimeter-security"></a>Cluster perimeter security

DC/OS provides a prescriptive design to ensure that any administrative and programmatic communication between DC/OS Clusters and any client (UI/Browsers, CLIs, API Clients etc.) happens over the Admin security zone and all requests are transported over SSL secured channel. DC/OS Master nodes are the entry point into the DC/OS Cluster within the Admin security zone. More specifically, the API Gateway is a component named ‘Admin Router’ that serves as reverse proxy, managing all administrative connectivity into DC/OS Clusters.

[enterprise]
## <a name="identity-access-mgmt"></a>Identity and Access Management
[/enterprise]

DC/OS Enterprise includes built-in Identity and Access Management that allows you to create users and groups, and assign varying level of authorization privileges to each user and group. DC/OS Enterprise supports the following types of users and groups:

* Local users
* Local groups
* Remote LDAP users
* Remote LDAP groups (only for importing into local group)
* Remote SAML users
* Service user accounts

DC/OS Enterprise IAM service also includes support for authorization controls that can be assigned to each of the above principals/users. Users can be given a specific set of permissions in the form ‘Subject’ can perform ‘Action’ on ‘Object’, where ‘Object’ can be an API endpoint to a particular DC/OS service to a Marathon application group and ‘Action’ enumerates the set of actions that are possible on the object, such as “Create, Read, Update or Delete”.

[enterprise]
## <a name="identity-provider"></a>External Identity Provider with LDAP, SAML and OpenID connect
[/enterprise]

DC/OS Enterprise integrates identity providers that support the LDAP v3 interface (including Microsoft Active Directory) and SAML based identity providers, such that you can import users external to DC/OS from your existing user directory, and manage user and group authorizations within DC/OS.

[enterprise]
## <a name="cluster-encryption"></a>Cluster security with encrypted communication
[/enterprise]

DC/OS Enterprise is designed to run securely on-premises and in the cloud. To ensure cluster security, DC/OS Enterprise supports encrypted communication between DC/OS cluster internal components. This is achieved by ensuring that DC/OS runs with a Certificate Authority that issues certificates for DC/OS Master Nodes, and by ensuring that all Agent nodes have an installed `CA.crt` at bootstrap time. This mechanism ensures that all communication between the various services within DC/OS cluster is over secure SSL channels.

[enterprise]
## <a name="workload-isolation"></a>Workload isolation with container level authorization
[/enterprise]

DC/OS Enterprise supports fine-grained workload isolation to enable multiple business groups within an organization to run containers and workloads within a shared cluster. You are guaranteed that there is security isolation in addition to performance isolation provided by Linux cGroups between the varying workloads. Workload security isolation is performed by the DC/OS Authorization module that runs on every agent node. This module is responsible for making authorization checks against DC/OS IAM Service to verify that the user/owner of the workload is authorized to perform the action they are trying to execute anywhere within the cluster, including on the Agent node.

## <a name="software-defined-networks"></a>IP per container with extensible virtual networks (SDN)

DC/OS comes built-in with support for virtual networks, leveraging the Container Network Interface (CNI) standard. By default, one virtual network named `dcos` is created and any container that attaches to a Virtual Network receives its own dedicated IP. This allows you to run workloads that are not friendly to dynamically assigned ports and would rather bind the existing ports that are in their existing app configuration. Now, with support for dedicated IP/Container, workloads are free to bind to any port, since every container can access the entire available port range.

## <a name="network-isolation"></a>Network Isolation of virtual network subnets

DC/OS now supports the creation of multiple virtual networks at install time, and associates non-overlapping subnets with each of the virtual networks. DC/OS users can program network isolation rules across DC/OS agent nodes, to ensure that traffic across virtual network subnets is isolated.
