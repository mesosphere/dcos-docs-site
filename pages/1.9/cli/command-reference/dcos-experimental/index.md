---
layout: layout.pug
navigationTitle:  dcos experimental
title: dcos experimental
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Manage commands under development and subject to change.

# Usage

```bash
dcos experimental [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |  

# Child commands

| Command | Description |
|---------|-------------|
| [dcos experimental package add](/1.9/cli/command-reference/dcos-experimental/dcos-experimental-package-add/)   |  Add a DC/OS package to DC/OS. |     
| [dcos experimental package build](/1.9/cli/command-reference/dcos-experimental/dcos-experimental-package-build/)   |  Build a package locally to be added to DC/OS or to be shared with Universe. |     
| [dcos experimental package start](/1.9/cli/command-reference/dcos-experimental/dcos-experimental-package-start/)   |  Start a service from a non-native DC/OS package. See `dcos experimental package add` for information on how to add a package to DC/OS. |   
