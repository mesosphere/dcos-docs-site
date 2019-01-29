---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 63
excerpt: Connecting clients with service discovery
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

# Connecting Clients
One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Because they can be deployed anywhere on the cluster, clients need a way to find the service. This is where service discovery comes in.

<a name="discovering-endpoints"></a>

## Discovering Endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:
- CLI:
  - List endpoint types: `dcos {{ model.serviceName }} endpoints`
  - View endpoints for an endpoint type: `dcos {{ model.serviceName }} endpoints <endpoint>`
- API:
  - List endpoint types: `<dcos-url>/service/{{ model.serviceName }}/v1/endpoints`
  - View endpoints for an endpoint type: `<dcos-url>/service/{{ model.serviceName }}/v1/endpoints/<endpoint>`

Returned endpoints will include the following:
- `.autoip.dcos.thisdcos.directory` hostnames for each instance that will follow them if they are moved within the DC/OS cluster.
- A HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address for accessing the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster you can either use direct IPs or set up a proxy service that acts as a front end to your `{{ model.serviceName }}` instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/latest/administration/access-node/tunnel/) to access services from outside the cluster, but this option is not suitable for production use.

## Connecting Clients to Endpoints

1. Gather the DNS names for the `mongo-port` endpoint.
```
$ dcos {{ model.serviceName }} endpoints mongo-port
    {
      "address": [
        "10.0.3.53:27017",
        "10.0.3.159:27017",
        "10.0.1.211:27017"
      ],
      "dns": [
        "mongo-rs-0-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017",
        "mongo-rs-1-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017",
        "mongo-rs-2-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017"
      ]
    }
```

2. Connect to MongoDB using the [mongo shell](https://docs.mongodb.com/manual/mongo/) tool, using the `dns` hostname+port list from Step 1. Note that a username and password is provided in the connect string, as well as the replica set name:

```
$ mongo mongodb://clusteradmin:clusteradminpassword@mongo-rs-0-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory,
mongo-rs-1-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory,
mongo-rs-2-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
> db.serverStatus();
```

Or for applications, most MongoDB drivers will accept `mongodb://` connection-string used in the example above to connect to MongoDB.
```
mongodb://clusteradmin:clusteradminpassword@mongo-rs-0-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory,
mongo-rs-1-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory,
mongo-rs-2-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
```
