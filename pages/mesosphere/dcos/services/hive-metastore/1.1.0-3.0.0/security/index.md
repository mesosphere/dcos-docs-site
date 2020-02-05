---
layout: layout.pug
navigationTitle: Security
excerpt: Securing your service
title: DC/OS Hive Metastore security
menuWeight: 50
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
enterprise: true
quota-aware: true
---

# DC/OS {{ model.techName }} Security

- The DC/OS {{ model.techName }} service allows you to create a service account to configure access for {{ model.techName }}. The service allows you to create and assign permissions as required for access.  

- The DC/OS {{ model.techName }} service supports {{ model.techName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of the following features.

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>

#include /mesosphere/dcos/services/include/service-account.tmpl

#include /mesosphere/dcos/services/include/security-create-permissions.tmpl

# Using the Secret Store for Passwords

Enterprise DC/OS provides a Secrets store to enable access to sensitive data such as database passwords, private keys, and API tokens. DC/OS manages secure transportation of secret data, access control and authorization, and secure storage of secret content. Detailed information can be found [here](https://docs.d2iq.com/mesosphere/dcos/latest/security/ent/secrets).

All tasks defined in the pod will have access to secret data. If the content of the secret is changed, the relevant pod needs to be restarted so that it can get updated content from the secret store.

We can use secrets in {{ model.techName }} to store database passwords. We can use the secret store as follows in order to store and use secrets in {{ model.techName }} service:

1. From the left-side navigation menu, click on `Secrets`.

2. From the Secrets page, click on the `+` icon in the top-right corner of the screen to create a new secret key-value pair.

3. In the `ID` field, provide a unique ID for the key-pair we want to create. This ID will be used later to enable secrets. In the `Value` field, enter the value of the secret; for example, a database password, private key, or API token. Lastly, click on `Create Secret`. 

![Creating Secrets](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen1.png)

4. Go to the {{ model.techName }}'s service configuration page for a fresh deployment of service using secrets. Click on  the {{ model.techName }}  configuration menu to proceed.

![{{ model.techName }} Configuration](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen2.png)

5. Scroll down and look for the `Enable Secrets` checkbox. Check the box to enable secrets. 

1. Now, enter the `ID` of the secret created earlier in the `Database Password` field. Click **Review & Run**. The service will now be deployed using secrets.

![Using Secrets as the Database Password](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen3.png)

# Authentication

DC/OS {{ model.techName }} supports Kerberos authentication.

## Kerberos Authentication

Kerberos authentication relies on a central authority to verify that {{ model.techShortName }} clients are who they say they are. DC/OS {{ model.techName }} integrates with your existing Kerberos infrastructure to verify the identity of clients.

### Prerequisites
- The hostname and port of a KDC reachable from your DC/OS cluster
- Sufficient access to the KDC to create Kerberos principals
- Sufficient access to the KDC to retrieve a keytab for the generated principals
- [The DC/OS Enterprise CLI](/mesosphere/dcos/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

### Configure Kerberos Authentication

### Create principals

The DC/OS {{ model.techName }} service requires Kerberos principals for each node to be deployed. The overall topology of the {{ model.techShortName }} service is:
- 1 init node
- A configurable number of server nodes

The required Kerberos principals will have the form:
```shell
<service primary>/node-0-init.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/node-<data-index>-server.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
```
with:
- service primary = service.security.kerberos.primary
- data index = 0 up to n
- service subdomain = service.name with all `/`'s removed
- service realm = service.security.kerberos.realm

For example, if installing with these options:
```json
{
    "service": {
        "name": "a/good/example",
        "security": {
            "kerberos": {
                "enabled": true,
                "primary": "example",
                "realm": "EXAMPLE"
            }
        }
    },
    "hive_metastore": {
        "count": 3
    }
}
```
then the principals to create would be:
```shell
example/node-0-init.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/node-0-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/node-1-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/node-2-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
```

#include /mesosphere/dcos/services/include/security-kerberos-ad.tmpl

#include /mesosphere/dcos/services/include/security-service-keytab.tmpl

### Install the Service

Install the DC/OS {{ model.techName }} service with the following options in addition to your own:
```json
{
    "service": {
        "security": {
            "kerberos": {
                "enabled": true,
                "kdc": {
                    "hostname": "<kdc host>",
                    "port": <kdc port>
                },
                "primary": "<service primary default hive-metastore>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```

# Authorization

DC/OS {{ model.techName }} supports Storage Based Authorization.

## Storage Based Authorization

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s storage based authorization. When metastore server security is configured to use Storage Based Authorization, it uses the file system permissions for folders corresponding to the different metadata objects as the source of truth for the authorization policy.
- Storage based authorization authorizes read privilege on database and tables. 
- Use of Storage Based Authorization in metastore is recommended.

### Install the Service

Install the DC/OS {{ model.techName }} service with the following options in addition to your own:
```json
{
    "service": {
        "security": {
            "authorization": {
                "enabled": true
            },
        }
    }
}
```

# <a name="transport_encryption"></a> Transport Encryption

#include /mesosphere/dcos/services/include/security-transport-encryption-lead-in.tmpl

### Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store](/mesosphere/dcos/latest/security/ent/service-auth/custom-service-auth/).
- DC/OS Superuser permissions for modifying the permissions of the Service Account.

### Configure Transport Encryption

#### Set up the service account

[Grant](/mesosphere/dcos/latest/security/ent/perms-management/) the service account the correct permissions.
- In DC/OS 1.10, the required permission is `dcos:superuser full`.
- In DC/OS 1.11 and later, the required permissions are:
```shell
dcos:secrets:default:/<service name>/* full
dcos:secrets:list:default:/<service name> read
dcos:adminrouter:ops:ca:rw full
dcos:adminrouter:ops:ca:ro full
```
where `<service name>` is the name of the service to be installed.

<!-- Not clear if this is the right location DCOS-39455 --> 
Run the following DC/OS Enterprise CLI commands to set permissions for the service account on a strict cluster:

```shell
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:app_id:<service/name> create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:dev_hdfs create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:dev_hdfs create
```

#### Install the service
Install the DC/OS {{ model.techName }} service including the following options in addition to your own:
```json
{
    "service": {
        "service_account": "<your service account name>",
        "service_account_secret": "<full path of service secret>",
        "security": {
            "ssl_enabled": true
        }
    }
}
```

#include /mesosphere/dcos/services/include/security-transport-encryption-clients.tmpl

# <a name="Forwarding DNS and Custom Domain"></a> Forwarding DNS and Custom Domain

#include /mesosphere/dcos/services/include/forwarding-dns-custom-domain.tmpl

