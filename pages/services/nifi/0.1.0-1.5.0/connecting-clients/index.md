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
One of the benefits of running containerized services is that they can be placed anywhere on the cluster. Since they can be deployed anywhere on it, clients need a way to find the service. This is where service discovery comes in.


## Discovering endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:
- CLI:
  1. List endpoint types: `dcos nifi endpoints`
  2. View endpoints for an endpoint type: `dcos nifi endpoints <endpoint>`
- API:
  1. List endpoint types: `<dcos-url>/service/nifi/v1/endpoints`
  2. View endpoints for an endpoint type: `<dcos-url>/service/nifi/v1/endpoints/<endpoint>`

Returned endpoints will include the following:
- An `.autoip.dcos.thisdcos.directory` hostname for each instance. This hostname will follow the instance if it is moved within the DC/OS cluster.
- An HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address to access the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP, use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster, you can either use direct IPs or set up a proxy service that acts as a frontend to your NiFi instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/1.10/administering-clusters/sshcluster/) to access services from outside the cluster, but this option is not suitable for production use.


## Connection response

The response, for both the CLI and the REST API, is as follows.

```shell
{
  "address": [
    "10.0.2.208:1026",
    "10.0.1.9:1026"
  ],
  "dns": [
    "nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1026",
    "nifi-1-node.nifi.autoip.dcos.thisdcos.directory:1026"
  ]
}
```

This JSON array contains a list of valid nodes that you can use to connect to the nifi cluster. To ensure availability, it is best to specify multiple nodes in your configuration. Use the VIP to address any one of the NiFi nodes in the cluster.

When Transport Layer Security (TLS) is enabled, an endpoint named `node-tls` should also be listed. To verify a TLS connection from a client, the DC/OS trust bundle with a CA certificate is required.

## Accessing the NiFi UI with Edge-LB configuration

### Assumptions
    - NiFi is installed on DCOS without TLS and Kerberos
    - Edge-LB is installed with service account and service account secret in strict mode

### Steps

For Edge-LB pool configuration:

  1. Install the Edge-LB CLI:
  ```shell
  dcos package install --cli edgelb --yes
  ```
  2. Get the DNS address using the following:
  ```shell
  dcos nifi endpoints web --name=<service_name>
  ```  
  3. Create the configuration JSON file with required parameters to access NiFi web:

  Example without TLS and Kerberos:

  ```shell
{
  "apiVersion": "V2",
  "name": "nifiproxy",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 8080,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "nifiservice"
        }
      }
    ],
    "backends": [
      {
        "name": "nifiservice",
        "protocol": "HTTP",
        "services": [
          {
            "endpoint": {
              "type": "ADDRESS",
              "address": "<dns address obtained from Step 2>",
              "port": 8080
            }
          }
        ]
      }
    ]
  }
}
  ```
Example with TLS and Kerberos:

  ```shell
{
   "apiVersion": "V2",
   "name": "nifiproxy",
   "count": 1,
   "autoCertificate": true,
   "haproxy": {
      "frontends": [
         {
            "bindPort": 8443,
            "protocol": "HTTPS",
            "certificates": [
               "$AUTOCERT"
            ],
            "linkBackend": {
               "defaultBackend": "nifiservice"
            }
         }
      ],
      "backends": [
         {
            "name": "nifiservice",
            "protocol": "HTTPS",
            "rewriteHttp": {
               "host": <dns address obtained from Step 2>,
               "path": {
                  "fromPath": "/nifi",
                  "toPath": "/nifi"
               },
               "request": {
                  "forwardfor": true,
                  "xForwardedPort": true,
                  "xForwardedProtoHttpsIfTls": true,
                  "setHostHeader": true,
                  "rewritePath": true
               }
            },
            "services": [
               {
                  "endpoint": {
                     "type": "ADDRESS",
                     "address": <dns address obtained from Step 2>,
                     "port": <port obtained from Step 2>
                  }
               }
            ]
         }
      ]
   }
}

  ```

  4. Create `edge-pool` using the JSON file created in the preceding:
  ```shell
  dcos edgelb create edgelb-pool-config.json
  ```    
  5. Access NiFi:
  ```shell
  http://<Public IP of the Public Node of the cluster>>:8080/nifi
  ```      
