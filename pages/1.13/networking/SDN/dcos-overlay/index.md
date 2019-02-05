---
layout: layout.pug
navigationTitle:  DC/OS Overlay
title: DC/OS Overlay
menuWeight: 10
excerpt: Understanding DC/OS Overlay
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS Overlay is an SDN solution for UCR and Docker containers that comes pre-packaged with DC/OS and is enabled by default. DC/OS Overlay can run multiple virtual network instances in a given DC/OS cluster. Starting with DC/OS 1.11, DC/OS Overlay has support for creating IPv6 networks. 

<p class="message--note"><strong>NOTE: </strong>IPv6 support is available only for Docker containers.</p>

Features provided by DC/OS Overlay are:
* Both Mesos and Docker containers can communicate from within a single node and between nodes on a cluster.
* Services can be created such that their traffic is isolated from other traffic coming from any other virtual network or host in the cluster.
* Removes the need to worry about potentially overlapping ports in applications, or the need to use nonstandard ports for services to avoid overlapping.
* You can generate any number of instances of a class of tasks and have them all listen on the same port so that clients do not have to do port discovery.
* You can run applications that require intra-cluster connectivity, like Cassandra, HDFS, and Riak.
* You can create multiple virtual networks to isolate different portions of your organization, for instance, development, marketing, and production.

Details about the design and implementation of DC/OS Overlay can be found in the [Overlay introduction](/1.12/overview/design/overlay/). The default configuration of DC/OS Overlay provides an IPv4 virtual network, `dcos`, and an IPv6 virtual network `dcos6` whose YAML configuration is as follows:

```yaml
 dcos_overlay_network :
   vtep_subnet: 44.128.0.0/20
   vtep_subnet6: fd01:a::/64
   vtep_mac_oui: 70:B3:D5:00:00:00
   overlays:
     - name: dcos
       subnet: 9.0.0.0/8
       prefix: 24
     - name: dcos6
       subnet6: fd01:b::/64
       prefix6: 80
```

