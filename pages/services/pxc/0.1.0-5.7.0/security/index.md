---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 50
excerpt: DC/OS Percona XtraDB Cluster Service encryption, authentication and authorization
featureMaturity:
enterprise: false
---

# Components

# DC/OS Percona XtraDB Cluster Security

The DC/OS Percona XtraDB Cluster service supports Percona XtraDB Cluster’s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.


## Transport Encryption and SSL Authentication
With transport encryption enabled, the DC/OS percona-pxc-mysql Service will automatically deploy all nodes with the correct configuration to encrypt communication via SSL. The nodes will communicate securely between themselves using SSL. SSL authentication requires that all percona-pxc-mysql nodes present a valid certificate. From this certificate, their identity can be derived for communicating between nodes.

The service uses the [DC/OS CA](https://docs.mesosphere.com/latest/security/ent/tls-ssl/) to generate the SSL artifacts to secure the service. Any client that trusts the DC/OS CA will consider the service’s certificates valid.

**Note:** Transport encryption must be enabled in order to use [SSL authentication](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/) for authentication.

## Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.

## Configure Transport Encryption

See the [Guide to Configuring DC/OS Access for NiFi](serviceaccountdetail.md).

## Set up the service account

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`:

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair nifi-private-key.pem nifi-public-key.pem
   dcos security org service-accounts create -p nifi-public-key.pem -d "dcos_nifi" <service name>
   dcos security secrets create-sa-secret --strict nifi-private-key.pem <service name> <service name secret>
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
   ```
where `<service name>` is the name of the service to be installed.

## Install the service

Install the DC/OS NiFi Service, including the following options in addition to your own:

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



## Transport encryption for clients(TBD)

With Transport Encryption enabled, service clients will need to be configured to use [the DC/OS CA bundle](https://docs.mesosphere.com/latest/security/ent/tls-ssl/get-cert/) to verify the connections they make to the service. Consult your client’s documentation for trusting a CA and configure your client appropriately.

## Authentication

DC/OS percona-pxc-mysql Service supports two authentication mechanisms, SSL and PAM. 

**Note:** <PAM> authentication can be combined with transport encryption.

## CA based authentication between nodes

DC/OS percona-pxc-mysql Service requires certificated based authentication between nodes.


### Place service keytab in DC/OS Secret Store

The DC/OS percona-pxc-mysql Service uses a keytab containing the service and user principals (service keytab). After creating the principals  as described above, generate the service keytab, making sure to include all the node principals. This will be stored as a secret in the DC/OS Secret Store by name `__dcos_base64__secret_name`. The DC/OS security modules will handle decoding the file when it is used by the service. More details [here.](https://docs.mesosphere.com/services/ops-guide/overview/#binary-secrets)

Documentation for adding a file to the secret store can be found [here.](https://docs.mesosphere.com/latest/security/ent/secrets/create-secrets/#creating-secrets-from-a-file-via-the-dcos-enterprise-cli)

**Note:** Secrets access is controlled by [DC/OS Spaces](https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets), which function like namespaces. Any secret in the same DC/OS Space as the service will be accessible by the service.
