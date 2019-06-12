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

<p class="message--note"><strong>NOTE: </strong>Enabling transport encryption is required to use <a href="https://docs.mesosphere.com/latest/security/ent/tls-ssl/">SSL authentication</a> for authentication, but is optional for Kerberos authentication.</p>

## Prerequisites
- A DC/OS Service Account with a secret stored in the [DC/OS Secret Store.](https://docs.mesosphere.com/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS superuser permissions for modifying the permissions of the Service Account.

## Configure Transport Encryption

<p class="message--note"><strong>NOTE: </strong>A complete guide to Configuring DC/OS Access for DC/OS {{model.techName }} can be found below.</p>


## Set up the service account

[Grant](/latest/security/ent/perms-management/) the service account the correct permissions.
- In DC/OS 1.10, the required permission is `dcos:superuser full`.
- In DC/OS 1.11 and later, the required permissions are:
```shell
dcos:secrets:default:/<service name>/* full
dcos:secrets:list:default:/<service name> read
dcos:adminrouter:ops:ca:rw full
dcos:adminrouter:ops:ca:ro full
```
where `<service name>` is the name of the service to be installed.

Run the following DC/OS Enterprise CLI commands to set permissions for the service account on a strict cluster:

```shell
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:app_id:<service/name> create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:dev_hdfs create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:dev_hdfs create
```

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
- The hostname and port of a Key Distribution Center (KDC) reachable from your DC/OS cluster
- Sufficient access to the KDC to create Kerberos principals
- Sufficient access to the KDC to retrieve a keytab for the generated principals
- [The DC/OS Enterprise CLI](/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

## Configure Kerberos Authentication
### 1. Create principals

The DC/OS {{model.techName }} service requires a Kerberos principal for the service principal and user principal. Each principal must be of the form

   ```shell
   {{ model.serviceName }}principal@<service realm>
   {{ model.serviceName }}admin@<service realm>
   ```
### 2. Place Service Keytab in DC/OS Secret Store

The DC/OS {{model.techName }} service uses a keytab containing the above service and user principals (service keytab). After creating the principals above, generate the service keytab, making sure to include all the node principals. This will be stored as a secret in the DC/OS Secret Store by `name __dcos_base64__secret_name`. The DC/OS security modules will handle decoding the file when it is used by the service. 

Create secret named "{{ model.serviceName }}admin_kerberos_secret" for password of Kerberos User Principal: `{{ model.serviceName }}admin`

Documentation for adding a file to the secret store can be found [here.](/latest/security/ent/secrets/create-secrets/#creating-secrets-from-a-file-via-the-dcos-enterprise-cli)

<p class="message--note"><strong>NOTE: </strong>Secrets access is controlled by <a href="https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets">DC/OS Spaces</a>, which function like namespaces. Any secret in the same DC/OS Space as the service will be accessible by the service.</p>

### 3. Install the Service
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

#include /services/include/service-account.tmpl

#include /services/include/security-create-permissions.tmpl
