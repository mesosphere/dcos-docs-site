---
layout: layout.pug
navigationTitle:  dcos node diagnostics create
title: dcos node diagnostics create
menuWeight: 3
excerpt: Creating a diagnostics bundle

enterprise: false
---



# Description
The `dcos node diagnostics create` command allows you to create a diagnostics bundle.

# Usage

```bash
dcos node diagnostics create <nodes> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|-------------|
| `<nodes>`   |   Node to run command upon. A node can be any of the following: IP address, hostname, Mesos ID, or the keywords "all", "masters", "agents". You must use quotation marks around keywords. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |

