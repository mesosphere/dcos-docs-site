---
layout: layout.pug
navigationTitle: Configuring TLS
title:  Configuring TLS
menuWeight: 25
excerpt: DC/OS Minio Configuring TLS
featureMaturity:
enterprise: false
---

# Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.
- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.


# Configure Transport Encryption

See the [Security Section](../../security), to configure Service Account and Service Account Secret. Configuring TLS in DC/OS requires a Service Account and Service Account Secret.

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

