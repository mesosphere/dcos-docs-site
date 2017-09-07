---
layout: layout.pug
title: dcos experimental service start
menuWeight: 2
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos experimental service start
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Start a service from a non-native DC/OS package. See `dcos experimental package add` for information on how to add a package to DC/OS.

# Usage

```bash
dcos experimental service start <package-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos experimental service start
|---------|-------------|-------------|
| `--json`   |             |  JSON-formatted data. |
| `--options=<options-file>`   |             | Path to a JSON file that contains customized package execution options. |
| `--package-version=<package-version>`   |             | The package version. |
    
# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos experimental service start
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |    

# Parent command

| Command | Description |
navigationTitle:  dcos experimental service start
|---------|-------------|
| [dcos experimental](/docs/1.10/cli/command-reference/dcos-experimental/)   |  Manage commands that under development and subject to change. |  
