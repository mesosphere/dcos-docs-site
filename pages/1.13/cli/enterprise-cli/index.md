---
layout: layout.pug
title: DC/OS Enterprise CLI
menuWeight: 5
excerpt: Configuring the DC/OS Enterprise command line interface

enterprise: true
---

The DC/OS Enterprise CLI provides commands for DC/OS Enterprise features:

- [`dcos backup`](/1.13/cli/command-reference/dcos-backup/)
- [`dcos license`](/1.13/cli/command-reference/dcos-license/)
- [`dcos security`](/1.13/cli/command-reference/dcos-security/)

# <a name="ent-cli-install"></a>Installing the DC/OS Enterprise CLI

## Prerequisite

The DC/OS CLI must already be [installed](/1.13/cli/install/).

**Note:** The DC/OS Enterprise CLI must be installed from the DC/OS CLI. You cannot install the DC/OS Enterprise CLI from the Catalog in the web interface.

To install the DC/OS Enterprise CLI, issue the following command from a terminal prompt.

```bash
dcos package install dcos-enterprise-cli
```

**Note:** Do not use `sudo`.


# <a name="ent-cli-upgrade"></a>Upgrading the DC/OS Enterprise CLI

A reinstall of the DC/OS Enterprise CLI upgrades the package.

```bash
dcos package install dcos-enterprise-cli
```


# <a name="ent-cli-uninstall"></a>Uninstalling the DC/OS Enterprise CLI

To uninstall the DC/OS Enterprise CLI, issue the following command.

```bash
dcos package uninstall dcos-enterprise-cli
```
