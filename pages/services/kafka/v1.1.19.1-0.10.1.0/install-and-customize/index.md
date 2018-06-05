---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kafka-service -->




**Prerequisites:**

- [DC/OS and DC/OS CLI installed](/1.9/installing/).
- Depending on your [security mode](/1.9/security/ent/#security-modes/), Kafka requires service authentication for access to DC/OS. For more information, see [Configuring DC/OS Access for Kafka](/services/kafka/kafka-auth/).

  | Security mode | Service Account |
  |---------------|-----------------------|
  | Disabled      | Not available   |
  | Permissive    | Optional   |
  | Strict        | Required |

# Default Installation
To start a basic test cluster with three brokers, run the following command on the DC/OS CLI.

```bash
dcos package install kafka
```

This command creates a new Kafka cluster with the default name `kafka`. Two clusters cannot share the same name, so installing additional clusters beyond the default cluster requires [customizing the `name` at install time][4] for each additional instance.

All `dcos kafka` CLI commands have a `--name` argument that allows you to specify which Kafka instance to query. If you do not specify a service name, the CLI assumes the default value, `kafka`. The default value for `--name` can be customized via the DC/OS CLI configuration:

```bash
dcos kafka --name=<kafka-dev> <cmd>
```

**Note:** Alternatively, you can [install Kafka from the DC/OS GUI](/1.9/deploying-services/install/). If you install Kafka from the GUI, you must install the Kafka DC/OS CLI subcommands separately. From the DC/OS CLI, enter:

```bash
dcos package install kafka --cli
```

<a name="custom-installation"></a>
# Custom Installation
Customize the defaults by creating a JSON file. Then, pass it to `dcos package install` using the `--options` parameter.

## Minimal Installation
To start a minimal cluster with a single broker, create a JSON options file named `sample-kafka-minimal.json`:

```json
{
    "brokers": {
        "count": 1,
        "mem": 512,
        "disk": 1000
    }
}
```

Install Kafka with the  configuration specified in the `sample-kafka-minimal.json` file:

```bash
dcos package install --options=sample-kafka-minimal.json kafka
```

## Custom Brokers and Logging
Sample JSON options file named `sample-kafka-custom.json`:

```json
{
    "service": {
        "name": "sample-kafka-custom",
        "placement_strategy": "NODE"
    },
    "brokers": {
        "count": 10
    },
    "kafka": {
        "delete_topic_enable": true,
        "log_retention_hours": 128
    }
}
```

Install Kafka with the configuration specified in the `sample-kafka.json` file:

```bash
dcos package install --options=sample-kafka-custom.json kafka
```

See [Configuration Options][6] for a list of fields that can be customized via an options JSON file when the Kafka cluster is created.

# Multiple Kafka cluster installation
To install multiple Kafka clusters, specify a unique `name` for each installation. For example, you can specify `kafka1` in an options file.

```json
{
    "service": {
        "name": "kafka1"
    }
}
```

```bash
dcos package install kafka --options=kafka1.json
```

[4]: #custom-installation
[5]: https://github.com/mesosphere/dcos-vagrant
[6]: /services/kafka/v1.1.19.1-0.10.1.0/configure/#configuration-options
