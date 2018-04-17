---
layout: layout.pug
navigationTitle:
excerpt:
title: Security
menuWeight: 22
model: /services/beta-tensorflow/data.yml
render: mustache
---

<!-- TODO: Should this be HDFS-specific? Could we want to allow access to other services? -->
# HDFS Kerberos

<!-- TODO: Add valid link to Kerberized HDFS -->
Kerberos is an authentication system to allow {{ model.techName}} to securely read data from and write data to a Kerberos-enabled HDFS cluster such as a correctly configured (DC/OS HDFS service)[link-to-hdfs-kerberos].

### Installation with Kerberos

#include /services/include/security-transport-encryption-clients.tmpl

#### Create principals

The DC/OS {{ model.techName }} service requires a client Kerberos principal in order to access a Kerberized HDFS installation. This usually has the form `primary@REALM`.


<!-- TODO: These are specific to the service keytabs we should template/duplicate it for client keytabs -->
#include /services/include/security-kerberos-ad.tmpl
#include /services/include/security-service-keytab.tmpl

#### Install the service

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
                "primary": "<client primary default tensorflow>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        },
        "hdfs": {
            "config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
        }
    }
}
```

Note, this assumes that you are connecting to a Kerberized HDFS cluster with `core-site.xml` and `hdfs-site.xml` files available from `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints` (as is the case for the DC/OS HDFS service).

<!-- TODO: Add a link to the HDFS authz documentation. Specifically setting up auth_to_local mappings. -->
In order for the {{ model.TechName }} service to have access to a specified HDFS folder, it may be required to adjust the authorization options for HDFS. See, for example, the [authorization documentation for DC/OS HDFS](hdfs-authorization-documenation).
