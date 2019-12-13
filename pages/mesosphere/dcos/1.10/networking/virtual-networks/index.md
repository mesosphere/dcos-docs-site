---
layout: layout.pug
navigationTitle:  Virtual Networks
title: Virtual Networks
menuWeight: 4
excerpt:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS supports Container Networking Interface (CNI)-compatible virtual networking solutions, including [Calico](https://github.com/dcos/examples/tree/master/calico) and Contrail. DC/OS also provides a native virtual networking solution called DC/OS Overlay. 

# DC/OS Overlay
DC/OS Overlay provides an IP per container for Mesos and Docker containers alike. DC/OS Overlay uses CNI (Container Network Interface) for the [Mesos Containerizer](http://mesos.apache.org/documentation/latest/containerizers/#Mesos) and Docker libnetwork for the [Docker Containerizer](http://mesos.apache.org/documentation/latest/containerizers/#Docker).

DC/OS Overlay allows containers launched through the Mesos Containerizer or Docker Containerizer to co-exist on the same IP network, allocating each container its own unique IP address. DC/OS Overlay offers the following advantages:

* Both Mesos and Docker containers can communicate from within a single node and between nodes on a cluster.
* Services can run in isolation from other traffic coming from any other virtual network or host in the cluster.
* You don't have to worry about potentially overlapping ports in applications, or using workarounds to avoid overlapping (e.g. using nonstandard ports for services).
* You can generate any number of instances of a class of tasks and have them all listen on the same port so that clients don’t have to do port discovery.
* You can run applications that require intra-cluster connectivity, like Cassandra, HDFS, and Riak.
* You can create multiple virtual networks to isolate different portions of your organization, for instance, development, marketing, and production.

**Note:** Isolation guarantees among subnets depend on your firewall policies.

### Architecture

Here is the DC/OS Overlay architecture:

![Overview of the DC/OS Overlay architecture](/mesosphere/dcos/1.10/img/overlay-networks.png)

DC/OS Overlay does not require an external IP address management (IPAM) solution because IP allocation is handled via the Mesos Master replicated log. DC/OS Overlay does not support external IPAMs.

The components of the DC/OS Overlay interact in the following ways:

- Both the Mesos master and the Mesos agents run DC/OS overlay modules that communicate directly.

- The CNI isolator is used for the Mesos containerizer. [DNI](https://docs.docker.com/engine/userguide/networking/) is used for the Docker containerizer, shelling out to the Docker daemon.

- For intra-node IP discovery we use an overlay orchestrator called Virtual Network Service. This operator-facing system component is responsible for programming the overlay backend using a library called [lashup](https://github.com/dcos/lashup) that implements a gossip protocol to disseminate and coordinate overlay routing information among all Mesos agents in the DC/OS cluster.

**Note:** Your network must adhere to the [DC/OS system requirements](/mesosphere/dcos/1.10/installing/production/system-requirements/) to use DC/OS Overlay.

### Limitations

* DC/OS Overlay does not allow services to reserve IP addresses that result in ephemeral addresses for containers across multiple incarnations on the virtual network. This restriction ensures that a given client connects to the correct service.

  [VIPs (virtual IP addresses)](/mesosphere/dcos/1.10/networking/load-balancing-vips/) are built in to DC/OS and offer a clean way of allocating static addresses to services. If you are using DC/OS Overlay, you should use VIPs to access your services to support cached DNS requests and static IP addresses.

* The limitation on the total number of containers on DC/OS Overlay is the same value as the number of IP addresses available on the overlay subnet. However, the limitation on the number of containers on an agent depends on the subnet (which will be a subset of the overlay subnet) allocated to the agent. For a given agent subnet, half the address space is allocated to the `MesosContainerizer` and the other half is allocated to the `DockerContainerizer`.

* In DC/OS overlay, the subnet of a virtual network is sliced into smaller subnets and these smaller subnets are allocated to agents. When an agent has exhausted its allocated address range and a service tries to launch a container on the virtual network on this agent, the container launch will fail and the service will receive a `TASK_FAILED` message.

  Since there is no API to report the exhaustion of addresses on an agent, it is up to the service to infer that containers cannot be launched on a virtual network due to lack of IP addresses on the agent. This limitation has a direct impact on the behavior of services, such as Marathon, that try to launch services with a specified number of instances. Due to this limitation, services such as Marathon might not be able to complete their obligation of launching a service on a virtual network if they try to launch instances of a service on an agent that has exhausted its allocated IP address range.

  Keep this limitation in mind when debugging issues on frameworks that use a virtual network and you see the `TASK_FAILED` message.

* DC/OS Overlay uses Linux bridge devices on agents to connect Mesos and Docker containers to the virtual network. The names of these bridge devices are derived from the virtual network name. Since Linux has a limitation of fifteen characters on network device names, there is a character limit of thirteen characters for the virtual network name (two characters are used to distinguish between a CNI bridge and a Docker bridge on the virtual network).

* Certain names are reserved and cannot be used as DC/OS Overlay names. The is because DC/OS Overlay uses Docker networking underneath to connect Docker containers to the overlay, which in turn reserves certain network names. The reserved names are: `host`, `bridge` and `default`.

* [Marathon health checks](/mesosphere/dcos/1.10/deploying-services/creating-services/health-checks/) will not work with certain DC/OS Overlay configurations. If you are not using the default DC/OS Overlay configuration and Marathon is isolated from the virtual network, health checks will fail consistently even if the service is healthy.

  Marathon health checks _will_ work in any of the following circumstances:

  * You are using the default DC/OS Overlay configuration.
  * Marathon has access to the virtual network.
  * You use a [`command` health check](/mesosphere/dcos/1.10/deploying-services/creating-services/health-checks/).

<a name="virtual-network-service-dns"></a>
# Virtual Network Service: DNS

The [Virtual Network Service](/mesosphere/dcos/1.10/overview/architecture/components/) maps names to IPs on your virtual network. You can use these DNS addresses to access your task:

* **Container IP:** Provides the container IP address: `<taskname>.<framework_name>.containerip.dcos.thisdcos.directory`
* **Auto IP:** Provides a best guess of a task's IP address: `<taskname>.<framework_name>.autoip.dcos.thisdcos.directory`. This is used during migrations to the overlay.

Terminology:
* `taskname`: The name of the task
* `framework_name`: The name of the framework, if you are unsure, it is likely `marathon`
