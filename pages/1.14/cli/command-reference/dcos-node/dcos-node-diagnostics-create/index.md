---
layout: layout.pug
navigationTitle:  dcos node diagnostics create
title: dcos node diagnostics create
menuWeight: 3
excerpt: Creating a diagnostics bundle
enterprise: false
render: mustache
model: /1.14/data.yml
---

# Description
The `dcos node diagnostics create` command allows you to create a diagnostics bundle.

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
| `<nodes>`   |   Node to run command upon. A node can be any of the following: IP address, hostname, Mesos ID, or the keywords "`all`", "`masters`", "`agents`". You must use quotation marks around keywords. |

# Example

```bash
dcos node diagnostics create 10.0.2.221

Job has been successfully started, available bundle: bundle-2019-03-18-1552932773.zip
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |

