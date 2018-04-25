---
layout: layout.pug
navigationTitle:  dcos experimental
title: dcos experimental
menuWeight: 0
excerpt: How to add a DC/OS package to DC/OS

enterprise: false
---


# Description
The dcos experimental command will add a DC/OS package to DC/OS.

# Usage

```bash
dcos experimental package add [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--dcos-package=<dcos-package>`   |             | Path to a DC/OS package. |
| `--json`   |             |  JSON-formatted data. |
| `--package-name=<package-name>`   |             | Name of the DC/OS package. |
| `--package-version=<package-version>`   |             | The package version. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos experimental](/1.11/cli/command-reference/dcos-experimental/)   |  Manage commands that under development and subject to change. |  
