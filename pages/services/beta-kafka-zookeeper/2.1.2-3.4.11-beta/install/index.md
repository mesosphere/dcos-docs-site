---
layout: layout.pug
navigationTitle:
excerpt: Installing DC/OS Apache ZooKeeper service from the CLI and the web interface
title: Install and Customize
menuWeight: 20

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


The default DC/OS Apache ZooKeeper Service installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require different configurations depending on the context of the deployment.

## Prerequisites

- If you are using Enterprise DC/OS, you may [need to provision a service account](/1.11/security/ent/service-auth/) before installing DC/OS Apache ZooKeeper Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/1.11/security/ent/#security-modes) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least three private nodes.

# Installing from the DC/OS CLI

To start a basic test cluster of Apache ZooKeeper, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Apache ZooKeeper on Enterprise DC/OS](/1.11/security/ent/service-auth/).

```shell
dcos package install beta-kafka-zookeeper
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install beta-kafka-zookeeper --options=options.json
```

**Tip:** Store your custom configuration in source control.

For more information on building the `options.json` file, see the [DC/OS documentation](/1.11/deploying-services/config-universe-service/) for service configuration access.

# Installing from the DC/OS Web Interface

You can [install Apache ZooKeeper from the DC/OS web interface](/1.11/deploying-services/install/#installing-a-service-using-the-gui/). You must install the DC/OS Apache ZooKeeper CLI subcommands separately. From the DC/OS CLI, enter:

```shell
dcos package install beta-kafka-zookeeper --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