Each virtual network is identified by a canonical `name` (see [limitations](#limitations) for constraints on naming virtual networks). Containers launched on a virtual network get an IP address from the subnet allocated to the virtual network. To remove the dependency on a global IPAM, the overlay subnet is further split into smaller subnets. Each of the smaller subnets is allocated to an agent. The agents can then use a host-local IPAM to allocate IP addresses from their respective subnets to containers launched on the agent and attached to the given overlay. The `prefix` determines the size of the subnet (carved from the overlay subnet) allocated to each agent and thus defines the number of agents on which the overlay can run. For instance, in the default configuration above the virtual network `dcos` is allocated a /8 subnet (in the “subnet” field), which is then divided into /26 container subnets to be used on each host that will be part of the network (in the “prefix” field) as shown:

![Virtual network address space](/1.12/img/overlay-network-address-space.png)

Figure 1. Virtual network address space

The bits reserved for ContainerID (6 in this example) are then subdivided into two equal groups (of 5 bits, in this example) that are used for Mesos containers and Docker containers respectively. With the default configuration, each agent will be able to host a maximum of 2^5=32 Mesos containers and 32 docker containers. With this specific configuration, if a service tries to launch more than 32 tasks on the Mesos containerizer or the Docker containerizer, it will receive a `TASK_FAILED`. Consult the [limitations](#limitations) section of the main Virtual Networks page to learn more about this constraint.

While the above example is specifically for an IPv4 virtual network, the same logic can be applied to the IPv6 virtual network `dcos6` as well. The only difference is that currently IPv6 is supported only for Docker containers. 

<p class="message--warning"><strong>WARNING: </strong>Trying to launch a UCR container on <code> dcos6</code>, will result in a container launch failure.</p>

You can modify the default virtual network configuration and can add more virtual networks if needed. Currently, you can only add or delete a virtual network at install time. 

# Adding virtual networks during installation

DC/OS virtual networks can only be added and configured at install time. To replace or add another virtual network, [reinstall DC/OS according to these instructions](#replace).

The default network can be overriden, or additional virtual networks can be configured, by modifying the `config.yaml` file:

```yaml
    agent_list:
    - 10.10.0.117
    - 10.10.0.116
    # Use this bootstrap_url value unless the DC/OS installer assets have been moved.
    bootstrap_url: file:///opt/dcos_install_tmp
    cluster_name: &lt;cluster-name&gt;
    master_discovery: static
    master_list:
    - 10.10.0.120
    - 10.10.0.119
    - 10.10.0.118
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ssh_port: 22
    ssh_user: centos
    dcos_overlay_network:
      vtep_subnet: 44.128.0.0/20
      vtep_mac_oui: 70:B3:D5:00:00:00
      overlays:
        - name: dcos
          subnet: 9.0.0.0/8
          prefix: 26
        - name: dcos-1
          subnet: 192.168.0.0/16
          prefix: 24
```

In the above example, two virtual networks have been defined. The virtual network `dcos` retains the default virtual network, and another virtual network called `dcos-1` with subnet range `192.168.0.0/16` has been added. In DC/OS Overlay, virtual networks must be associated with a name and a subnet. That name is used to launch Marathon tasks and other Mesos framework tasks using this specific virtual network (see [usage](/1.12/networking/SDN/usage/)). Due to restrictions on the size of Linux device names, the virtual network name must be less than thirteen characters. Consult the [limitations](#limitations) section of the main Virtual Networks page to learn more.

# Retrieving virtual network state

After DC/OS installation is complete, the virtual network configuration can be obtained from `https://leader.mesos:5050/overlay-master/state` endpoint. The `network` section, in below snippet, lists the current overlay configuration and the `agents` section is a list showing how overlays are split across the Mesos agents. The following shows the network state when there is a single overlay in the cluster named `dcos`.

```json

  "agents": [
    {
      "ip": "172.17.0.2",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.1/20",
              "vtep_ip6": "fd01:a::1/64",
              "vtep_mac": "70:b3:d5:80:00:01",
              "vtep_name": "vtep1024"
            }
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.0.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.1/20",
              "vtep_ip6": "fd01:a::1/64",
              "vtep_mac": "70:b3:d5:80:00:01",
              "vtep_name": "vtep1024"
            }
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b::/80"
        }
      ]
    },
    {
      "ip": "172.17.0.4",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.2/20",
              "vtep_ip6": "fd01:a::2/64",
              "vtep_mac": "70:b3:d5:80:00:02",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip": "9.0.1.128/25",
            "name": "d-dcos"
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "mesos_bridge": {
            "ip": "9.0.1.0/25",
            "name": "m-dcos"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.1.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.2/20",
              "vtep_ip6": "fd01:a::2/64",
              "vtep_mac": "70:b3:d5:80:00:02",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip6": "fd01:b::1:8000:0:0/81",
            "name": "d-dcos6"
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "mesos_bridge": {
            "ip6": "fd01:b:0:0:1::/81",
            "name": "m-dcos6"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b:0:0:1::/80"
        }
      ]
    },
    {
      "ip": "172.17.0.3",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.3/20",
              "vtep_ip6": "fd01:a::3/64",
              "vtep_mac": "70:b3:d5:80:00:03",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip": "9.0.2.128/25",
            "name": "d-dcos"
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "mesos_bridge": {
            "ip": "9.0.2.0/25",
            "name": "m-dcos"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.2.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.3/20",
              "vtep_ip6": "fd01:a::3/64",
              "vtep_mac": "70:b3:d5:80:00:03",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip6": "fd01:b::2:8000:0:0/81",
            "name": "d-dcos6"
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "mesos_bridge": {
            "ip6": "fd01:b:0:0:2::/81",
            "name": "m-dcos6"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b:0:0:2::/80"
        }
      ]
    }
  ],
  "network": {
    "overlays": [
      {
        "name": "dcos",
        "prefix": 24,
        "subnet": "9.0.0.0/8"
      },
      {
        "name": "dcos6",
        "prefix6": 80,
        "subnet6": "fd01:b::/64"
      }
    ],
    "vtep_mac_oui": "70:B3:D5:00:00:00",
    "vtep_subnet": "44.128.0.0/20",
    "vtep_subnet6": "fd01:a::/64"
  }
}
```

# Deleting Virtual Networks

To delete a virtual network, uninstall DC/OS, then delete the overlay replicated log on the master nodes and the iptable rules on the agent nodes that are associated with the virtual networks.

## The Overlay Replicated Log

DC/OS Overlay uses a replicated log to persist the virtual network state across Mesos master reboots and to recover overlay state when a new Mesos master is elected. The overlay replicated log is stored at `/var/lib/dcos/mesos/master/overlay_replicated_log`. The overlay replicated log is **not** removed when DC/OS is uninstalled from the cluster, so you need to delete this log manually before reinstalling DC/OS. Otherwise, the Mesos master will try to reconcile the existing overlay replicated log during startup and will fail if it finds a virtual network that was not configured.

<p class="message--note"><strong>NOTE: </strong>The overlay replicated log is different from the <a href="http://mesos.apache.org/documentation/latest/replicated-log-internals/"> master's replicated log</a>, which is stored at <code>/var/lib/mesos/master/replicated_log</code>. Removing the overlay replicated log will have no effect on the master's recovery semantics.</p>

## iptables
The virtual networks install IPMASQ rules to allow containers to talk outside the virtual network. When you delete or replace virtual networks, you must remove the rules associated with the previous virtual networks. To remove the IPMASQ rules associated with each overlay, remove the IPMASQ rule from the POSTROUTING change of the NAT table that corresponds to the virtual networks subnet. Remove these rules on each agent node.

<a name="replace"></a>
# Replacing or Adding New Virtual Networks

To replace your virtual network, uninstall DC/OS and delete the overlay replicated log on the master nodes and the iptable rules on the agent nodes. Then, reinstall with the desired networks specified in your `config.yaml` file.

# Troubleshooting

The **Networking** tab of the DC/OS web interface provides information helpful for troubleshooting. It contains information about the virtual networks from DC/OS Overlay that a container is associated with and the IP address of the container on that virtual network.

`NOTE: The network tab currently displays information about containers that are associated with virtual networks managed by DC/OS Overlay. It does not have information about containers running on virtual networks managed by any other CNI/CNM provider`.

<a name="limitations"></a>
### Limitations
* DC/OS Overlay supports IPv6 networks only for Docker containers. Launching UCR containers on an IPv6 network will result in a container launch failure. To keep it future-proof, however, when a subnet is allocated to an agent, IPv6 subnets are pre-allocated to MesosContainerizer and DockerContainerizer following the same logic used for IPv4 networks.

* DC/OS Overlay does not allow services to reserve IP addresses that result in ephemeral addresses for containers across multiple incarnations on the virtual network. This restriction ensures that a given client connects to the correct service.

DC/OS provides FQDNs in different [zones](/1.12/networking/DNS/) that offer a clean way of accessing services through predictable URLs. If you are using DC/OS Overlay, you should use one of the FQDNs provided by the DC/OS DNS service to make it easy for clients to discover the location of your service.

* The limitation on the total number of containers on DC/OS Overlay is the same value as the number of IP addresses available on the overlay subnet. However, the limitation on the number of containers on an agent depends on the subnet (which will be a subset of the overlay subnet) allocated to the agent. For a given agent subnet, half the address space is allocated to the `MesosContainerizer` and the other half is allocated to the `DockerContainerizer`.

* In DC/OS Overlay, the subnet of a virtual network is sliced into smaller subnets and these smaller subnets are allocated to agents. When an agent has exhausted its allocated address range and a service tries to launch a container on the virtual network on this agent, the container launch will fail and the service will receive a `TASK_FAILED` message.

  Since there is no API to report the exhaustion of addresses on an agent, it is up to the service to conclude that containers cannot be launched on a virtual network due to lack of IP addresses on the agent. This limitation has a direct impact on the behavior of services, such as Marathon, that try to launch services with a specified number of instances. Due to this limitation, services such as Marathon might not be able to complete their obligation of launching a service on a virtual network if they try to launch instances of a service on an agent that has exhausted its allocated IP address range.

  Keep this limitation in mind when debugging issues on frameworks that use a virtual network and you see the `TASK_FAILED` message.

* DC/OS Overlay uses Linux bridge devices on agents to connect Mesos and Docker containers to the virtual network. The names of these bridge devices are derived from the virtual network name. Since Linux has a limitation of fifteen characters on network device names, there is a character limit of thirteen characters for the virtual network name (two characters are used to distinguish between a CNI bridge and a Docker bridge on the virtual network).

* Certain names are reserved and cannot be used as DC/OS Overlay names. The is because DC/OS Overlay uses Docker networking underneath to connect Docker containers to the overlay, which in turn reserves certain network names. The reserved names are: `host`, `bridge` and `default`.

* [Marathon health checks](/1.12/deploying-services/creating-services/health-checks/) will not work with certain DC/OS Overlay configurations. If you are not using the default DC/OS Overlay configuration and Marathon is isolated from the virtual network, health checks will fail consistently even if the service is healthy.

  Marathon health checks will work in any of the following circumstances:

  * You are using the default DC/OS Overlay configuration.
  * Marathon has access to the virtual network.
  * You use a [`command` health check](/1.12/deploying-services/creating-services/health-checks/).
