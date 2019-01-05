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
- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
<!-- You have called for two different installations of DC/OS. Which one is correct? -->
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

<!-- The following section mostly duplicates the service-account.tmpl. Can it be used instead? -->
# Service Account Configuration
This topic describes how to configure DC/OS access for {{ model.techName }}. Depending on your security mode, {{ model.techName }} requires service authentication for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | **Required** |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the superuser permission.

## Create a Key Pair

In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.
Create a public-private key pair and save each value into a separate file within the current directory.

   ```shell
   dcos security org service-accounts keypair minio-private-key.pem minio-public-key.pem
   ```  
**Tip:** You can use the [DC/OS Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/) to secure the key pair.

## Create a Service Account

From a terminal prompt, create a new service account `<service-account-id>` containing the public key `<your-public-key>.pem`.

   ```shell
   dcos security org service-accounts create -p minio-public-key.pem -d "dcos_minio" <service name>
   ``` 
You can verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `minio/<secret-name>` with your service account `<service-account-id>` and private key specified `<private-key>.pem`.

**NOTE:** If you store your secret in a path that matches the service name, for example, service name and secret path are both {{ model.serviceName }}, then only the service named {{ model.serviceName }} can access it.

### Permissive     

   ```shell
   dcos security secrets create-sa-secret minio-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict minio-private-key.pem <service name> <service name secret>
   ```    
You can list the secrets with this command:   
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser" 
   dcos security org users grant dcos_minio dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_minio dcos:secrets:default:miniodemo full --description "grant permission to miniodemo"
   ```    
<!-- The following section duplicates much of the security-configure-transport-encryption.tmpl. Can it be used instead? -->

## Configure Transport Encryption

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`, where `<service name>` is the name of the service to be installed.:

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair minio-private-key.pem minio-public-key.pem
   dcos security org service-accounts create -p minio-public-key.pem -d "dcos_minio" <service name>
   dcos security secrets create-sa-secret --strict minio-private-key.pem <service name> <service name secret>
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
   dcos security org users grant dcos_minio dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_minio dcos:secrets:default:miniodemo full --description "grant permission to miniodemo"
   ```


## Accessing the {{ model.techName }} web interface with Edge-LB TLS configuration

<!-- Is this section a duplicate of the Accessing Minion web interface with Edge-LB TLS configuration section in the Quick Start Guide? If so, why? Does it have to be in both places? -->

### Pre-requisites for EdgeLB with TLS configuration
1. DC/OS cluster with Service account and Service account secret configured.

1. {{ model.techName }} service installed with TLS enabled.

### Steps

<!-- This section is incomplete. Please provide commands for the following steps. Don't make the user look them up somewhere else. -->
For Edge-LB pool configuration:
1. Add repo of Edge-LB-aws.

1. Add repo of Edge-LB-Pool-aws.

1. Install the Edge-LB:
   ```shell
   dcos package install edgelb --yes
   ``` 
1. Create the configuration JSON file with required parameters to access {{ model.techName }}:
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
1. TLS service view
   [<img src="../img/TLS_Service.png" alt="TLS Service View"/>](../img/TLS_Service.png)

   Figure 2. - TLS service view
1. Running stage view
   [<img src="../img/TLS_Running_Stage.png" alt="TLS Running Stage"/>](../img/Running_Stage1.png)

   Figure 3. - Running stage view

1. Successful execution

   [<img src="../img/TLS_Successful_Execution.png" alt="TLS Successful Execution"/>](../img/TLS_Successful_Execution.png)

   Figure 4. - Successful execution

