---
layout: layout.pug
navigationTitle: Security
title:  Security
menuWeight: 50
excerpt: DC/OS MongoDB Security
featureMaturity:
enterprise: true
---

# Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.
- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# Service Account Configuration
This topic describes how to configure DC/OS access for MongoDB. Depending on your security mode, MongoDB requires service authentication for access to DC/OS.

    Security Mode     Service Account
    =============     ===============
    Disabled          Not available
    Permissive        Optional
    Strict 	          Required

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the superuser permission.

## Create a Key Pair

In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.
Create a public-private key pair and save each value into a separate file within the current directory.

   ```shell
   dcos security org service-accounts keypair mongodb-private-key.pem mongodb-public-key.pem
   ```  
**Tip:** You can use the [DC/OS Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/) to secure the key pair.

## Create a Service Account

From a terminal prompt, create a new service account `<service-account-id>` containing the public key `<your-public-key>.pem`.

   ```shell
   dcos security org service-accounts create -p mongodb-public-key.pem -d "dcos_mongodb" <service name>
   ``` 
**Tip:** You can verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `mongodb/<secret-name>` with your service account `<service-account-id>` and private key specified `<private-key>.pem`.

**Tip:** If you store your secret in a path that matches the service name, for example, service name and secret path are mongodb, then only the service named mongodb can access it.

### Permissive     

   ```shell
   dcos security secrets create-sa-secret mongodb-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict mongodb-private-key.pem <service name> <service name secret>
   ```    
**Tip:** You can list the secrets with this command:   
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser" 
   dcos security org users grant dcos_mongodb dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_mongodb dcos:secrets:default:mongodbdemo full --description "grant permission to mongodbdemo"
   ```    


## Configure Transport Encryption

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`:

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair mongodb-private-key.pem mongodb-public-key.pem
   dcos security org service-accounts create -p mongodb-public-key.pem -d "dcos_mongodb" <service name>
   dcos security secrets create-sa-secret --strict mongodb-private-key.pem <service name> <service name secret>
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
   dcos security org users grant dcos_mongodb dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_mongodb dcos:secrets:default:mongodbdemo full --description "grant permission to mongodbdemo"
   ```
where `<service name>` is the name of the service to be installed.

## Enabling the TLS configuration with MongoDB OpsManager

### Pre-requisites for Enabling MongoDB OpsManager with TLS configuration
1) DC/OS cluster with Service account and Service account secret configured.

2) MongoDB service installed with TLS enabled.

### Steps
For TLS/SSL configuration while launching MongoDB service from catalog:
  1. Check `ssl Enabled` option in service configuration menu for Enabling TLS over the service.
  
  2. Add Service Account name (`dcos_mongodb` as created above) in the respective column.
   
  3. Add Service Account secret (`dcos_mongodb_secret` as created above) in the secret column.
  
  Now, Launch the service with the required number of nodes count.
  
  After successful deployment of the service, go to MongoDB OpsManager. 
  
  1. In the project dashboard, select the tab `Security`.
  
  2. Go to sub-section `Authentication & TLS/SSL` and click 'Edit Settings'.
  
  3. 
  
  
Minio server can be accessed using Minio client by registering it to the Minio Server. To register Minio client, specify the public IP of the Public Agent running EdgeLB.

[<img src="../img/edgelb_with_tls.png" alt="With TLS"/>](../img/edgelb_with_tls.png)

For more details on Minio Client, refer to the link:
   [minio-client-complete-guide](https://docs.minio.io/docs/minio-client-complete-guide.html)  

## Install the service

Install the DC/OS Minio Service, including the following options in addition to your own:

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

[<img src="../img/TLS_Running_Stage.png" alt="TLS Running Stage"/>](../img/Running_Stage1.png)

[<img src="../img/TLS_Successful_Execution.png" alt="TLS Successful Execution"/>](../img/TLS_Successful_Execution.png)

