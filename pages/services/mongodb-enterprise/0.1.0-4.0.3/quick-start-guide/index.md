---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring MongoDB - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use MongoDB with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

* MongoDB requires atleast three nodes to start in distributed mode. DC/OS cluster must contain atleast three Private slaves. 

* MongoDB requires even number of nodes to start in distributed mode.

* If DC/OS Secrets are enabled to specify credentials of MongoDB then following Secrets must be created:  service.name/access_key and service.name/secret_key. Where service.name is the name with which MongoDB service is installed on DC/OS.

## Install

MongoDB can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install mongodbservice --yes
```
Below are the steps to install MongoDB using the DC/OS Catalog Web Interface:

[<img src="../img/Catalog_Service_View.png" alt="Catalog Service View"/>](../img/Catalog_Service_View.png)

[<img src="../img/Config_page.png" alt="Config Page"/>](../img/Config_page.png)

[<img src="../img/Running_Stage.png" alt="Running Stage"/>](../img/Running_Stage.png)

[<img src="../img/Successful_execution.png" alt="Successful Execution"/>](../img/Successful_execution.png)




## Accessing the MongoDB UI with MongoDB OpsManager

### Steps

For Edge-LB pool configuration:
  1. Add repo of Edge-LB-aws.
  
  2. Add repo of Edge-LB-Pool-aws.

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
   
