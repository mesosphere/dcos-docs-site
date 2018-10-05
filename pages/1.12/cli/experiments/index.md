---
layout: layout.pug
navigationTitle:  Experiments
title: Experiments
menuWeight: 1
excerpt: What experimental features are currently available and how to enable them

enterprise: false
---

Experimental features are features that are currently in development and
potentially ready for use but that may not have been extensively tested and may
still have bugs.

Experiments are activated by setting a certain environment variable.

# Reporting Issues #

If you encounter an issue with one of our experimental features, please file a
[ticket]().

Make sure to set the component to `dcos-cli` and the team to `CLI Team`. In the
description, please include the experiments you have enabled along with the
output of the command that demonstrates the incorrect behavior with the `-vv`
flag for debug output.

# Currently Active Experiments #

## Automatic Installation of Core and Enterprise CLI Plugins ##

Usage: `export DCOS_CLI_EXPERIMENTAL_AUTOINSTALL_PLUGINS=1`

When running `dcos cluster setup` this experiment enables automatic
installation of the [Core and Enterprise CLI plugins](/1.12/cli/plugins) from
Cosmos.

For this to be successful, the user will need to have the
`dcos:adminrouter:package` permission in order to make calls to Cosmos.


