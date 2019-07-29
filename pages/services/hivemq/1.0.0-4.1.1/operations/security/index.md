---
layout: layout.pug
navigationTitle: Security
excerpt: Security for DC/OS HiveMQ service
title: Security
menuWeight: 50
model: /services/hivemq/data.yml
render: mustache
---

### Prerequisites
- [A DC/OS Service Account with a secret stored in the DC/OS Secret Store](/latest/security/ent/service-auth/custom-service-auth/).
- DC/OS Superuser permissions for modifying the permissions of the Service Account.

### Configure Transport Encryption

#### Set up the service account

[Grant](/latest/security/ent/perms-management/) the service account the correct permissions.
- In DC/OS 1.10, the required permission is `dcos:superuser full`.
- In DC/OS 1.11 and later, the required permissions are:
```
dcos:secrets:default:/<service name>/* full
dcos:secrets:list:default:/<service name> read
dcos:adminrouter:ops:ca:rw full
dcos:adminrouter:ops:ca:ro full
```
where `<service name>` is the name of the service to be installed.

<!-- Not clear if this is the right location DCOS-39455 --> 
Run the following DC/OS Enterprise CLI commands to set permissions for the service account on a strict cluster:

```
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:app_id:<service/name> create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:dev_hdfs create
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:dev_hdfs create
```

#### Install the service
Install the DC/OS {{ model.techName }} service including the following options in addition to your own. This example enables only the MQTT-TLS listener (on port 8883 by default).

You can also enable Cluster transport TLS (only when initially deploying), WebSocket TLS and Control Center TLS listeners.

```json
{
    "service": {
        "service_account": "<your service account name>",
        "service_account_secret": "<full path of service secret>",
        "hivemq": {
            "listener_configuration": {
                "mqtt_tls_enabled": true
            }
        }
    }
}
```