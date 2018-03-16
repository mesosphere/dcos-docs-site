---
layout: layout.pug
navigationTitle:  dcos package
title: dcos package
menuWeight: 7
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Install and manage DC/OS software packages.

# Usage

```bash
dcos package
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--config-schema`   |             |  Show the configuration schema for the subcommand. |
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |
        
# Child commands

| Command | Description |
|---------|-------------|
| [dcos package describe](/1.9/cli/command-reference/dcos-package/dcos-package-describe/)   | Get specific details for packages. |  
| [dcos package install](/1.9/cli/command-reference/dcos-package/dcos-package-install/)   | Install a package. |  
| [dcos package list](/1.9/cli/command-reference/dcos-package/dcos-package-list/)   | Print a list of the installed DC/OS packages. |  
| [dcos package repo add](/1.9/cli/command-reference/dcos-package/dcos-package-repo-add/)   | Add a package repository to DC/OS. |  
| [dcos package repo list](/1.9/cli/command-reference/dcos-package/dcos-package-repo-list/)   | Remove a package repository from DC/OS. |  
| [dcos package repo remove](/1.9/cli/command-reference/dcos-package/dcos-package-repo-remove/)   | Remove a package repository from DC/OS. |  
| [dcos package search](/1.9/cli/command-reference/dcos-package/dcos-package-search/)   | Search the package repository. |  
| [dcos package uninstall](/1.9/cli/command-reference/dcos-package/dcos-package-uninstall/)   | Uninstall a package. |  
| [dcos package update](/1.9/cli/command-reference/dcos-package/dcos-package-update/)   | This command has been deprecated. Repositories are dynamically updated when they are added by the `dcos package repo add` command. | 
