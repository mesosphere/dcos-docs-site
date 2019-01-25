---
layout: layout.pug
navigationTitle: Security
title:  Security
menuWeight: 50
excerpt: Configuring Minio for DC/OS access
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---

# Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.

- DC/OS CLI, either Enterprise or Open Source:
   - [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
   - [Enterprise DC/OS CLI 1.10 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

#include /services/include/service-account.tmpl

#include /services/include/security-configure-transport-encryption.tmpl

## Accessing the {{ model.techName }} web interface with Edge-LB TLS configuration

### Pre-requisites for EdgeLB with TLS configuration
1. DC/OS cluster with Service account and Service account secret configured.

1. {{ model.techName }} service installed with TLS enabled.

### Steps


For Edge-LB pool configuration:
1. Add repo of `Edge-LB-aws`.
   ```shell
   dcos package repo add --index=0 edgelb-aws \https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb/stub-universe-edgelb.json
   ```
1. Add repo of `Edge-LB-Pool-aws`.
   ```shell
   dcos package repo add --index=0 edgelb-pool-aws \https://edge-lb-infinity-artifacts.s3.amazonaws.com/autodelete7d/master/edgelb-pool/stub-universe-edgelb-pool.json
   ```
1. Install the Edge-LB package:
   ```shell
   dcos package install edgelb --yes
   ``` 
1. Create the configuration JSON file with required parameters to access DC/OS {{ model.techName }}:
   ```json
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
            "port": 9000
         }
         }]
         }
         ]
      }
   }

   ```
1. Create `edge-pool` using the JSON file created in the preceding step:
   ```shell
   dcos edgelb create edgelb-pool-config.json
   ```    
1. Accessing {{ model.techName }}:
   ```shell
   https://<Public IP of the Public Node of the cluster>>:9001/minio
   ```  
   The {{ model.techName }} server can be accessed using the {{ model.techName }} client by registering it to the {{ model.techName }} Server. To register a {{ model.techName }} client, specify the public IP of the Public Agent running EdgeLB.

   [<img src="../img/edgelb_with_tls.png" alt="With TLS"/>](../img/edgelb_with_tls.png)

   Figure 1. - Minio browser 

   For more details on the {{ model.techName }} Client, refer to the link:
   [minio-client-complete-guide](https://docs.minio.io/docs/minio-client-complete-guide.html)  

## Installing the service

1. Install the DC/OS {{ model.techName }} Service, including the following options in addition to your own:

   ```shell
   {
      "service": {
         "service_account": "<your service account name>",
         "service_account_secret": "<full path of service secret>",
         "security": {
            "tls_ssl": {
               "enabled": true
                     }
                     }
               }
   }
   ```

   [<img src="../img/TLS_Service.png" alt="TLS Service View"/>](../img/TLS_Service.png)

   Figure 2. - TLS service view
1. Running stage view
   [<img src="../img/TLS_Running_Stage.png" alt="TLS Running Stage"/>](../img/Running_Stage1.png)

   Figure 3. - The Running stage view will display the progress of your installation.

1. Verify your installation by viewing the log:

   [<img src="../img/TLS_Successful_Execution.png" alt="TLS Successful Execution"/>](../img/TLS_Successful_Execution.png)

   Figure 4. - Successful execution

