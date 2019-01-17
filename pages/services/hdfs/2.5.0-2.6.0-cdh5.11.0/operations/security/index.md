---
layout: layout.pug
navigationTitle: Security
excerpt: Security for DC/OS Apache HDFS service
title: Security
menuWeight: 50
model: /services/hdfs/data.yml
render: mustache
---

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the usage of these important features.

A good overview of these features can be found [here](https://hadoop.apache.org/docs/r2.6.0/hadoop-project-dist/hadoop-common/SecureMode.html).

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>

## Transport Encryption

#include /services/include/security-transport-encryption-lead-in.tmpl

<p class="message--note"><strong>NOTE: </strong>Enabling transport encryption is not <strong>required</strong> to use <a href="#kerberos-authentication">Kerberos authentication</a>, but transport encryption <strong>can</strong> be combined with Kerberos authentication.</p>

#include /services/include/security-configure-transport-encryption.tmpl

#include /services/include/security-transport-encryption-clients.tmpl

## Authentication

DC/OS {{ model.techName }} supports Kerberos authentication.

### Kerberos Authentication

Kerberos authentication relies on a central authority to verify that {{ model.techShortName }} clients are who they say they are. DC/OS {{ model.techName }} integrates with your existing Kerberos infrastructure to verify the identity of clients.

#### Prerequisites
- The hostname and port of a KDC reachable from your DC/OS cluster
- Sufficient access to the KDC to create Kerberos principals
- Sufficient access to the KDC to retrieve a keytab for the generated principals
- [The DC/OS Enterprise CLI](/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

#### Configure Kerberos Authentication

#### Create principals

The DC/OS {{ model.techName }} service requires Kerberos principals for each node to be deployed. The overall topology of the {{ model.techShortName }} service is:
- 3 journal nodes
- 2 name nodes (with ZKFC)
- A configurable number of data nodes

<p class="message--note"><strong>NOTE: </strong> DC/OS Apache HDFS requires a principal for both the <tt>service primary</tt> and <tt>HTTP</tt>. The latter is used by the HTTP API.</p>

The required Kerberos principals will have the form:
```
<service primary>/name-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-0-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-0-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-1-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-1-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

<service primary>/journal-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/journal-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/journal-2-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-2-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

<service primary>/data-<data-index>-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/data-<data-index>-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

```
with:
- `service primary = service.security.kerberos.primary`
- `data index = 0 up to data_node.count - 1`
- `service subdomain = service.name with all `/`'s removed`
- `service realm = service.security.kerberos.realm`

For example, if installing with these options:
```json
{
    "service": {
        "name": "a/good/example",
        "security": {
            "kerberos": {
                "primary": "example",
                "realm": "EXAMPLE"
            }
        }
    },
    "data_node": {
        "count": 3
    }
}
```
then the principals to create would be:
```
example/name-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-0-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-0-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-1-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-1-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE

example/journal-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/journal-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/journal-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE

example/data-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/data-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/data-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
```

#include /services/include/security-kerberos-ad.tmpl

#include /services/include/security-service-keytab.tmpl

#### Install the Service

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
                "primary": "<service primary default hdfs>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```

## Authorization

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native authorization, which behaves similarly to UNIX file permissions. If Kerberos is enabled as detailed [above](#kerberos-authentication), then Kerberos principals are mapped to {{ model.techShortName }} users against which permissions can be assigned.

### Enable Authorization

#### Prerequisites
- Completion of  [Kerberos authentication](#kerberos-authentication) above.

#### Set Kerberos Principal to User Mapping

A custom mapping must be set to map Kerberos principals to OS user names for the purposes of determining group membership. This is supplied by setting the parameter
```
{
    "hdfs": {
        "security_auth_to_local": "<custom mapping>"
    }
}
```
where `<custom mapping>` is a base64-encoded string.

<p class="message--note"><strong>NOTE: </strong>Mappings for HDFS service principals will be inserted automatically.</p>

[This](https://hortonworks.com/blog/fine-tune-your-apache-hadoop-security-settings/) article has a good description of how to build a custom mapping, under the section "Kerberos Principals and UNIX User Names".

<p class="message--note"><strong>NOTE: </strong>In DC/OS 1.11 and later, the DC/OS UI will automatically encode and decode the mapping to and from base64. If installing from the CLI or from the UI in a version earlier than DC/OS 1.11, it is necessary to do the encoding manually.</p>
