---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 70
excerpt: Connecting clients through service discovery
featureMaturity:
enterprise: false
---

# Connecting Clients
One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Since they can be deployed anywhere on the cluster, clients need a way to find the service. This is where service discovery comes in.


## Discovering Endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:
- CLI:
  1. List endpoint types: `dcos minio endpoints`
  2. View endpoints for an endpoint type: `dcos minio endpoints <endpoint>`
- API:
  1. List endpoint types: `<dcos-url>/service/minio/v1/endpoints`
  2. View endpoints for an endpoint type: `<dcos-url>/service/minio/v1/endpoints/<endpoint>`

Returned endpoints will include the following:
- `.autoip.dcos.thisdcos.directory` hostnames for each instance that will follow them if they're moved within the DC/OS cluster.
- A HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address for accessing the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster you can either use direct IPs or set up a proxy service that acts as a frontend to your minio instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/1.10/administering-clusters/sshcluster/) to access services from outside the cluster, but this option is not suitable for production use.

## Connection Response

The response, for both the CLI and the REST API is as below.

```shell
{
  "address": [
    "10.0.2.208:1026",
    "10.0.1.9:1026"
  ],
  "dns": [
    "minio-0-node.minio.autoip.dcos.thisdcos.directory:1026",
    "minio-1-node.minio.autoip.dcos.thisdcos.directory:1026"
  ]
}
```

This JSON array contains a list of valid nodes that the client can use to connect to the minio cluster. For availability reasons, it is best to specify multiple nodes in configuration of the client. Use the VIP to address any one of the prometheus nodes in the cluster.

When TLS is enabled, an endpoint named node-tls should also be listed. To verify a TLS connection from a client the DC/OS trust bundle with a CA certificate is required.
