---
layout: layout.pug
navigationTitle: Security
title:  Security
menuWeight: 50
excerpt: DC/OS Minio Security
featureMaturity:
enterprise: false
---

# Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.
- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# Service Account Configuration
This topic describes how to configure DC/OS access for Minio. Depending on your security mode, Minio requires service authentication for access to DC/OS.

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
   dcos security org service-accounts keypair minio-private-key.pem minio-public-key.pem
   ```  
**Tip:** You can use the [DC/OS Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/) to secure the key pair.

## Create a Service Account

From a terminal prompt, create a new service account `<service-account-id>` containing the public key `<your-public-key>.pem`.

   ```shell
   dcos security org service-accounts create -p minio-public-key.pem -d "dcos_minio" <service name>
   ``` 
**Tip:** You can verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `minio/<secret-name>` with your service account `<service-account-id>` and private key specified `<private-key>.pem`.

**Tip:** If you store your secret in a path that matches the service name, for example, service name and secret path are minio, then only the service named Minio can access it.

### Permissive     

   ```shell
   dcos security secrets create-sa-secret minio-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict minio-private-key.pem <service name> <service name secret>
   ```    
**Tip:** You can list the secrets with this command:   
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser" 
   dcos security org users grant dcos_minio dcos:adminrouter:ops:ca:rw full --description "grant permission to adminrouter"
   dcos security org users grant dcos_minio dcos:secrets:default:miniodemo full --description "grant permission to miniodemo"
   ```    


## Configure Transport Encryption

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`:

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
where `<service name>` is the name of the service to be installed.

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

