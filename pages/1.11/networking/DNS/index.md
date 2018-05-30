---
layout: layout.pug
navigationTitle:  DNS
title: DNS Quick Reference
menuWeight: 20
excerpt: Understanding the DC/OS domain name service 

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS provides a distributed and fault tolerant DNS-based service discovery mechanism.

DNS is provided by two different components within DC/OS, [mesos-dns](/pages/1.11/networking/DNS/mesos-dns) and [dcos-dns](/pages/1.11/networking/DNS/dcos-dns). These components supports two top-level domain (TLD) names `.mesos` and `.directory`, respectively. Please read the "Recommendation" section to better understand the usage of these two TLDs. Each of the TLD consist of multiple zones. Every DC/OS service gets multiple FQDN entries, from these different zones. Below we describe the different zones and the FQDN associated with those zones and the type of network connectivity that a service receive when it is accessed using an FQDN from a particular zone.

For the purpose of illustration lets assume that the following UCR container is launched on DC/OS:
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

### `myapp.mygroup.marathon.mesos`
Every service that is launched on DC/OS through Marathon gets a FQDN `<service-name>.<group-name>.<framework-name>.mesos`.

This FQDN is exposed by `mesos-dns` as an A record. Please read the "Recommendation" section to understand the difference between using this FQDN vs using an FQDN from the `*.directory` TLD. The actual IP address to which this FQDN maps will depend on the networking mode that a container is using. For `host` and `bridge` mode networking, this FQDN would resolve to the agent IP address on which the container is launched, whereas for `container` mode networking it would resolve to the container's IP address. In the current example, the FQDN will resolve to the container's IP address as it is using `container` networking mode.

### `myapp-mygroup.marathon.containerip.dcos.thisdcos.directory`
Every service that is launched on DC/OS gets a FQDN `<service-name>-<group-name>.<framework-name>.containerip.dcos.thisdcos.directory`

This FQDN is exposed by `dcos-dns` as an A record. For `container` and `bridge` mode networking, this FQDN would resolve to the container's IP address, whereas for `host` mode networking it would resolve to the agent IP on which container is launched. In the current example, the `framework-name` is `marathon`. The FQDN would resolve to container's IP address as it is using `container` networking mode.

### `myapp-mygroup.marathon.agentip.dcos.thisdcos.directory`
Every service that is launched on DC/OS gets a FQDN `<service-name>-<group-name>.<framework-name>.agentip.dcos.thisdcos.directory`

This FQDN is exposed by `dcos-dns` as an A record. This FQDN would always resolve to the agent IP on which the container is running irrespective of networking mode.

### `myapp-mygroup.marathon.autoip.dcos.thisdcos.directory`
Every service that is launched on DC/OS gets a FQDN `<service-name>-<group-name>.<framework-name>.autoip.dcos.thisdcos.directory`

This FQDN is exposed by `dcos-dns` as an A record. As the name goes, `auotip` FQDN has the intelligence to resolve to the IP address that is most appropriate to reach to the container. For instance, if a container is reachable via agent IP, as in host and bridge mode networking, then `autoip` FQDN will resolve to agent IP. Similarly, in container mode networking it will resolve to container's IP address.

### `mygroupmyapp.marathon.l4lb.thisdcos.directory`
If a service explicitly defines a `VIP` label as part of its app definition then it gets a FQDN `<group-name><service-name>.<framework-name>.l4lb.thisdcos.directory`

In the current example, the label looks like:
```
"labels": {
    "VIP_0": "/mygroup/myapp:80"
}
```

This FQDN is exposed by `dcos-dns` as an A record. It is primarily used for layer-4 load balancing. It resolves to a virtual IP address allocated by `dcos-l4lb` in the `11.x.x.x` range, which then maps to all the instances that correspond to this service.

# SRV records

###`_myapp.mygroup._tcp.marathon.mesos`:
If a service explicitly provides name to its port in the app definition then it gets a FQDN `_<service-name>.<group-name>._<protocol>.<framework-name>.mesos

This FQDN is exposed by `mesos-dns` as a SRV record.

# FQDNs for frameworks other than Marathon
The current example used Marathon which is the default framework in DC/OS. However, there are other frameworks that also run on top of DC/OS such as Kafka, Cassandra, Spark etc. The DNS infrastructure in DC/OS generates all the FQDNs mentioned above for services launched by these frameworks as well, with the only difference that `marathon` name is replaced by that framework's name to build out the FQDNs. For instance, a service launched by framework name `kafka` would have following FQDNs:  
* `<taskname>.kafka.l4lb.thisdcos.directory`
* `<taskname>.kafka.containerip.dcos.thisdcos.directory`
* `<taskname>.kafka.agentip.dcos.thisdcos.directory`
* `<taskname>.kafka.autoip.dcos.thisdcos.directory`
* `<taskname>.kafka.mesos`

# Recommendation
The `.mesos` TLD pre-dates the `.directory` TLD, and has been in existence primarily for backwards compatibility. While any service launched on DC/OS will get an FQDN both in the `.mesos` TLD and the `.directory` TLD,  it is recommended to use the `.directory` TLD to access services, since by design `dcos-dns` is more reactive and fault-taulerant than `mesos-dns`. That said, `mesos-dns` does provide a RESTful interface for accessing its records which allows the `.mesos` TLD to be available over an HTTP interface and not just over DNS.  
