---
layout: layout.pug
navigationTitle: Security
excerpt: Encryption, authentication, and authorization mechanisms
title: Security
menuWeight: 32
model: /services/pxc/data.yml
render: mustache
---

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} Dervice supports {{ model.techName }}’s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.


## Transport Encryption and SSL Authentication
With transport encryption enabled, the DC/OS {{ model.techName }} Service will automatically deploy all nodes with the correct configuration to encrypt communication via SSL. The nodes will communicate securely between themselves using SSL. SSL authentication requires that all `{{ model.packageName }}` nodes present a valid certificate. From this certificate, their identity can be derived for communicating between nodes.

The service uses the [DC/OS CA](https://docs.mesosphere.com/latest/security/ent/tls-ssl/) to generate the SSL artifacts to secure the service. Any client that trusts the DC/OS CA will consider the service’s certificates valid.

<p class="message--note"><strong>NOTE: </strong> Transport encryption must be enabled in order to use <a href="https://docs.mesosphere.com/1.10/security/ent/tls-ssl/">SSL authentication</a> for authentication.</p>

## Prerequisites
- A DC/OS Service Account with a secret stored in the [DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS Superuser permissions for modifying the permissions of the service account

## Configure Transport Encryption

See [Setting up a service account](service-account).

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

Install the DC/OS {{ model.packageName }} Service, including the following options in addition to your own:

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



## Transport encryption for clients

When SSL is enabled, Transport Encryption will be enabled automatically in SSL mode.

## Authentication

DC/OS {{ model.packageName }} Service supports two authentication mechanisms, SSL and Pluggable Authentication Module (PAM). PAM can not work alone without SSL. By default PAM is disabled.

Steps to follow to configure PAM:
1. Install openLDAP and openLDAP admin in the same cluster from Catalogue.
1. Go to openLDAP Admin and logon with configurable userid(cn=admin,dc=example,dc=org) and password.
1. Go to "ou-groups", create admin, developer and user(image)
1. Create username under user group.
1. Create the same user in  DC/OS {{ model.packageName }} to login authentication successfully. As shown below,
 ```
"mysql -uroot -proot -e \"CREATE USER slodh@'%' IDENTIFIED WITH auth_pam;GRANT ALL PRIVILEGES ON users.* TO slodh@'%';FLUSH PRIVILEGES\""
```


<p class="message--note"><strong>NOTE: </strong>PAM authentication can be combined with transport encryption.</p>
