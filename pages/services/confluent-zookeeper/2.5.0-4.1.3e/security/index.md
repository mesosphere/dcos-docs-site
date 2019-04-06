---
layout: layout.pug
navigationTitle: Security
excerpt: Creating service accounts and assigning permissions
title: Security
menuWeight: 50
model: /services/confluent-zookeeper/data.yml
render: mustache
---

# DC/OS {{ model.techName }} Security

- The DC/OS {{ model.techName }} service allows you to create a service account to configure access for {{ model.techName }}. The service allows you to create and assign permissions as required for access.

- The DC/OS {{ model.techName }} service supports {{ model.techShortName}}'s native Kerberos authentication mechanism. The service provides automation and orchestration to simplify the usage of these important features, with both [Client-Server](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Client-Server+mutual+authentication) and [Server-Server](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Server-Server+mutual+authentication) mutual authentication supported.

An overview of the {{ model.techShortName }} Kerberos security features can be found [here](https://cwiki.apache.org/confluence/display/ZOOKEEPER/ZooKeeper+and+SASL).

<p class="message--note"><strong>NOTE: </strong> These security features are only available on DC/OS Enterprise 1.10 and later.</p>

#include /services/include/service-account.tmpl

#include /services/include/security-create-permissions.tmpl

## Authentication

DC/OS {{ model.techName }} supports the Kerberos authentication mechanism.

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

The DC/OS {{ model.techName }} service requires a Kerberos principal for each server to be deployed. Each principal must be of the form
```
<service primary>/zookeeper-<server index>-server.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
```
with:
- `service primary = service.security.kerberos.primary`
- `server index = 0 up to node.count - 1`
- `service subdomain = service.name with all `/`'s removed`
- `service realm = service.security.kerberos.realm`

For example, if installing with these options in addition to your own:
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
    "node": {
        "count": 3
    }
}
```
then the principals to create would be:
```
example/zookeeper-0-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/zookeeper-1-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/zookeeper-2-server.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
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
                "primary": "<service primary default zookeeper>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```

*Note*: It is possible to enable Kerberos after initial installation but the service may be unavailable during the transition. Additionally, your ZooKeeper clients will need to be reconfigured. For more information see the [Enabling Kerberos after deployement](#enabling-kerberos-after-deployment) section.

#### Enabling Kerberos After Deployment

It is possible to enable Kerberos authentication after the deployment of DC/OS {{ model.techName }}. As described in the (Rolling Upgrade)[https://cwiki.apache.org/confluence/display/ZOOKEEPER/Server-Server+mutual+authentication] section of the Apache ZooKeeper documentation, this requires multiple rolling restarts of the ZooKeeper ensemble and client connectivity may be lost at times.

Assuming that DC/OS {{ model.techName }} was initially deployed with `service.security.kerberos.enabled` set to `false`, the following steps can be used to enable Kerberos for the service.

Firstly -- assuming the same Kerberos settings as discussed in [Configure Kerberos Authentication](#configure-kerberos-authentication) -- create the keytab for the Kerberos principals and add this keytab to the DC/OS Secret Store as described in the [Create principals](#create-principals) and [Place Service Keytab in DC/OS Secret Store](#place-service-keytab-in-dc-os-secret-store) sections. Then create a `kerberos-toggle-step-1.json` file with the following contents:

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
                "primary": "<service primary default zookeeper>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>,
                "advanced": {
                    "required_for_quorum_learner": false,
                    "required_for_quorum_server": false,
                    "required_for_client": false
                }
            }
        }
    }
}
```
where it is important to note the `service.security.kerberos.advanced` section that is present here.

Using this config file, update your DC/OS {{ model.techName }} service:
```bash
$ dcos confluent-zookeeper --name=<service name> update start --options=kerberos-toggle-step-1.json
```
and wait for the deploy (update) plan to complete:
```bash
$ dcos confluent-zookeeper --name=<service name> plan show deploy
deploy (serial strategy) (COMPLETE)
└─ node-update (serial strategy) (COMPLETE)
   ├─ zookeeper-0:[server, metrics] (COMPLETE)
   ├─ zookeeper-1:[server, metrics] (COMPLETE)
   └─ zookeeper-2:[server, metrics] (COMPLETE)
```

The service will now have deployed with Kerberos enabled, but with non-authenticated connections for leader election and from clients still allowed. In order to obtain a secure cluster, these unauthenticated connections should now be turned off to force secure connections.

Create a `kerberos-toggle-step-2.json` file with the following contents (note that it is only required to specify the options that change):
```json
{
    "service": {
        "security": {
            "kerberos": {
                "advanced": {
                    "required_for_quorum_learner": true,
                    "required_for_quorum_server": false,
                    "required_for_client": false
                }
            }
        }
    }
}
```
and deploy this as a configuration update:
```bash
$ dcos confluent-zookeeper --name=<service name> update start --options=kerberos-toggle-step-2.json
$ dcos confluent-zookeeper --name=<service name> plan show deploy
deploy (serial strategy) (COMPLETE)
└─ node-update (serial strategy) (COMPLETE)
   ├─ zookeeper-0:[server, metrics] (COMPLETE)
   ├─ zookeeper-1:[server, metrics] (COMPLETE)
   └─ zookeeper-2:[server, metrics] (COMPLETE)
