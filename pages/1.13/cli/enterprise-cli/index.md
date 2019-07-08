---
layout: layout.pug
title: DC/OS Enterprise CLI
menuWeight: 5
excerpt: Configuring the DC/OS Enterprise command line interface
render: mustache
model: /1.13/data.yml
enterprise: true
---

The DC/OS Enterprise CLI provides commands for DC/OS Enterprise features:

- [`dcos backup`](/1.13/cli/command-reference/dcos-backup/)
- [`dcos license`](/1.13/cli/command-reference/dcos-license/)
- [`dcos security`](/1.13/cli/command-reference/dcos-security/)

# <a name="ent-cli-install"></a>Installing the DC/OS Enterprise CLI

The DC/OS Enterprise CLI **is automatically installed** when setting up the connection from the CLI to your DC/OS cluster.

To confirm that the dcos-enterprise-cli is installed, run `dcos plugin list`. You can see the enterprise CLI there as it is now a standard plugin. To manage, read [our documentation about CLI plugins](/1.13/cli/plugins/).

The previous installation process using `dcos package install dcos-enterprise-cli` is deprecated since DC/OS 1.13 and the DC/OS CLI 0.8.

## Deprecated installation (DC/OS <= 1.12)
### Prerequisite

The DC/OS CLI must already be [installed](/1.13/cli/install/).

<p class="message--note"><strong>NOTE: </strong>The DC/OS Enterprise CLI must be installed from the DC/OS CLI. You cannot install the DC/OS Enterprise CLI from the {{ model.packageRepo }} in the web interface.</p>

To install the DC/OS Enterprise CLI, issue the following command from a terminal prompt.

```bash
dcos package install dcos-enterprise-cli
```

<p class="message--note"><strong>NOTE: </strong>Do not use <code>sudo</code>.</p>

<a name="ent-cli-upgrade"></a>

### Upgrading the DC/OS Enterprise CLI

A reinstall of the DC/OS Enterprise CLI upgrades the package.

```bash
dcos package install dcos-enterprise-cli
```


### <a name="ent-cli-uninstall"></a>Uninstalling the DC/OS Enterprise CLI

To uninstall the DC/OS Enterprise CLI, issue the following command.

```bash
dcos package uninstall dcos-enterprise-cli
```
