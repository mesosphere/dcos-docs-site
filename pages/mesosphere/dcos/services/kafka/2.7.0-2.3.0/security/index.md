---
layout: layout.pug
navigationTitle:
excerpt: Securing your service
title: Security
menuWeight: 50
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
enterprise: true
---


# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.
For more information on {{ model.techShortName }}'s security, read the following:
- [Security Overview](http://kafka.apache.org/documentation/#security)
- [Security Features](https://www.confluent.io/blog/apache-kafka-security-authorization-authentication-encryption/)

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>

#include /mesosphere/dcos/services/include/service-account.tmpl

#include /mesosphere/dcos/services/include/security-create-permissions.tmpl

## Transport Encryption

#include /mesosphere/dcos/services/include/security-transport-encryption-lead-in.tmpl

<p class="message--note"><strong>NOTE: </strong> Enabling transport encryption is **required** to use [SSL authentication](#ssl-authentication) for [authentication](#authentication), but is optional for [Kerberos authentication](#kerberos-authentication).</p>

#include /mesosphere/dcos/services/include/security-configure-transport-encryption.tmpl

<p class="message--note"><strong>NOTE: </strong>It is possible to update a running DC/OS {{ model.techName }} service to enable transport encryption after initial installation, but the service may be unavailable during the transition. Additionally, your {{ model.techShortName }} clients will need to be reconfigured unless `service.security.transport_encryption.allow_plaintext` is set to true.</p>

#### Verify Transport Encryption Enabled

After service deployment completes, check the list of [{{ model.techShortName }} endpoints](../api-reference/#connection-information) for the endpoint `broker-tls`. If `service.security.transport_encryption.allow_plaintext` is `true`, then the `broker` endpoint will also be available.

#include /mesosphere/dcos/services/include/security-transport-encryption-clients.tmpl

## Authentication

DC/OS {{ model.techName }} supports two authentication mechanisms, SSL and Kerberos. The two are supported independently and may not be combined. If both SSL and Kerberos authentication are enabled, the service will use Kerberos authentication.

<p class="message--note"><strong>NOTE: </strong> Kerberos authentication can, however, be combined with transport encryption.</p>

### Kerberos Authentication

Kerberos authentication relies on a central authority to verify that {{ model.techShortName }} clients (be it broker, consumer, or producer) are who they say they are. DC/OS {{ model.techName }} integrates with your existing Kerberos infrastructure to verify the identity of clients.

#### Prerequisites
- The hostname and port of a KDC reachable from your DC/OS cluster
- Sufficient access to the KDC to create Kerberos principals
- Sufficient access to the KDC to retrieve a keytab for the generated principals
- [The DC/OS Enterprise CLI](/mesosphere/dcos/1.10/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS Superuser permissions

#### Configure Kerberos Authentication

#### Create principals

The DC/OS {{ model.techName }} service requires a Kerberos principal for each broker to be deployed. Each principal must be of the form
```
<service primary>/kafka-<broker index>-broker.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
```
with:
- `service primary = service.security.kerberos.primary`
- `broker index = 0 up to brokers.count - 1`
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
    "brokers": {
        "count": 3
    }
}
```
then the principals to create would be:
```
example/kafka-0-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/kafka-1-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/kafka-2-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
```
#include /mesosphere/dcos/services/include/security-kerberos-ad.tmpl

#include /mesosphere/dcos/services/include/security-service-keytab.tmpl

#### Install the Service

Install the DC/OS {{ model.techName }} service with the following options in addition to your own:
```json
{
    "service": {
        "security": {
            "kerberos": {
                "enabled": true,
                "enabled_for_zookeeper": <true|false default false>,
                "kdc": {
                    "hostname": "<kdc host>",
                    "port": <kdc port>
                },
                "primary": "<service primary default kafka>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```

<p class="message--note"><strong>NOTE: </strong> If <tt>service.kerberos.enabled_for_zookeeper</tt> is set to true, then the additional setting <tt>kafka.kafka_zookeeper_uri</tt> must be configured to point at a kerberized {{ model.kafka.zookeeperTechName }} as follows:

```json
{
    "kafka": {
        "kafka_zookeeper_uri": <list of zookeeper hosts>
    }
}
```

The DC/OS {{ model.kafka.zookeeperTechName }} service (`{{ model.kafka.zookeeperPackageName }}` package) is intended for this purpose and supports Kerberos.</p>

<p class="message--note"><strong>NOTE: </strong> It is possible to enable Kerberos after initial installation but the service may be unavailable during the transition. Additionally, your {{ model.techShortName }} clients will need to be reconfigured.</p>


### SSL Authentication

SSL authentication requires that all clients be they brokers, producers, or consumers present a valid certificate from which their identity can be derived. DC/OS {{ model.techName }} uses the `CN` of the SSL certificate as the principal for a given client. For example, from the certificate `CN=bob@example.com,OU=,O=Example,L=London,ST=London,C=GB` the principal `bob@example.com` will be extracted.

#### Prerequisites
- Completion of the section [Transport Encryption](#transport-encryption) above

#### Install the Service

Install the DC/OS {{ model.techName }} service with the following options in addition to your own:
```json
{
    "service": {
        "service_account": "<service-account>",
        "service_account_secret": "<secret path>",
        "security": {
            "transport_encryption": {
                "enabled": true
            },
            "ssl_authentication": {
                "enabled": true
            }
        }
    }
}
```

<p class="message--note"><strong>NOTE: </strong> It is possible to enable SSL authentication after initial installation, but the service may be unavailable during the transition. Additionally, your {{ model.techShortName }} clients will need to be reconfigured.</p>

#### Authenticating a Client

To authenticate a client against DC/OS {{ model.techName }}, you will need to configure it to use a certificate signed by the DC/OS CA. After generating a [certificate signing request](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/), you can issue it to the DC/OS CA by calling the API `<dcos-cluster>/ca/api/v2/sign`. Using `curl` the request would look like:
```bash
curl -X POST \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    <dcos-cluster>/ca/api/v2/sign \
    -d '{"certificate_request": "<json-encoded-value-of-request.csr>"}'
```

The `<json-encoded-value-of-request.csr>` field represents the content of the `csr` file as a single line, where new lines are replaced with `\n`.

```bash
curl -X POST \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    <dcos-cluster>/ca/api/v2/sign \
    -d '{"certificate_request": ""-----BEGIN CERTIFICATE REQUEST-----\nMIIC<snipped for brevity>o39lBi1w=\n-----END CERTIFICATE REQUEST-----\n""}'
```

The response will contain a signed public certificate. More information on DC/OS CA API can be found [here](/mesosphere/dcos/latest/security/ent/tls-ssl/ca-api/).

## Authorization

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s [ACL-based](https://docs.confluent.io/current/kafka/authorization.html#using-acls) authorization system. To use {{ model.techShortName }}'s ACLs, either SSL or Kerberos authentication must be enabled as detailed above.

### Enable Authorization

#### Prerequisites
- Completion of either [SSL](#ssl-authentication) or [Kerberos](#kerberos-authentication) authentication above.

#### Install the Service

Install the DC/OS {{ model.techName }} service with the following options in addition to your own (remember, either SSL authentication or Kerberos must be enabled):
```json
{
    "service": {
        "security": {
            "authorization": {
                "enabled": true,
                "super_users": "<list of super users>",
                "allow_everyone_if_no_acl_found": <true|false default false>
            }
        }
    }
}
```

`service.security.authorization.super_users` should be set to a semi-colon delimited list of principals to treat as super users (all permissions). The format of the list is `User:<user1>;User:<user2>;...`. Using Kerberos authentication, the "user" value is the Kerberos primary, and for SSL authentication the "user" value is the `CN` of the certificate. The {{ model.techShortName }} brokers themselves are automatically designated as super users.

<p class="message--note"><strong>NOTE: </strong> It is possible to enable Authorization after initial installation, but the service may be unavailable during the transition. Additionally, {{ model.techShortName }} clients may fail to function if they do not have the correct ACLs assigned to their principals. During the transition `service.security.authorization.allow_everyone_if_no_acl_found` can be set to `true` to prevent clients from being failing until their ACLs can be set correctly. After the transition, `service.security.authorization.allow_everyone_if_no_acl_found` should be reversed to `false`</p>


## Securely Exposing DC/OS {{ model.techName }} Outside the Cluster.

Both transport encryption and Kerberos are tightly coupled to the DNS hosts of the {{ model.techShortName }} brokers. Therefore, exposing a secure {{ model.techName }} service outside of the cluster requires additional setup.

### Broker to Client Connection

To expose a secure {{ model.techName }} service outside of the cluster, any client connecting to it must be able to access all brokers of the service via the IP address assigned to the broker. This IP address will be one of: an IP address on a virtual network or the IP address of the agent the broker is running on.

### Forwarding DNS and Custom Domain

Every DC/OS cluster has a unique cryptographic ID which can be used to forward DNS queries to that Cluster. To securely expose the service outside the cluster, external clients must have an upstream resolver configured to forward DNS queries to the DC/OS cluster of the service as described [here](/mesosphere/dcos/latest/networking/DNS/mesos-dns/expose-mesos-zone/).

With only forwarding configured, DNS entries within the DC/OS cluster will be resolvable at `<task-domain>.autoip.dcos.<cryptographic-id>.dcos.directory`. However, if you configure a DNS alias, you can use a custom domain. For example, `<task-domain>.cluster-1.acmeco.net`. In either case, the DC/OS {{ model.techName }} service will need to be installed with an additional security option:
```json
{
    "service": {
        "security": {
            "custom_domain": "<custom-domain>"
        }
    }
}
```
where `<custom-domain>` is one of `autoip.dcos.<cryptographic-id>.dcos.directory` or your organization specific domain (e.g., `cluster-1.acmeco.net`).

As a concrete example, using the custom domain of `cluster-1.acmeco.net` the broker 0 task would have a host of `kafka-0-broker.<service-name>.cluster-1.acmeco.net`.

### Kerberos Principal Changes

Transport encryption alone does not require any additional changes. Endpoint discovery will work as normal, and clients will be able to connect securely with the custom domain as long as they are configured as described [here](#transport-encryption-for-clients).

Kerberos, however, does require slightly different configuration. As noted in the section [Create Principals](#create-principals), the principals of the service depend on the hostname of the service. When creating the Kerberos principals, be sure to use the correct domain.

For example, if you install with the following settings:

```json
{
    "service": {
        "name": "a/good/example",
        "security": {
            "custom_domain": "cluster-1.example.net",
            "kerberos": {
                "primary": "example",
                "realm": "EXAMPLE"
            }
        }
    },
    "brokers": {
        "count": 3
    }
}
```

The principals to create are as follows:
```
example/kafka-0-broker.agoodexample.cluster-1.example.net@EXAMPLE
example/kafka-1-broker.agoodexample.cluster-1.example.net@EXAMPLE
example/kafka-2-broker.agoodexample.cluster-1.example.net@EXAMPLE
```
