---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Minio - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use Minio with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

* Minio requires atleast four nodes to start in distributed mode. DC/OS cluster must contain atleast four Private slaves. 

* Minio requires even number of nodes to start in distributed mode.

* If DC/OS Secrets are enabled to specify credentials of Minio then following Secrets must be created:  service.name/access_key and service.name/secret_key. Where service.name is the name with which Minio service is installed on DC/OS.

## Install

Minio can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install minio
```
Below are the steps to install Minio using the DC/OS Catalog Web Interface:

[<img src="../img/Catalog_Service_View.png" alt="Catalog Service View"/>](../img/Catalog_Service_View.png)

[<img src="../img/Node_Count1.png" alt="Node Count"/>](../img/Node_Count1.png)

[<img src="../img/Port_Change1.png" alt="Port Configure"/>](../img/Port_Change1.png)

[<img src="../img/Running_Stage1.png" alt="Running Stage"/>](../img/Running_Stage1.png)

[<img src="../img/Successful_Execution1.png" alt="Successful Execution"/>](../img/Successful_Execution1.png)




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
 
 5. Create `edge-pool` using the JSON file created in the preceding step:
  ```shell
  dcos edgelb create edgelb-pool-config.json
  ```    
 6. Accessing Minio:
  ```shell
  http://<Public IP of the Public Node of the cluster>>:9001/minio
  ```      

Now you can connect with the Minio server using Minio Client on the public IP of the public agent running EdgeLB and the port number at which Minio server is binded at EdgeLB.

[<img src="../img/edgelb_without_tls.png" alt="Without TLS"/>](../img/egdelb_without_tls.png)
 

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

[<img src="../img/edgelb_with_tls.png" alt="With TLS"/>](../img/edgelb_with_tls.png)

Minio server can be accessed using Minio client by registering it to the Minio Server. To register Minio client, specify the public IP of the Public Agent running EdgeLB.

For more details on Minio Client, refer to the link:
   [minio-client-complete-guide](https://docs.minio.io/docs/minio-client-complete-guide.html)
