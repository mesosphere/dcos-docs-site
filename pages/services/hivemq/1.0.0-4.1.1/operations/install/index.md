---
layout: layout.pug
navigationTitle:  Install and Customize HiveMQ
title: Install and Customize HiveMQ
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

# Default Installation

To start a basic cluster with cluster three nodes:

```bash
$ dcos package install hivemq
```

This command creates a new HiveMQ cluster with the default name `hivemq`. Two clusters cannot share the same name, so installing additional clusters beyond the default cluster requires customizing the `name` at install time for each additional instance.

**Note:** You can also install hivemq from the **Universe** > **Packages** tab of the DC/OS web interface. If you install hivemq from the web interface, you must install the hivemq DC/OS CLI subcommands separately. From the DC/OS CLI, enter:

```bash
dcos package install hivemq --cli
```

# Custom Installation

You can customize the hivemq cluster in a variety of ways by specifying a JSON options file. For example, here is a sample JSON options file that customizes the service name, node count and log level of the brokers

```json
{
    "service": {
        "name": "another-cluster"
    },
    "node": {
        "count": 4
    },
    "hivemq": {
        "hivemq_log_level": "DEBUG"
    }
}
```

The command below creates a cluster using a `options.json` file:

```bash
$ dcos package install hivemq --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

# Multiple hivemq Cluster Installation

Installing multiple hivemq clusters is identical to installing hivemq clusters with custom configurations as described above. The only requirement on the operator is that a unique `name` is specified for each installation.

Sample JSON options file named `another-cluster.json`:
```json
{
    "service": {
        "name": "another-cluster"
    }
}
```

The command below creates a cluster using `another-cluster.json`:

```bash
$ dcos package install hivemq --options=another-cluster.json
```

See the Configuring section for a list of fields that can be customized via an options JSON file when the hivemq cluster is created.

## Virtual networks
HiveMQ supports deployment [virtual networks](/1.10/networking/virtual-networks/) on DC/OS (including the `dcos` overlay network), allowing each container (task) to have its own IP address and not use the ports resources on the agent. This can be specified by passing the following configuration during installation:
```json
{
    "service": {
        "virtual_network_enabled": true
    }
}
```
As mentioned in the [developer guide](https://mesosphere.github.io/dcos-commons/developer-guide.html) once the service is deployed on a virtual network, it cannot be updated to use the host network.

# Configuration Guidelines

- Service name: This needs to be unique for each instance of the service that is running. It is also used as your cluster name.
- Service user: This must be a non-root user that already exists on each agent. The default user is `nobody`.
- CPU/RAM/Disk: These will be specific to your DC/OS cluster and your hivemq use cases. Please refer to HiveMQ's [System Requirements](https://www.hivemq.com/docs/4/hivemq/system-requirements.html)

## Immutable settings (at cluster creation time via hivemq package UI or JSON options file via CLI)

These setting cannot be changed after installation.

- Service name (aka cluster name). Can be hyphenated, but not underscored.
- Disk sizes/types.
- Cluster transport TLS.
- Virtual Network toggle.

## Modifiable settings (at runtime via Marathon env vars):

- CPU
- Memory
- JVM options
- HiveMQ specific configuration
- TLS configuration except for cluster TLS
- Security configuration
- MQTT specific configuration
- Configuration template override

Some of these settings can also be modified at runtime using [sidecar plans](/services/hivemq/1.0.0-4.1.1/operations/configuration/#sidecar-plans)

# Viewing Plans via the CLI

You can view the deploy plan for the DC/OS hivemq Service via the service URL: `http://$DCOS_URL/service/$SERVICE_NAME/v1/plans`