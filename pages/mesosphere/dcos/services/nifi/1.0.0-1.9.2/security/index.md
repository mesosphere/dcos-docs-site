---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 49
excerpt: DC/OS NiFi Service encryption, authentication, and authorization
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/nifi/data.yml
render: mustache
---

# DC/OS {{model.techName }} Security

The DC/OS {{model.techName }} service supports DC/OS {{model.techName }}’s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the usage of these important features.


## Transport Encryption and Kerberos Authentication
With transport encryption enabled, DC/OS {{model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL. The nodes will communicate securely between themselves using SSL. SSL authentication requires that all DC/OS {{model.techName }} Nodes present a valid certificate from which their identity can be derived for communicating between themselves.
DC/OS {{model.techName }} uses the CN of the SSL certificate as the principal for a given Node.
For example, CN={{ model.serviceName }}-0-node.demonifi, O="Mesosphere, Inc", L=San Francisco, ST=CA, C=US.

The service uses the [DC/OS CA](/mesosphere/dcos/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service’s certificates valid.

<p class="message--note"><strong>NOTE: </strong>Enabling transport encryption is required to use <a href="/mesosphere/dcos/latest/security/ent/tls-ssl/">SSL authentication</a> for authentication, but is optional for Kerberos authentication.</p>

## Prerequisites
- A DC/OS Service Account with a secret stored in the [DC/OS Secret Store.](/mesosphere/dcos/latest/security/ent/service-auth/custom-service-auth/)
- DC/OS superuser permissions for modifying the permissions of the Service Account.

## Configure Transport Encryption

<p class="message--note"><strong>NOTE: </strong>A complete guide to Configuring DC/OS Access for DC/OS {{model.techName }} can be found below.</p>


## Set up the service account

[Grant](/mesosphere/dcos/latest/security/ent/perms-management/) the service account the correct permissions. The required permissions are:
    
```shell
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:agent:task:user:${USER} create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:user:${USER} create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:framework:role:${FOLDER_ROLE} create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:${SERVICE_ACCOUNT} delete
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:role:${FOLDER_ROLE} create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:${SERVICE_ACCOUNT} delete
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:role:${FOLDER_ROLE} create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:secrets:default:/<service name>/* full
dcos security org users grant ${SERVICE_ACCOUNT} dcos:secrets:list:default:/<service name> read
dcos security org users grant ${SERVICE_ACCOUNT} dcos:adminrouter:ops:ca:rw full
dcos security org users grant ${SERVICE_ACCOUNT} dcos:adminrouter:ops:ca:ro full
```
    
- In DC/OS before 2.0 `FOLDER_ROLE` is path for service with slashes replaced by double undescores e.g. `fully__qualified__path__{$SERVICE_NAME}-role`. 
- In DC/OS 2.0 and later `FOLDER_ROLE` is the name of the top-level group where the service is located.


## Transport Encryption for Clients

#include /mesosphere/dcos/services/include/security-transport-encryption-clients.tmpl

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
- [The DC/OS Enterprise CLI](/mesosphere/dcos/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

## Configure Kerberos Authentication
### 1. Create principals

The DC/OS {{model.techName }} service requires a Kerberos principal for the service principal and user principal. Each principal must be of the form

   ```shell
   {{ model.serviceName }}principal@<service realm>
   {{ model.serviceName }}admin@<service realm>
   ```
### 2. Place Service Keytab in DC/OS Secret Store

The DC/OS {{model.techName }} service uses a keytab containing the above service and user principals (service keytab). After creating the principals above, generate the service keytab, making sure to include all the node principals. The DC/OS security modules will handle decoding the file when it is used by the service. 

Create secret named "{{ model.serviceName }}admin_kerberos_secret" for password of Kerberos User Principal: `{{ model.serviceName }}admin`

<p class="message--note"><strong>NOTE: </strong>Secrets access is controlled by <a href="/mesosphere/dcos/latest/security/ent/#spaces-for-secrets">DC/OS Spaces</a>, which function like namespaces. Any secret in the same DC/OS Space as the service will be accessible by the service.</p>

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
        "keytab_secret": "<keytab secret>",
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
    "virtual_network_name": "dcos"
    },
    "secrets": {"enable": true}
  }
   ```


# Configuring DC/OS Access for DC/OS {{model.techName }}

#include /mesosphere/dcos/services/include/service-account.tmpl

#include /mesosphere/dcos/services/include/security-create-permissions.tmpl
