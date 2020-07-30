---
layout: layout.pug
navigationTitle:  dcos node diagnostics create
title: dcos node diagnostics create
menuWeight: 3
excerpt: Creating a diagnostics bundle
enterprise: false
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---

# Description
The `dcos node diagnostics create` command allows you to create a diagnostics bundle.

<p class="message--warning"><strong>WARNING: </strong>This command is deprecated since DC/OS 2.0; please use <a href="/mesosphere/dcos/2.1/cli/command-reference/dcos-diagnostics/dcos-diagnostics-create/"><tt>dcos diagnostics create</tt></a> instead.</p>

# Usage

```bash
dcos node diagnostics create (<nodes>)
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|-------------|
| `<nodes>`   |   Node to run command upon. A node can be any of the following: IP address, hostname, Mesos ID, or the keywords `all`, `masters`, `agents`. |

# Example

```bash
dcos node diagnostics create 10.0.2.221

Job has been successfully started, available bundle: bundle-2019-03-18-1552932773.zip
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/2.1/cli/command-reference/dcos-node/) | View DC/OS node information. |

