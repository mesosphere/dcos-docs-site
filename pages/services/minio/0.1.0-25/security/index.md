---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 50
excerpt: DC/OS Minio Service TLS 
featureMaturity:
enterprise: false
---

## Configure Transport Encryption

See the [Guide to Configuring DC/OS Access for Minio](serviceaccountdetail.md).

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
