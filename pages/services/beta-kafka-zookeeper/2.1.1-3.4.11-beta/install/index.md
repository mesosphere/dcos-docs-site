---
layout: layout.pug
navigationTitle:
title: Install and Customize
menuWeight: 20
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->

The default DC/OS Apache Zookeeper Service installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require a different configuration depending on the context of the deployment.

## Prerequisites

- If you are using Enterprise DC/OS, you may [need to provision a service account](/latest/security/ent/service-auth/custom-service-auth/) before installing the DC/OS Apache Zookeeper Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/latest/installing/ent/custom/configuration/configuration-parameters/#security) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least 3 private nodes.

# Installing from the DC/OS CLI

To start a basic test cluster of Apache Zookeeper, run the following command at the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Apache Zookeeper is on Enterprise DC/OS](/1.10/security/ent/service-auth/custom-service-auth/).

```shell
dcos package install beta-kafka-zookeeper
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install beta-kafka-zookeeper --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see the [DC/OS documentation](/latest/usage/managing-services/config-universe-service/) for service configuration access.

# Installng from the DC/OS Web Interface

You can [install Apache Zookeeper from the DC/OS web interface](/latest/usage/managing-services/install/). If you install Apache Zookeeper from the web interface, you must install the DC/OS Apache Zookeeper CLI subcommands separately. From the DC/OS CLI, enter:

```shell
dcos package install beta-kafka-zookeeper --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
