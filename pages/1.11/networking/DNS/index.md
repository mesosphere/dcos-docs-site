---
layout: layout.pug
navigationTitle:  DNS
title: DNS Quick Reference
menuWeight: 20
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->
DC/OS provides a highly distributed and faulterant DNS-based service discovery mechanism. DNS is provided by two different components within DC/OS, [mesos-dns](/pages/1.11/networking/DNS/mesos-dns) and [dcos-dns](/pages/1.11/networking/DNS/dcos-dns). DNS service in DC/OS supports two  top-level domain names (TLD) `.mesos` and `.directory`. All records for the `.mesos` TLD are served by `mesos-dns` and all records for `.directory` TLD are served by `dcos-dns`. Please read the "Recommendation" section to better understand the usage of these two TLDs. Each of the TLD consist of multiple zones. Every DC/OS service gets multiple FQDN entries, from these different zones. Below we describe the different zones and the FQDN associated with those zones and the type of network connectivity that a service recieves when it is accessed using an FQDN from a particular zone.

For the purpose of illustration lets assume that we are running the following Docker container on DC/OS:
```
{
  "id": "/mygroup/myapp",
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "volumes": [],
    "docker": {
      "image": "nginx"
    },
    "portMappings": [
      {
        "containerPort": 80,
        "labels": {
          "VIP_0": "/mygroup/myapp:80"
        },
        "name": "http"
      }
    ]
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "name": "dcos",
      "mode": "container"
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```
The `/mygroup/myapp` is running on a virtual network called "dcos". We will use this app to describe the different FQDN it receives from DC/OS DNS.

*NOTE*: While the example uses a Docker container the same FQDNs are generated for a UCR container as well.

# `myapp.mygroup.marathon.mesos`
For any service launched on DC/OS, every instance of the service would get the FQDN `<service-name>.<group-name>.marathon.mesos`. 

This FQDN is resolved by `mesos-dns`. Please read the "Recommendation" section to understand the difference between using this FQDN vs using an FQDN from the `*.directory` TLD. The actual IP address to which this FQDN maps will depend on the networking mode on which the container is running. For our given example, since the application is running on an SDN the IP address will be the container's IP address. That said, if the application was running on host mode networking, than the IP address would have been that of the agent on which the application instance is running. For bridge mode networking, the IP address would again be that of the agent since the application would be accessible only through D-NAT rules on the agent.

# `myapp-mygroup.marathon.containerip.dcos.thisdcos.directory`
This FQDN is resolved by `dcos-dns`. For `container` and `bridge` mode networking, this FQDN would resolve to the container's IP address, whereas for `host` mode networking it would resolve to the agent IP, since that is the only IP address visible to the container.

# `myapp-mygroup.marathon.agentip.dcos.thisdcos.directory`
This FQDN is resolved by `dcos-dns`. Irrespective of the networking the FQDN would always resolve to the agent IP on which this application is running.

# `myapp-mygroup.marathon.autoip.dcos.thisdcos.directory`
This FQDN is resolved by `dcos-dns`. For `container` mode networking this would resolve to the container's IP address, but for `bridge` and `host` mode networking this would resolve to the agent's IP address. The reason for this discrepancy in the resolver, based on the different networking modes, is the connectivity available to the container in these different modes. In `container` mode networking the container can be reached through the container's IP address, however in bridge mode networking the container can be reached only through D-NAT on the agent and hence only through the agent's IP address. Similarly in host mode networking the container can be reached only through the agent's IP address. As can be seen this FQDN is the most versatile in determining connectivity to the container and should be used by default to connect to a given service. 

# `mygroupmyapp.marathon.l4lb.thisdcos.directory`
This is a special FQDN that is resolved by `dcos-dns`. This FQDN is primarily used for layer-4 load balancing by `dcos-l4lb` to all instances of this service. The FQDN is generated for a service only when load-balancing is explicitly enabled for the service by specifying the `VIP` label:
```
"labels": {
          "VIP_0": "/mygroup/myapp:80"
}
```
This FQDN resolves to a virtual IP address allocated by `dcos-l4lb` in the `11.x.x.x` range, which then maps to all the instances that corresponds to this service.

# SRV records (`_myapp.mygroup._tcp.marathon.mesos`):
SRV records are served by `mesos-dns`. This is not a DNS A record but rather a DNS SRV record. This is only available when the port has a name. SRV records are a mapping from a name to an "Address + Port" pair.
   
# FQDN for Schedulers other than Marathon
While describing the various FQDN available for services running on DC/OS we had specifically taken the example of tasks run through Marathon. Since most users would only use the built-in scheduler `Marathon` to launch tasks on Mesos they would not require any other FQDN other than the ones that are described above. There are however other schedulers that also run on top of DC/OS (Kafka, Cassandra, Spark to name a few). The DNS infrastructure in DC/OS generates all the FQDNs mentioned above for tasks launched by these schedulers as well, with the only difference that instead of `marathon` we use the scheduler's name to build out the FQDN. E.g., for a scheduler named `kafka` a task launched by `kafka` on Mesos would have the following FQDNs associated with it:
* `<taskname>.kafka.l4lb.thisdcos.directory`
* `<taskname>.kafka.containerip.dcos.thisdcos.directory`
* `<taskname>.kafka.agentip.dcos.thisdcos.directory`
* `<taskname>.kafka.autoip.dcos.thisdcos.directory`
* `<tasknam>.kafka.mesos`

# Recommendation
The `.mesos` TLD pre-dates the `.directory` TLD, and has been in existence primarily for backwards compatibility. While any service launched on DC/OS will get an FQDN both in the `.mesos` TLD and the `.directory` TLD,  it is recommended to use the `.directory` TLD to access services, since by design `dcos-dns` is more reactive and fault-taulerant than `mesos-dns`. That said, `mesos-dns` does provide a RESTful interface for accessing its records which allows the `.mesos` TLD to be available over an HTTP interface and not just over DNS.  
