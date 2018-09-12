---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 50
excerpt: DC/OS percona-pxc-mysql. Service encryption, authentication and authorization
featureMaturity:
enterprise: false
---

# DC/OS percona-pxc-mysql Security

The DC/OS percona-pxc-mysql service supports Percona XtraDB Cluster’s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.


## Transport Encryption and SSL Authentication
With transport encryption enabled, the DC/OS percona-pxc-mysql Service will automatically deploy all nodes with the correct configuration to encrypt communication via SSL. The nodes will communicate securely between themselves using SSL. SSL authentication requires that all percona-pxc-mysql nodes present a valid certificate. From this certificate, their identity can be derived for communicating between nodes.

The service uses the [DC/OS CA](https://docs.mesosphere.com/latest/security/ent/tls-ssl/) to generate the SSL artifacts to secure the service. Any client that trusts the DC/OS CA will consider the service’s certificates valid.

**Note:** Transport encryption must be enabled in order to use [SSL authentication](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/) for authentication.

## Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account.

## Configure Transport Encryption

See the [Guide to Configuring DC/OS Access for percona-pxc-mysql](serviceaccountdetail.md).

## Set up the service account

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`:

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair pxc-private-key.pem pxc-public-key.pem
   dcos security org service-accounts create -p pxc-public-key.pem -d "dcos_pxc" <service name>
   dcos security secrets create-sa-secret --strict pxc-private-key.pem <service name> <service name secret>
   dcos security org users grant dcos_pxc dcos:superuser full --description "grant permission to superuser"
   ```
where `<service name>` is the name of the service to be installed.

## Install the service

Install the DC/OS percona-pxc-mysql Service, including the following options in addition to your own:

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

DC/OS percona-pxc-mysql Service supports two authentication mechanisms, SSL and PAM(Plugable Authentication Module). PAM can not work alone without SSL. By default PAM is disabled.

Steps to follow to configure PAM:
1. install openLDAP and openLDAP admin in the same cluster from Catalogue.
2. Go to openLDAP Admin and logon with configurable userid(cn=admin,dc=example,dc=org) and password.(image required)
3. Go to "ou-groups", create admin, developer and user(image)
4. Create username under user group.
5. Create the same user in  DC/OS percona-pxc-mysql to login authentication successfully.
<<login image>>

**Note:** <PAM> authentication can be combined with transport encryption.

## CA based authentication between nodes

DC/OS percona-pxc-mysql Service requires certificated based authentication between nodes.
