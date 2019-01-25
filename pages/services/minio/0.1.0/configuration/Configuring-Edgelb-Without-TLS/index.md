---
layout: layout.pug
navigationTitle: Configuring EdgeLB Without TLS
excerpt: Configuring EdgeLB Without TLS in DC/OS Minio
title: Configuring EdgeLB Without TLS
menuWeight: 25
model: /services/minio/data.yml
render: mustache
---

# Accessing the {{ model.techName }} web interface with Edge-LB configuration
## Steps

For Edge-LB pool configuration:
1. Add repo of `Edge-LB-aws`.
   ```shell
   dcos package repo add --index=0 edgelb-aws \https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb/stub-universe-edgelb.json
   ```
1. Add repo of `Edge-LB-Pool-aws`.
    ```shell
   dcos package repo add --index=0 edgelb-pool-aws \https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb-pool/stub-universe-edgelb-pool.json
   ```
1. Install Edge-LB:

    ```shell
    dcos package install edgelb --yes
    ``` 

1. Create the configuration JSON file `edgelb-pool-config.json` with required parameters to access {{ model.techName }}. 

      Example without TLS:

      ```json
      {
      "apiVersion": "V2",
      "name": "{{ model.serviceName }}",
      "count": 1,
      "haproxy": {
        "frontends": [
          {
            "bindPort": 9001,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "{{ model.serviceName }}demo"
            }
          }
        ],
        "backends": [
        {
          "name": "{{ model.serviceName }}demo",
          "protocol": "HTTP",
          "services": [{
            "endpoint": {
              "type": "ADDRESS",
              "address": "{{ model.packageName }}.{{ model.serviceName }}demo.l4lb.thisdcos.directory",
              "port": 9000
            }
          }]
        }
      ]
      }
    }
      ```
 
1. Create the `edgelb-pool` using the JSON configuration file created in the preceding step:
    ```shell
    dcos edgelb create edgelb-pool-config.json
    ```    
1. Access {{ model.techName }}:
    ```shell
    http://<Public IP of the Public Node of the cluster>>:9001/{{ model.serviceName }}
    ```      

    Now you can connect with the {{ model.techName }} server using the {{ model.techName }} client on the public IP of the public agent running EdgeLB, and the port number at which {{ model.techName }} server is bound at EdgeLB. 
    
    Figure 5 displays {{ model.techName }}  accessed **without** TLS, showing a non-secure connection in the status bar.

   
  [<img src="../../img/edgelb_without_tls.png" alt="Without TLS"/>](../../img/edgelb_without_tls.png)
  Figure 5. - Minio Browser without TLS 
    
