---
layout: layout.pug
navigationTitle:  dcos experimental service start
title: dcos experimental service start
menuWeight: 2
excerpt: How to start a service from a non-native DC/OS package

enterprise: false
---


# Description
The dcos experimental service start command will start a service from a non-native DC/OS package. See `dcos experimental package add` for information on how to add a package to DC/OS.

# Usage

```bash
dcos experimental service start <package-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--json`   |             |  JSON-formatted data. |
| `--options=<options-file>`   |             | Path to a JSON file that contains customized package execution options. |
| `--package-version=<package-version>`   |             | The package version. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |    

# Parent command

| Command | Description |
|---------|-------------|
| [dcos experimental](/1.11/cli/command-reference/dcos-experimental/)   |  Manage commands that under development and subject to change. |  
