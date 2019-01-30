---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 70
excerpt: Connecting clients through service discovery
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Since they can be deployed anywhere on the cluster, clients need a way to find the service. This is where service discovery comes in.


# Discovering Endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:

CLI:
- List endpoint types: 
  ```
  dcos {{ model.serviceName }} endpoints
  ```

- View endpoints for an endpoint type:
  ```
  dcos {{ model.serviceName }} endpoints <endpoint>
  ```

API:
- List endpoint types: 
  ```
  <dcos-url>/service/{{ model.serviceName }}/v1/endpoints
  ```

- View endpoints for an endpoint type: 
  ```
  <dcos-url>/service/{{ model.serviceName }}/v1/endpoints/<endpoint>
  ```

Returned endpoints will include the following:
- `.autoip.dcos.thisdcos.directory` hostnames for each instance that will follow them if they're moved within the DC/OS cluster.
- A HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address for accessing the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster you can either use direct IPs or set up a proxy service that acts as a front end to your {{ model.serviceName }} instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/latest/administering-clusters/sshcluster/) to access services from outside the cluster, but this option is not suitable for production use.


# Connection Response

The response, for both the CLI and the REST API is as follows:

```json
{
  "address": [
    "10.0.1.120:1025",
    "10.0.1.128:1025"
  ],
  "dns": [
    "{{ model.serviceName }}-0-node.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:1025",
    "{{ model.serviceName }}-1-node.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:1025"
  ],
  "vip": "node.{{ model.serviceName }}.l4lb.thisdcos.directory:8080"
}
```

This JSON array contains a list of valid nodes that the client can use to connect to the `{{ model.serviceName }}` cluster. For availability reasons, it is best to specify multiple nodes in configuration of the client. Use the VIP to address any one of the `{{ model.serviceName }}` nodes in the cluster.

When TLS is enabled, an endpoint named `node-tls` should also be listed. To verify a TLS connection from a client, the DC/OS trust bundle with a CA certificate is required.

# Accessing the DC/OS {{model.techName }} web interface with Edge-LB configuration

### Assumptions
  - DC/OS {{model.techName }} is installed on DC/OS without TLS and Kerberos
  - Edge-LB is installed (with service account and service account secret in strict mode)

## Steps

Following are the steps for Edge-LB Pool configuration:

1. Install the `edgelb cli`
    ```shell
    dcos package install --cli edgelb --yes
    ```
1. Get the DNS address using the following:
    ```shell
    dcos {{ model.serviceName }} endpoints web --name=<service_name>
    ```  
1. Create the configuration file `edgelb-pool-config.json` with required parameters to access `{{ model.serviceName }}` on the web.

    Example without TLS and Kerberos:

      ```json
    {
      "apiVersion": "V2",
      "name": "{{ model.serviceName }}proxy",
      "count": 1,
      "haproxy": {
        "frontends": [
          {
            "bindPort": 8080,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "{{ model.serviceName }}service"
            }
          }
        ],
        "backends": [
          {
            "name": "{{ model.serviceName }}service",
            "protocol": "HTTP",
            "services": [
              {
                "endpoint": {
                  "type": "ADDRESS",
                  "address": "<dns adress obtained from Step 2>",
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

      ```json
    {
      "apiVersion": "V2",
      "name": "{{ model.serviceName }}proxy",
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
                  "defaultBackend": "{{ model.serviceName }}service"
                }
            }
          ],
          "backends": [
            {
                "name": "{{ model.serviceName }}service",
                "protocol": "HTTPS",
                "rewriteHttp": {
                  "host": <dns adress obtained from Step 2>,
                  "path": {
                      "fromPath": "/{{ model.serviceName }}",
                      "toPath": "/{{ model.serviceName }}"
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
                        "address": <dns adress obtained from Step 2>,
                        "port": <port obtained from Step 2>
                      }
                  }
                ]
            }
          ]
      }
    }

      ```

1. Create `edge-pool` using the above `edgelb-pool-config.json` file.
    ```shell
    dcos edgelb create edgelb-pool-config.json
    ```    
1. Access `{{ model.serviceName }}`:
    ```shell
    http://<Public IP of the Public Node of the cluster>>:8080/{{ model.serviceName }}
    ```      
