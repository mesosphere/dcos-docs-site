---
layout: layout.pug
title: Enterprise DC/OS CLI
menuWeight: 6
excerpt:
featureMaturity:
enterprise: true
---

The Enterprise DC/OS CLI provides commands for DC/OS Enterprise features: 

- [`dcos backup`](/1.11/cli/command-reference/dcos-backup)
- [`dcos license`](/1.11/cli/command-reference/dcos-license)
- [`dcos security`](/1.11/cli/command-reference/dcos-security)
- [`dcos storage`](/1.11/cli/command-reference/dcos-storage)

# <a name="ent-cli-install"></a>Installing the Enterprise DC/OS CLI

**Prerequisite:** The DC/OS CLI must already be [installed](/1.11/cli/install/).

**Tip:** The Enterprise DC/OS CLI must be installed from the DC/OS CLI. You cannot install from the Catalog in the GUI.

To install the Enterprise DC/OS CLI, issue the following command from a terminal prompt.

```bash
dcos package install dcos-enterprise-cli
```

**Note:** Do not use `sudo`.


# <a name="ent-cli-upgrade"></a>Upgrading the Enterprise DC/OS CLI

A reinstall of the Enterprise DC/OS CLI upgrades the package.

```bash
dcos package install dcos-enterprise-cli
```


# <a name="ent-cli-uninstall"></a>Uninstalling the Enterprise DC/OS CLI

To uninstall the Enterprise DC/OS CLI, issue the following command.

```bash
dcos package uninstall dcos-enterprise-cli
```
