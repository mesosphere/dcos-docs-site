---
layout: layout.pug
navigationTitle:
excerpt:
title: Security
menuWeight: 22
model: /services/kafka-zookeeper/data.yml
render: mustache
---

<!-- Imported from git@github.com:mesosphere/dcos-zookeeper.git:update-docs -->

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports ZooKeeper's native Kerberos authentication mechanism. The service provides automation and orchestration to simplify the usage of these important features, with both [Client-Server](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Client-Server+mutual+authentication) and [Server-Server](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Server-Server+mutual+authentication) mutal authentication supported.

An overview of the Apache ZooKeeper Kerberos security features can be found [here](https://cwiki.apache.org/confluence/display/ZOOKEEPER/ZooKeeper+and+SASL).

*Note*: These security features are only available on DC/OS Enterprise 1.10 and above.

## Authentication

DC/OS {{ model.techName }} supports the Kerberos authentication mechanism.

### Kerberos Authentication

Kerberos authentication relies on a central authority to verify that ZooKeeper clients are who they say they are. DC/OS {{ model.techName }} integrates with your existing Kerberos infrastructure to verify the identity of clients.

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

Install the DC/OS {{ model.techName }} service withe the following options in addition to your own:
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
$ dcos kafka-zookeeper --name=<service name> update start --options=kerberos-toggle-step-1.json
```
and wait for the deploy (update) plan to complete:
```bash
$ dcos kafka-zookeeper --name=<service name> plan show deploy
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
$ dcos kafka-zookeeper --name=<service name> update start --options=kerberos-toggle-step-2.json
$ dcos kafka-zookeeper --name=<service name> plan show deploy
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
$ dcos kafka-zookeeper --name=<service name> update start --options=kerberos-toggle-step-3.json
$ dcos kafka-zookeeper --name=<service name> plan show deploy
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
$ dcos kafka-zookeeper --name=<service name> update start --options=kerberos-toggle-step-3.json
$ dcos kafka-zookeeper --name=<service name> plan show deploy
deploy (serial strategy) (COMPLETE)
└─ node-update (serial strategy) (COMPLETE)
   ├─ zookeeper-0:[server, metrics] (COMPLETE)
   ├─ zookeeper-1:[server, metrics] (COMPLETE)
   └─ zookeeper-2:[server, metrics] (COMPLETE)
```

Unauthenticated clients will now only be allowed to ping, create a session, close a session, or authenticate when communicating with the {{ model.techName }} instance.

*Note*: The default settings for `service.security.kerberos.advanced.required_for_quorum_learner`, `service.security.kerberos.advanced.required_for_quorum_server`, `service.security.kerberos.advanced.required_for_client` are all `true`.

#### Disabling Kerberos After Deployment

*Note*: Disabling Kerberos after deployment is **not** supported.
