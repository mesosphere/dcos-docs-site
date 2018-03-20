---
layout: layout.pug
navigationTitle:
excerpt:
title: Install and Customize
menuWeight: 20

model: /services/confluent-zookeeper/data.yml
render: mustache
---

<!-- Imported from git@github.com:mesosphere/dcos-zookeeper.git:update-docs -->

The default DC/OS {{ model.techName }} Service installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require different configurations depeneding on the context of the deployment.

## Prerequisites

- If you are using Enterprise DC/OS, you may [need to provision a service account](/latest/security/ent/service-auth/custom-service-auth/) before installing DC/OS {{ model.techName }} Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/latest/security/ent/#security-modes) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least 3 private nodes.

# Installing from the DC/OS CLI

To start a basic test cluster of {{ model.techName }}, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing {{ model.techName }} on Enterprise DC/OS](/latest/security/ent/service-auth/custom-service-auth/).

```shell
dcos package install {{ model.packageName }}
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install {{ model.packageName }} --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see the [DC/OS documentation](/latest/deploying-services/config-universe-service/) for service configuration access.

# Installng from the DC/OS Web Interface

You can [install {{ model.techName }} from the DC/OS web interface](/latest/gui/catalog/). If you install {{ model.techName }} from the web interface, you must install the DC/OS {{ model.techName }} CLI subcommands separately. From the DC/OS CLI, enter:

```shell
dcos package install {{ model.packageName }} --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
