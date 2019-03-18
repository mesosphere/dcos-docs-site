---
layout: layout.pug
navigationTitle:  dcos node diagnostics download
title: dcos node diagnostics download
menuWeight: 3
excerpt: Downloading the diagnostics bundle

enterprise: false
---



# Description
The `dcos node diagnostics download` command allows you to download the diagnostics bundle to a specific location.

# Usage

```bash
dcos node diagnostics download <bundle> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--location=<location>`   |  Current directory |  Download the diagnostics bundle to a specific location. If not set, the default location is your current working directory. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<bundle>`   |  The bundle filename. For example, `bundle-2017-02-01T00:33:48-110930856.zip`. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |


