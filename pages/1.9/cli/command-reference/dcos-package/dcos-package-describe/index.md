---
layout: layout.pug
navigationTitle:  dcos package describe
title: dcos package describe
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Get specific details for packages.

# Usage

```bash
dcos package describe <package-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--app`   |             |  Application only. |
| `--cli`   |             |  Command line only. |
| `--config`   |             | Print the configurable properties of the `marathon.json` file. |
| `--options=<file>`   |             | Path to a JSON file that contains customized package installation options. |
| `--package-versions`   |             | Print all versions for this package. |
| `--package-version=<package-version>`   |             | The package version. |
| `--render`   |             |  Collate the `marathon.json` package template with values from the `config.json` and `--options`. If not provided, print the raw templates. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |
        
# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
