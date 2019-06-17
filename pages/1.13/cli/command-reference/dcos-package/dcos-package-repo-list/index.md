---
layout: layout.pug
navigationTitle:  dcos package repo list
title: dcos package repo list
menuWeight: 6
excerpt: Displaying the package repository sources
render: mustache
model: /data.yml
enterprise: false
---


# Description
The `dcos package repo list` command displays the package repository sources. Possible sources include a local file, HTTPS, and Git.

# Usage

```bash
dcos package repo list [--json]
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |
| `--json`   | Displays output as  JSON-formatted data. |



# Examples

For an example, see the [documentation](/1.13/administering-clusters/repo/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
