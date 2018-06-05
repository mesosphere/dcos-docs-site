---
layout: layout.pug
navigationTitle:  dcos experimental package build
title: dcos experimental package build
menuWeight: 1
excerpt: How to build a local package

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
The dcos experimental package build command lets you build a package locally to be added to DC/OS or to be shared with the DC/OS Universe.

# Usage

```bash
dcos experimental package build <build-definition> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--json`   |             |  JSON-formatted data. |
| `--output-directory=<output-directory>`   | current working directory | Path to the directory where the data should be stored.|

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<build-definition>`   |             |  Path to a DC/OS package build definition. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos experimental](/1.11/cli/command-reference/dcos-experimental/)   |  Manage commands that under development and subject to change. |     
