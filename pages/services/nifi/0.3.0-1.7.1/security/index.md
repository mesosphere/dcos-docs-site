---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 49
excerpt: DC/OS NiFi Service encryption, authentication, and authorization
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

# DC/OS {{model.techName }} Security

The DC/OS {{model.techName }} service supports DC/OS {{model.techName }}’s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the usage of these important features.

A good overview of these features can be found  [here](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/html/administration-guide.html).

## Transport Encryption and Kerberos Authentication
With transport encryption enabled, DC/OS {{model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL. The nodes will communicate securely between themselves using SSL. SSL authentication requires that all DC/OS {{model.techName }} Nodes present a valid certificate from which their identity can be derived for communicating between themselves.
DC/OS {{model.techName }} uses the CN of the SSL certificate as the principal for a given Node.
For example, CN={{ model.serviceName }}-0-node.demonifi, O="Mesosphere, Inc", L=San Francisco, ST=CA, C=US.

The service uses the [DC/OS CA](https://docs.mesosphere.com/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service’s certificates valid.

<p class="message--note"><strong>NOTE: </strong>Enabling transport encryption is required to use <a href="https://docs.mesosphere.com/1.10/security/ent/tls-ssl/">SSL authentication</a> for authentication, but is optional for Kerberos authentication.</p>

## Prerequisites
- A DC/OS Service Account with a secret stored in the [DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS superuser permissions for modifying the permissions of the Service Account.

## Configure Transport Encryption

<p class="message--note"><strong>NOTE: </strong>A complete guide to Configuring DC/OS Access for DC/OS {{model.techName }} can be found below.</p>


## Set up the Service Account

Grant the service account the correct permissions.

In DC/OS 1.10, the required permission is `dcos:superuser full`.

   ```shell
   curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o ../dcos-ca.crt
   export LC_ALL=C.UTF-8
   export LANG=C.UTF-8
   dcos package install dcos-enterprise-cli
   dcos security org service-accounts keypair {{ model.serviceName }}-private-key.pem {{ model.serviceName }}-public-key.pem
   dcos security org service-accounts create -p {{ model.serviceName }}-public-key.pem -d "dcos_{{ model.serviceName }}" <service name>
   dcos security secrets create-sa-secret --strict {{ model.serviceName }}-private-key.pem <service name> <service name secret>
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
   ```
where <service name> is the name of the service to be installed.

## Transport Encryption for Clients

#include /services/include/security-transport-encryption-clients.tmpl

## Authentication

DC/OS {{model.techName }} supports two authentication mechanisms, SSL and Kerberos. The two are supported independently and may not be combined. If both SSL and Kerberos authentication are enabled, the service will use Kerberos authentication.

<p class="message--note"><strong>NOTE: </strong>Kerberos authentication can, however, be combined with transport encryption.</p>

## CA based authentication between nodes

DC/OS {{model.techName }} requires certificate based authentication between nodes.
DC/OS {{model.techName }} uses the CN of the SSL certificate as the principal for a given Node.
For example, CN={{ model.serviceName }}-0-node.demonifi, O="Mesosphere, Inc", L=San Francisco, ST=CA, C=US.

## Kerberos Authentication for End Users

Kerberos authentication relies on a central authority to verify that DC/OS {{model.techName }} clients are who they say they are. DC/OS {{model.techName }} integrates with your existing Kerberos infrastructure to verify the identity of clients.

### Prerequisites
- The hostname and port of a KDC reachable from your DC/OS cluster
- Sufficient access to the KDC to create Kerberos principals
- Sufficient access to the KDC to retrieve a keytab for the generated principals
- [The DC/OS Enterprise CLI](/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

## Configure Kerberos Authentication
### Create principals

The DC/OS {{model.techName }} service requires a Kerberos principal for the service principal and user principal. Each principal must be of the form

   ```shell
   {{ model.serviceName }}principal@<service realm>
   {{ model.serviceName }}admin@<service realm>
   ```
### Place Service Keytab in DC/OS Secret Store

The DC/OS {{model.techName }} service uses a keytab containing the above service and user principals (service keytab). After creating the principals above, generate the service keytab, making sure to include all the node principals. This will be stored as a secret in the DC/OS Secret Store by `name __dcos_base64__secret_name`. The DC/OS security modules will handle decoding the file when it is used by the service. 

<!-- Please make sure this is still current: More details [here.](https://docs.mesosphere.com/services/ops-guide/overview/#binary-secrets) -->

Create secret named "{{ model.serviceName }}admin_kerberos_secret" for password of Kerberos User Principal: `{{ model.serviceName }}admin`

Documentation for adding a file to the secret store can be found [here.](/latest/security/ent/secrets/create-secrets/#creating-secrets-from-a-file-via-the-dcos-enterprise-cli)

<p class="message--note"><strong>NOTE: </strong>Secrets access is controlled by <a href="https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets">DC/OS Spaces</a>, which function like namespaces. Any secret in the same DC/OS Space as the service will be accessible by the service.</p>

### Install the Service
Install the DC/OS {{ model.techName }} service with the following options in addition to your own:

   ```json
   {
    "service": {
     "name": "/demo/{{ model.serviceName }}",
      "security": {
      "kerberos": {
           "kdc": {
          "hostname": "kdc.marathon.autoip.dcos.thisdcos.directory",
          "port": 2500
        },
        "keytab_secret": "__dcos_base64___keytab",
        "primary": "{{ model.serviceName }}",
        "realm": "LOCAL",
        "service_principal": "{{ model.serviceName }}principal@LOCAL",
        "user_principal": "{{ model.serviceName }}admin@LOCAL",
        "user_principal_keytab": "{{ model.serviceName }}admin_kerberos_secret"
      },
      "kerberos_tls": {
        "enable": true
      }
    },
    "service_account": "dcos_{{ model.serviceName }}",
    "service_account_secret": "dcos_{{ model.serviceName }}_secret",
    "virtual_network_enabled": true,
    "virtual_network_name": "dcos",
    }
  }
   ```


# Configuring DC/OS Access for DC/OS {{model.techName }}

This topic describes how to configure DC/OS access for DC/OS {{model.techName }}. Depending on your security mode, DC/OS {{model.techName }} requires service authentication for access to DC/OS.



| Security Mode  |   Service Account |
|----------------|-------------------|
| Disabled      |    Not available |
| Permissive    |    Optional |
| Strict 	     |     Required |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the superuser permission.

### Prerequisites:

- [DC/OS CLI](https://docs.mesosphere.com/1.10/cli/install/) installed and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](https://docs.mesosphere.com/1.10/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](https://docs.mesosphere.com/1.10/security/ent/) is permissive or strict, you must [get the root cert](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

## Create a Key Pair

In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.


1. Create a public-private key pair and save each value into a separate file within the current directory.

   ```shell
   dcos security org service-accounts keypair {{ model.serviceName }}-private-key.pem {{ model.serviceName }}-public-key.pem
   ```  
1. You can use the [DC/OS Secret Store](https://docs.mesosphere.com/latest/security/ent/secrets/) to secure the key pair.

## Create a Service Account

1. From a terminal prompt, create a new service account (<service-account-id>) containing the public key (<your-public-key>.pem).

   ```shell
   dcos security org service-accounts create -p {{ model.serviceName }}-public-key.pem -d "dcos_{{ model.serviceName }}" <service name>
   ``` 
1. You can verify your new service account using the following command.

   ```shell
   dcos security org service-accounts show <service-account-id>
   ``` 
## Create a Secret

Create a secret `{{ model.serviceName }}/<secret-name>` with your service account `<service-account-id>` and private key specified (<private-key>.pem).

If you store your secret in a path that matches the service name (for example, if a service name and secret path are both named `{{ model.serviceName }}`), then only the service named `{{ model.serviceName }}` can access it.

### Permissive     

   ```shell
   dcos security secrets create-sa-secret {{ model.serviceName }}-private-key.pem <service name> <service name secret>
   ``` 
   
### Strict     

   ```shell
   dcos security secrets create-sa-secret --strict {{ model.serviceName }}-private-key.pem <service name> <service name secret>
   ```    
You can list the secrets with this command:  
 
   ```shell
   dcos security secrets list /
   ```    

### Assign Permissions

   ```shell
   dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser" 
   ```    

