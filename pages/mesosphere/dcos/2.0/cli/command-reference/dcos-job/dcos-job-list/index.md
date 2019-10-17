---
layout: layout.pug
navigationTitle:  dcos job list
title: dcos job list
menuWeight: 3
excerpt: Displaying all job definitions
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


# Description
The `dcos jobs list` command allows you to display all job definitions.

# Usage

```bash
dcos job list [--json|--quiet]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Displays usage for this command. |
| `--json`   |   Print JSON-formatted list instead of a table. |
| `-q`, `--quiet` | Indicates a quiet mode which results in just an array of run ids. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/mesosphere/dcos/2.0/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
