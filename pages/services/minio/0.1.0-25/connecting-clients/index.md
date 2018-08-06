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
One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Since they can be deployed anywhere on it, clients need a way to find the service. This is where service discovery comes in.


## Discovering endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:
- CLI:
  1. List endpoint types: `dcos minio endpoints`
  2. View endpoints for an endpoint type: `dcos minio endpoints <endpoint>`
- API:
  1. List endpoint types: `<dcos-url>/service/minio/v1/endpoints`
  2. View endpoints for an endpoint type: `<dcos-url>/service/minio/v1/endpoints/<endpoint>`

Returned endpoints will include the following:
- An `.autoip.dcos.thisdcos.directory` hostname for each instance. This hostname will follow the instance if it is moved within the DC/OS cluster.
- An HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address to access the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP, use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster, you can either use direct IPs or set up a proxy service that acts as a front end to your Minio instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/1.10/administering-clusters/sshcluster/) to access services from outside the cluster, but this option is not suitable for production use.


## Connection response

The response, for both the CLI and the REST API, is as follows.

```shell
{
  "address": [
    "10.0.2.208:9000",
    "10.0.1.9:9000",
    "10.0.2.10:9000",
    "10.0.1.155:9000"
  ],
  "dns": [
    "miniod-0-node.miniodemo.autoip.dcos.thisdcos.directory:9000",
    "miniod-1-node.miniodemo.autoip.dcos.thisdcos.directory:9000",
    "miniod-2-node.miniodemo.autoip.dcos.thisdcos.directory:9000",
    "miniod-3-node.miniodemo.autoip.dcos.thisdcos.directory:9000"
  ]
}
```

This JSON array contains a list of valid nodes that you can use to connect to the minio cluster. To ensure availability, it is best to specify multiple nodes in your configuration. Use the VIP to address any one of the Minio nodes in the cluster.

When Transport Layer Security (TLS) is enabled, an endpoint named `node-tls` should also be listed. To verify a TLS connection from a client, the DC/OS trust bundle with a CA certificate is required.

## Accessing the Minio UI with Edge-LB configuration

### Steps

For Edge-LB pool configuration:
  1. Add repo of Edge-LB-aws:
  ```shell
  dcos package repo add --index=0 edgelb-aws \ 
https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb/stub-universe-edgelb.json 
  ```
  2. Add repo of Edge-LB-Pool-aws:
  ```shell
  dcos package repo add --index=0 edgelb-pool-aws \ 
https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb-pool/stub-universe-edgelb-pool.json
  ```  
  3. Install the Edge-LB:
  ```shell
  dcos package install edgelb --yes
  ``` 
  4. Create the configuration JSON file with required parameters to access Minio:

  Example without TLS:

  ```shell
  {
  "apiVersion": "V2",
  "name": "minio",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 9001,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "miniodemo"
        }
      },
      {
        "bindPort": 9000,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "minio"
        }
      }
    ],
    "backends": [
     {
      "name": "miniodemo",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "miniod.miniodemo.l4lb.thisdcos.directory",
          "port": 9001
        }
      }]
    },
    {
      "name": "minio",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "minio.marathon.l4lb.thisdcos.directory",
          "port": 9000
        }
      }]
   }
   ]
  }
}
  ```
 
 5. Create `edge-pool` using the JSON file created in the preceding:
  ```shell
  dcos edgelb create edgelb-pool-config.json
  ```    
 6. Access Minio:
  ```shell
  http://<Public IP of the Public Node of the cluster>>:9001/minio
  ```      
Now you can connect with the Minio server using Minio Client on the public IP of the public agent running EdgeLB and the port number at which Minio server is binded at EdgeLB. 

Example with TLS:

```shell
{
  "apiVersion": "V2",
  "name": "minio",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 9001,
        "protocol": "HTTPS",
        "certificates": [
           "$AUTOCERT"
        ],
        "linkBackend": {
          "defaultBackend": "miniodemo"
        }
      },
      {
        "bindPort": 9000,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "minio"
        }
      }
    ],
    "backends": [
     {
      "name": "miniodemo",
      "protocol": "HTTPS",
      "rewriteHttp": {
         "host": "miniod.miniodemo.l4lb.thisdcos.directory"
         },
         "request": {
            "forwardfor": true,
            "xForwardedPort": true,
            "xForwardedProtoHttpsIfTls": true,
            "setHostHeader": true,
            "rewritePath": true
      },
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "miniod.miniodemo.l4lb.thisdcos.directory",
          "port": 9001
        }
      }]
    },

    {
      "name": "minio",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "minio.marathon.l4lb.thisdcos.directory",
          "port": 9000
        }
      }]
   }
   ]
  }
}

```
### Pre-requisites for EdgeLB with TLS configuration

1) DC/OS cluster with Service account and Service account secret configured.

2) Minio service installed with TLS enabled.

Follow the same steps as mentioned above to configure EdgeLB with TLS configuration.

Minio server can be accessed using Minio client by registering it to the Minio Server. To register Minio client, specify the public IP of the Public Agent running EdgeLB.

For more details on Minio Client, refer to the link:
   https://docs.minio.io/docs/minio-client-complete-guide.html




