---
post_title: Install and Customize
menu_order: 20
enterprise: 'no'
---

The default DC/OS Percona Server for MongoDB Service installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require different configurations depending on the context of the deployment.

## Prerequisites

- If you are using Enterprise DC/OS, you may [need to provision a service account](https://docs.mesosphere.com/latest/security/service-auth/custom-service-auth/) before installing DC/OS Percona Server for MongoDB Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](https://docs.mesosphere.com/latest/administration/installing/custom/configuration-parameters/#security) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least 3 private nodes.

# Installing from the DC/OS CLI

To start a basic test cluster of percona-mongo, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing percona-mongo on Enterprise DC/OS](https://docs.mesosphere.com/latest/security/service-auth/custom-service-auth/).

```shell
dcos package install percona-mongo 
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install percona-mongo --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](https://docs.mesosphere.com/latest/usage/managing-services/config-universe-service/) for service configuration access.

## Installing from the DC/OS Web Interface

You can [install percona-mongo from the DC/OS web interface](https://docs.mesosphere.com/latest/usage/managing-services/install/). If you install percona-mongo from the web interface, you must install the DC/OS percona-mongo CLI subcommands separately. From the DC/OS CLI, enter:

```shell
dcos package install percona-mongo --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
