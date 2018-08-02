---
layout: layout.pug
navigationTitle:  dcos experimental package build
title: dcos experimental package build
menuWeight: 2
excerpt: Building a local package
enterprise: false
---


# Description
The `dcos experimental package build` command allows you to build a package locally to be added to DC/OS or to be shared with the DC/OS Universe.

# Usage

```bash
dcos experimental package build <build-definition> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--json`   |             | Specifies JSON-formatted data. |
| `--output-directory=<output-directory>`   | current working directory | Path to the directory where the data should be stored.|

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<build-definition>`   |   Path to a DC/OS package build definition. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos experimental](/1.11/cli/command-reference/dcos-experimental/)   |  Manage commands that under development and subject to change. |     
