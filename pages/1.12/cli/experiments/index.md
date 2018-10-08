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


If you encounter an issue with one of our experimental features, please [file a
ticket](https://jira.mesosphere.com/secure/CreateIssueDetails!init.jspa?pid=14105&issuetype=1&priority=3&customfield_12300=114&components=19801&description=Describe%20the%20issue%3A%0A%0AExperiments%20being%20used%3A%0A%0AReproduction%20steps%3A%0A%0AOutput%20when%20run%20with%20%60dcos%20-vv%60%3A%0A%0AOutput%20of%20%60dcos%20--version%60%3A
).

Make sure to set the component to `dcos-cli` and the team to `CLI Team`. In the
description, please include the experiments you have enabled along with the
output of the command that demonstrates the unexpected behavior with the `-vv`
flag for debug output.

# Currently Active Experiments #

## Automatic Installation of Core and Enterprise CLI Plugins ##

Usage: `export DCOS_CLI_EXPERIMENTAL_AUTOINSTALL_PLUGINS=1`

When running `dcos cluster setup` this experiment enables automatic
installation of the [Core and Enterprise CLI plugins](/1.12/cli/plugins) from
Cosmos. There are Core CLI plugins available in Cosmos for DC/OS 1.10+.

For this to be successful, the user will need to have the
`dcos:adminrouter:package` permission in order to make calls to Cosmos. Also
the system needs access to the internet or a local universe.


