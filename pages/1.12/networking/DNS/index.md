---
layout: layout.pug
navigationTitle:  DNS
title: DC/OS Domain Name Service
menuWeight: 20
excerpt: Understanding the DC/OS domain name service discovery

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS provides a distributed and fault tolerant DNS-based service discovery mechanism.

DNS is provided by two different components within DC/OS, `mesos-dns` and `dcos-dns`. These components support two top-level domain (TLD) names, `.mesos` and `.directory`. Please read the [Recommendation](#Recommendation) section and [Mesos-DNS](/1.12/networking/DNS/mesos-dns/) to better understand the usage of these two TLDs.

Each of the TLDs consists of multiple zones. Every DC/OS service gets multiple FQDN entries from these different zones. Each service that is launched on DC/OS through Marathon gets an FQDN in the form of  `<service-name>.mesos`. Moreover, **all** running services launched on DC/OS get an FQDN based upon the service that launched it, in the form `<service-name>.<group-name>.<framework-name>.mesos`.

<a name="Example1"></a>
Assume that the following UCR container is launched on DC/OS:
```json
{
  "id": "/mygroup/myapp",
  "instances": 1,
  "container": {
    "type": "MESOS",
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
  "mem": 32,
  "networks": [
    {
      "name": "dcos",
      "mode": "container"
    }
  ],
}
```
Example 1. UCR container launched on DC/OS

The different zones and the FQDN associated with those zones are described below, along with the type of network connectivity that a service receives when it is accessed using an FQDN from a particular zone.

### myapp.mygroup.marathon.mesos
This FQDN is exposed by `mesos-dns` as an A record. Please read the [Recommendation](#Recommendation) section to understand the difference between using this FQDN and using an FQDN from the `*.directory` TLD. The actual IP address to which this FQDN maps will depend on the networking mode that a container is using. For `host` and `bridge` mode networking, this FQDN will resolve to the agent IP address on which the container is launched, whereas for `container` mode networking it will resolve to the container's IP address. In [Example 1](#Example1), the FQDN will resolve to the container's IP address, as it is using `container` networking mode.

### myapp-mygroup.marathon.containerip.dcos.thisdcos.directory
This FQDN is exposed by `dcos-dns` as an A record. For `container` and `bridge` mode networking, this FQDN will resolve to the container's IP address, whereas for `host` mode networking it will resolve to the agent IP on which container is launched. In the current example, the `framework-name` is `marathon`. The FQDN will resolve to the container's IP address, as it is using `container` networking mode.

### myapp-mygroup.marathon.agentip.dcos.thisdcos.directory
This FQDN is exposed by `dcos-dns` as an A record. This FQDN will always resolve to the agent IP on which the container is running, irrespective of networking mode.

### myapp-mygroup.marathon.autoip.dcos.thisdcos.directory
This FQDN is exposed by `dcos-dns` as an A record. As the name suggests, `autoip` FQDN can resolve to the IP address that is most likely to reach the container. For instance, if a container is reachable via agent IP, as in host and bridge mode networking, then `autoip` FQDN will resolve to the agent IP. Similarly, in container mode networking it will resolve to the container's IP address.

### mygroupmyapp.marathon.l4lb.thisdcos.directory
If a service explicitly defines a `VIP` label as part of its app definition, then it gets an FQDN `<group-name><service-name>.<framework-name>.l4lb.thisdcos.directory`

In Example 1 above, the label looks like:
```
"labels": {
    "VIP_0": "/mygroup/myapp:80"
}
```

This FQDN is exposed by `dcos-dns` as an A record. It is primarily used for layer-4 load balancing. It resolves to a virtual IP address allocated by `dcos-l4lb` in the `11.x.x.x` range, which then maps to all the instances that correspond to this service.

# SRV records

See [SRV Records](/1.12/networking/DNS/mesos-dns/service-naming/#srv-records) for a full description of Mesos DNS SRV records.

- For a task named `mytask` launched by a service named `myservice`, Mesos-DNS generates an SRV record `_mytask._protocol.myservice.mesos`, where `protocol` is either `udp` or `tcp`.

- For more information on naming tasks and services in Mesos-DNS, see [Task and Service Naming Conventions](/1.12/networking/DNS/mesos-dns/service-naming/#task-and-service-naming-conventions).

### myapp.mygroup./_tcp.marathon.mesos:
If a service explicitly assigns a name to its port in the app definition, then it gets an FQDN `_<service-name>.<group-name>._<protocol>.<framework-name>.mesos`.

This FQDN is exposed by `mesos-dns` as an SRV record.

# FQDNs for frameworks other than Marathon
[Example 1](#Example1) uses Marathon, which is the default framework in DC/OS. However, there are other frameworks that also run on top of DC/OS, such as Kafka, Cassandra, Spark, and so on. The DNS infrastructure in DC/OS generates all the FQDNs mentioned above for services launched by these frameworks as well. The only difference is that the name `marathon` is replaced by that framework's name to build out the FQDNs. For instance, a service launched by framework `kafka` would have FQDNs such as:

* `<taskname>.kafka.l4lb.thisdcos.directory`
* `<taskname>.kafka.containerip.dcos.thisdcos.directory`
* `<taskname>.kafka.agentip.dcos.thisdcos.directory`
* `<taskname>.kafka.autoip.dcos.thisdcos.directory`
* `<taskname>.kafka.mesos`

# <a name="Recommendation"></a>Recommendation
The `.mesos` TLD pre-dates the `.directory` TLD, and has been maintained primarily for the sake of backwards compatibility. While any service launched on DC/OS will get an FQDN both in the `.mesos` TLD and the `.directory` TLD, it is recommended to use the `.directory` TLD to access services, since by design `dcos-dns` is more reactive and fault-taulerant than `mesos-dns`. That said, `mesos-dns` does provide a RESTful interface for accessing its records, which allows the `.mesos` TLD to be available over an HTTP interface and not just over DNS.  