```
deploying a {{ model.techName }} instance that *requires* Kerberos authentication between learners in the leader election.

As the next step in the rolling update process, create a `kerberos-toggle-step-3.json` file with the following contents:
```json
{
    "service": {
        "security": {
            "kerberos": {
                "advanced": {
                    "required_for_quorum_learner": true,
                    "required_for_quorum_server": true,
                    "required_for_client": false
                }
            }
        }
    }
}
```
and deploy this as a configuration update:
```bash
$ dcos confluent-zookeeper --name=<service name> update start --options=kerberos-toggle-step-3.json
$ dcos confluent-zookeeper --name=<service name> plan show deploy
deploy (serial strategy) (COMPLETE)
└─ node-update (serial strategy) (COMPLETE)
   ├─ zookeeper-0:[server, metrics] (COMPLETE)
   ├─ zookeeper-1:[server, metrics] (COMPLETE)
   └─ zookeeper-2:[server, metrics] (COMPLETE)
```
{{ model.techName }} will now require Kerberos authentication for the entire leader election process.

The final step is to require Kerberos authentication for clients connecting to the DC/OS {{ model.techName }} instance with an options file (say `kerberos-toggle-step-4.json`) as follows:
```json
{
    "service": {
        "security": {
            "kerberos": {
                "advanced": {
                    "required_for_quorum_learner": true,
                    "required_for_quorum_server": true,
                    "required_for_client": true
                }
            }
        }
    }
}
```
which is deployed:
```bash
$ dcos confluent-zookeeper --name=<service name> update start --options=kerberos-toggle-step-3.json
$ dcos confluent-zookeeper --name=<service name> plan show deploy
deploy (serial strategy) (COMPLETE)
└─ node-update (serial strategy) (COMPLETE)
   ├─ zookeeper-0:[server, metrics] (COMPLETE)
   ├─ zookeeper-1:[server, metrics] (COMPLETE)
   └─ zookeeper-2:[server, metrics] (COMPLETE)
```

Unauthenticated clients will now only be allowed to ping, create a session, close a session, or authenticate when communicating with the {{ model.techName }} instance.

<p class="messge--note"><strong>NOTE: </strong> The default settings for <code>service.security.kerberos.advanced.required_for_quorum_learner</code>, <code>service.security.kerberos.advanced.required_for_quorum_server</code>, <code>service.security.kerberos.advanced.required_for_client</code> are all <code>true`.</p>

#### Disabling Kerberos After Deployment

<p class="messge--note"><strong>NOTE: </strong> Disabling Kerberos after deployment is <strong>not</strong> supported.</p>

## Securely Exposing DC/OS {{ model.techName }} Outside the Cluster.

Kerberos security is tightly coupled to the DNS hosts of the zookeeper tasks. As such, exposing a secure {{ model.techName }} service outside of the cluster requires additional setup.

### Server to Client Connection

To expose a secure {{ model.techName }} service outside of the cluster, any client connecting to it must be able to access all tasks of the service via the IP address assigned to the task. This IP address will be one of: an IP address on a virtual network or the IP address of the agent the task is running on.

### Forwarding DNS and Custom Domain

Every DC/OS cluster has a unique cryptographic ID which can be used to forward DNS queries to that Cluster. To securely expose the service outside the cluster, external clients must have an upstream resolver configured to forward DNS queries to the DC/OS cluster of the service as described [here](https://docs.mesosphere.com/latest/networking/DNS/mesos-dns/expose-mesos-zone/).

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

As a concrete example, using the custom domain of `cluster-1.acmeco.net` the server 0 task would have a host of `zookeeper-0-server.<service-name>.cluster-1.acmeco.net`.

### Kerberos Principal Changes

With a custom domain endpoint discovery will work as normal. Kerberos, however, does require slightly different configuration. As noted in the section [Create Principals](#create-principals), the principals of the service depend on the hostname of the service. When creating the Kerberos principals, be sure to use the correct domain.

For example, if installing with these settings:
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
    "node": {
        "count": 3
    }
}
```
then the principals to create would be:
```
example/zookeeper-0-server.agoodexample.cluster-1.example.net@EXAMPLE
example/zookeeper-1-server.agoodexample.cluster-1.example.net@EXAMPLE
example/zookeeper-2-server.agoodexample.cluster-1.example.net@EXAMPLE
```
