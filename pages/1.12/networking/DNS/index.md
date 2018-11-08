---
layout: layout.pug
navigationTitle:  DNS
title: DC/OS Domain Name Service
menuWeight: 20
excerpt: Understanding the DC/OS domain name service discovery

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS provides a distributed and fault tolerant DNS-based **service discovery** mechanism.

DNS look-up services are provided by two components within DC/OS:
- `mesos-dns` runs on every **master node** and creates Address (A) and Service (SRV) records for the tasks that run on the cluster.
  - Address (A) records follow the naming pattern of `<service_id>.[<group_name>].<scheduler>.mesos`
  - Service (SRV) records follow the naming pattern of `_<service_id>.[<group_name>]._<tcp|udp>.<scheduler>.mesos`

  By default, the `mesos-dns` service creates these records under the `.mesos` top-level domain.

- `dcos-dns` runs on **every node** in the cluster and creates Address (A) records for the tasks that run on the nodes in the cluster.

  By default, the `dcos-dns` service creates records under the `.directory` top-level domain.

# Fully-qualified domains and zones
Each of the top-level domains consists of multiple zones. Every DC/OS service gets multiple FQDN entries from these different zones. Each service that is launched on DC/OS through Marathon gets an FQDN in the form of  `<service-name>.mesos`. Moreover, **all** running services launched on DC/OS get an FQDN based upon the service that launched it, in the form `<service-name>.<group-name>.<framework-name>.mesos`.

## Sample service specification
To see the relationship between service specifications and the DNS records generated, consider the following example of a UCR container launched on DC/OS:
<a name="Example1"></a> 
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

The zones and fully-qualified domain names associated with those zones that are returned in the DNS recrods depend on the top-level domain used for the service lookup request and the type of network connectivity that a service receives when it is accessed using the fully-qualified domain name (FQDN) from a particular zone. For additional information about when to use the `.mesos` top-level domain or the `.directory` top-level domain, see [Deciding the top-level domain to use](#TopLevelDomain). 

### myapp.mygroup.marathon.mesos
This FQDN is exposed by `mesos-dns` as an address (A) record. The actual IP address to which this FQDN maps will depend on the networking mode that a container is using. 
- For `host` and `bridge` mode networking, the FQDN resolves to the agent IP address on which the container is launched
- For `container` mode networking, the FQDN resolves to the container's IP address. 

In the [Sample service specification](#Example1), the FQDN resolves to the container's IP address because the service definition specifies `container` as the networking mode.

### myapp-mygroup.marathon.containerip.dcos.thisdcos.directory
- For `container` and `bridge` mode networking, the FQDN resolves to the container's IP address.
- For `host` mode networking, the FQDN resolves to the agent IP on which container is launched. 

In the sample specification, the `framework-name` is `marathon` and the FQDN resolves to the container's IP address because the service uses the `container` networking mode.

### myapp-mygroup.marathon.agentip.dcos.thisdcos.directory
This FQDN is exposed by `dcos-dns` as an A record. This FQDN always resolves to the agent IP address on which the container is running, regardless of the networking mode.

### myapp-mygroup.marathon.autoip.dcos.thisdcos.directory
This FQDN is exposed by `dcos-dns` as an A record. As the name suggests, the `autoip` FQDN resolves to the IP address that is most likely to reach the container. For example, if a container is reachable through the agent IP address--as in host and bridge mode networking--then the `autoip` FQDN resolves to the agent's IP address. If the service uses `container` networking, the FQDN resolves to the container's IP address.

### mygroupmyapp.marathon.l4lb.thisdcos.directory
If a service explicitly defines a virtual IP address using the `VIP` label as part of the service definition, then the service gets the FQDN in the form of: `<group-name><service-name>.<framework-name>.l4lb.thisdcos.directory`

In the [Sample service specification](#Example1), the label looks like this:
```
"labels": {
    "VIP_0": "/mygroup/myapp:80"
}
```

This FQDN is exposed by `dcos-dns` as an A record. It is primarily used for layer-4 load balancing. It resolves to a virtual IP address allocated by `dcos-l4lb` in the `11.x.x.x` range, which then maps to all the instances that correspond to this service.

# SRV records
A DNS Service (SRV) record defines the name, location, and transport protocol for the a specific service. For example, if you have a task named `mytask` launched by a service named `myservice`, Mesos-DNS generates the SRV record in the form of `_mytask._protocol.myservice.mesos`, where `protocol` is either `udp` or `tcp`.
- For more information about the SRV records generated by `mesos-dns`, see [SRV Records](/1.12/networking/DNS/mesos-dns/service-naming/#srv-records).
- For more information about  naming tasks and services in `mesos-dns`, see [Task and Service Naming Conventions](/1.12/networking/DNS/mesos-dns/service-naming/#task-and-service-naming-conventions).

### myapp.mygroup./_tcp.marathon.mesos:
If a service explicitly assigns a name to its port in the service definition, the FQDN for the service is generated in the form of  `_<service-name>.<group-name>._<protocol>.<framework-name>.mesos`.

This FQDN is exposed by `mesos-dns` as an SRV record.

# FQDNs for frameworks other than Marathon
The [Sample service specification](#Example1) uses Marathon, which is the default framework in DC/OS. However, there are other frameworks that also run on top of DC/OS, such as Kafka, Cassandra, Spark, and so on. The DNS infrastructure in DC/OS generates all the FQDNs mentioned above for services launched by these frameworks as well. The only difference is that the name `marathon` is replaced by that framework's name to build out the FQDNs. For example, a service launched by framework `kafka` would have FQDNs such as:
* `<taskname>.kafka.l4lb.thisdcos.directory`
* `<taskname>.kafka.containerip.dcos.thisdcos.directory`
* `<taskname>.kafka.agentip.dcos.thisdcos.directory`
* `<taskname>.kafka.autoip.dcos.thisdcos.directory`
* `<taskname>.kafka.mesos`

<a name="TopLevelDomain">

# Deciding the top-level domain to use

Any service launched on DC/OS can get a fully-qualified domain name from the `.mesos` or `.directory` top-level domain. In most cases, however, you should use the `.directory` domain to access services because the `dcos-dns` module and `.directory` top-level domain is more reactive and fault-taulerant than the `mesos-dns` module and its`.mesos` top-level domain.

The main purpose of the `.mesos` top-level domain is to provide backward compatibility for previous versions of DC/OS. However, there are some specific scenarios or lookup requests where you might find the `.mesos` top-level domain particularly useful. For example, you might want to query the `.mesos` top-level domain to do the following:
- Use `leader.mesos` to list the current Mesos leader node.
- Use `master.mesos` to list to all of the Mesos master nodes.
- Use `slave.mesos` to list all of your agent nodes.
- Use `<framework>.mesos` to list the current framework-specific leader. For example, use `marathon.mesos`
to return the current Marathon leader or `cassandra.mesos`to return the current Cassandra leader.
- Use the `mesos-dns` RESTful API to query records over an HTTP interface rather than through DNS requests.

Aside from these specific use cases, you should use `dcos-dns` queries to look up service records.