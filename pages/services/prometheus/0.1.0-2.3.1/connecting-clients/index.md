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
  1. List endpoint types: `dcos prometheus endpoints`
  2. View endpoints for an endpoint type: `dcos prometheus endpoints <endpoint>`
- API:
  1. List endpoint types: `<dcos-url>/service/prometheus/v1/endpoints`
  2. View endpoints for an endpoint type: `<dcos-url>/service/prometheus/v1/endpoints/<endpoint>`

Returned endpoints will include the following:
- `.autoip.dcos.thisdcos.directory` hostnames for each instance that will follow them if they're moved within the DC/OS cluster.
- A direct IP address for accessing the service if `.autoip.dcos.thisdcos.directory` hostnames are not resolvable.
- If your service is on a virtual network such as the `dcos` overlay network, then the IP will be from the subnet allocated to the host that the task is running on. It will not be the host IP. To resolve the host IP use Mesos DNS (`<task>.<service>.mesos`).

In general, the `.autoip.dcos.thisdcos.directory` endpoints will only work from within the same DC/OS cluster. From outside the cluster you can either use direct IPs or set up a proxy service that acts as a frontend to your prometheus instance. For development and testing purposes, you can use [DC/OS Tunnel](https://docs.mesosphere.com/1.10/administering-clusters/sshcluster/) to access services from outside the cluster, but this option is not suitable for production use.

## Accessing Prometheus UI with Edge-LB Configuration

### Assumptions

Prometheus is installed on DCOS without TLS and Kerberos
Edge LB is installed (with service account and service account secret in strict mode)

### Steps

Following are the steps for Edge-LB Pool configuration:

  1. **Install the edgelb cli**
  ```shell
  dcos package install --cli edgelb --yes
  ```
  2. **Get the DNS address using the following:**
  ```shell
  dcos prometheus endpoints web --name=<service_name>
  ```  
  3. **Create the configration json file with required parameters to access prometheus web.**


  ```shell
  
{
  "apiVersion": "V2",
  "name": "prometheus",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 9092,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "prometheus"
        }
      },
      {
        "bindPort": 9000,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "minio"
        }
      },
      {
        "bindPort": 9093,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "alertmanager"
        }
      },
      {
        "bindPort": 9094,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "grafana"
        }
      },
    ],
    "backends": [
     {
      "name": "prometheus",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "prometheus.prometheus.l4lb.thisdcos.directory",
          "port": 9090
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
    },
    {
     "name": "alertmanager",
     "protocol": "HTTP",
     "services": [{
       "endpoint": {
         "type": "ADDRESS",
         "address": "alertmanager.prometheus.l4lb.thisdcos.directory",
         "port": 9093
       }
     }]
   },
   {
    "name": "grafana",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "grafana.grafana.l4lb.thisdcos.directory",
        "port": 3000
      }
    }]
   },
   {
    "name": "pushgateway",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "pushgateway.prometheus.l4lb.thisdcos.directory",
        "port": 9091
      }
    }]
   }
   ]
  }
}

 ```

  4. **Create edge-pool using the above json.**

  ```shell
  dcos edgelb create edgelb-pool-config.json
  ```    
  5. **Access prometheus**
  ```shell
  http://<Public IP of the Public Node of the cluster>>:8080/prometheus
  ```      
