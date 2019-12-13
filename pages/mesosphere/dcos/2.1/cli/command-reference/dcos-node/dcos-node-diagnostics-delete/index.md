---
layout: layout.pug
navigationTitle:  dcos node diagnostics delete
title: dcos node diagnostics delete
menuWeight: 4
excerpt: Displaying the details of diagnostics bundles
enterprise: false
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---


# Description
The dcos node diagnostics delete command allows you to view the details of diagnostics bundles.

<p class="message--warning"><strong>WARNING: </strong>This command is deprecated since DC/OS 2.0; please use <a href="/mesosphere/dcos/2.1/cli/command-reference/dcos-diagnostics/dcos-diagnostics-delete/"><tt>dcos diagnostics delete</tt></a> instead.</p>

# Usage

```bash
dcos node diagnostics delete <bundle>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<bundle>`   |   The bundle filename. For example, `bundle-2017-02-01T00:33:48-110930856.zip`. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/2.1/cli/command-reference/dcos-node/) | View DC/OS node information. |

