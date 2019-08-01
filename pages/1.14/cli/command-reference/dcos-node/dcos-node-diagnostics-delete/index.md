---
layout: layout.pug
navigationTitle:  dcos node diagnostics delete
title: dcos node diagnostics delete
menuWeight: 4
excerpt: Displaying the details of diagnostics bundles
enterprise: false
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---


# Description
The dcos node diagnostics delete command allows you to view the details of diagnostics bundles.

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
| [dcos node](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |

