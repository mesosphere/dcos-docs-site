---
layout: layout.pug
navigationTitle: 
title: Installing and Customizing
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


The standard install provides a reasonable default configuration for trying out the service, but is not necessarily suited for production use. Different custom configurations are recommended depending on the context of your production deployment.

## Prerequisities

1. Install DC/OS on your cluster. See [the documentation](/latest/administration/installing/) for instructions.

1. Install the DC/OS [CLI](https://dcos.io/docs/1.10/cli/install/) and point it towards your cluster

```
dcos cluster setup http://your-cluster.com
```

- Depending on your security mode in Enterprise DC/OS, you may [need to provision a service account](/services/kafka/kafka-auth/) before installing Kafka. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](https://docs.mesosphere.com/1.10/administration/installing/custom/configuration-parameters/#security) requires a service account.
	- `permissive` security mode a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least three private nodes.

## Installation from the CLI

To start a basic test cluster with three brokers, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Kafka on Enterprise DC/OS](https://docs.mesosphere.com/services/beta-confluent-kafka/v1.2.4-3.3.0e-beta/install-and-customize/).

```
dcos package install beta-confluent-kafka
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```
$ dcos package install beta-confluent-kafka --options=your-options.json
```

For more information about building the options.json file, see the [DC/OS documentation](/latest/usage/managing-services/config-universe-service/).

## Installation from the DC/OS Web Interface

1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.

1. Navigate to **Universe** > **Packages** and find the `beta-confluent-kafka` package.

1. Click `Install`, then in the pop up dialog click `Advanced` to see the customization dialog.

1. Make your changes to the default configuration in the customization dialog, then click `Review`.

1. Examine the configuration summary for any needed changes. Click `Back` to make changes, or `Install` to confirm the settings and install the service.

## Service Settings

### Service Name

Each instance of Kafka in a given DC/OS cluster must be configured with a different service name. You can configure the service name in the **service** section of the advanced installation section of the DC/OS web interface. The default service name (used in many examples here) is `confluent-kafka`.

All DC/OS Kafka CLI commands have a --name argument that allows the user to specify which instance to query. If you do not specify a service name, the CLI assumes the default value, `confluent-kafka`. The default value for `--name` can be customized via the DC/OS CLI configuration:
```
dcos beta-confluent-kafka --name beta-confluent-kafka-dev <cmd>
```

## Broker Settings

Adjust the following settings to customize the amount of resources allocated to each broker. Confluent Kafka's requirements (https://www.confluent.io/whitepaper/deploying-confluent-platform-with-mesosphere/) must be taken into consideration when adjusting these values. Reducing these values below those requirements may result in adverse performance and/or failures while using the service.

Each of the following settings can be customized under the **broker** configuration section of the advanced installation section of the DC/OS web interface.


### CPU

The amount of CPU allocated to each broker can be customized. A value of `1.0` equates to one full CPU core on a machine. Customize this value by editing the **cpus** value under the **broker** configuration section. Turning this too low will result in throttled tasks.

### Memory

The amount of RAM allocated to each broker can be customized. Customize this value by editing the **mem** value (in MB) under the **broker** configuration section. Turning this too low will result in out of memory errors. The `heap.size` setting must also be less than this value to prevent out of memory errors resulting from the Java Virtual Machine attempting to allocate more memory than is available to the Kafka process.

### Broker Count

Configure the number of brokers running in a given Kafka cluster. The default count at installation is three brokers. This number can be increased, but not decreased, after installation.

### Ports

Each port exposed by the service can be customized in the service configuration. If you wish to install multiple instances of the service and have them colocate on the same machines, you must ensure that **no** ports are common between those instances. Customizing ports is only needed if you require multiple instances sharing a single machine. This customization is optional otherwise.

### Storage Volumes

The service supports two volume types:
- `ROOT` volumes are effectively an isolated directory on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

Using `MOUNT` volumes requires [additional configuration on each DC/OS agent system](https://docs.mesosphere.com/1.10/administration/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default.

### Placement Constraints

Placement constraints allow you to customize where the service is deployed in the DC/OS cluster.

Placement constraints support all [Marathon operators (reference)](http://mesosphere.github.io/marathon/docs/constraints.html) with this syntax: `field:OPERATOR[:parameter]`. For example, if the reference lists `[["hostname", "UNIQUE"]]`, you should  use `hostname:UNIQUE`.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
```
hostname:LIKE:10.0.0.159|10.0.1.202|10.0.3.3
```

You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service without that system.

For an example of updating placement constraints, see the Managing section.
