---
layout: layout.pug
navigationTitle:  dcos quota list
title: dcos quota list
menuWeight: 1
excerpt: List all the quotas
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# Description

The `dcos quota list` command allows you to list all the group quotas on a cluster.

# Usage

```bash
dcos quota list [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`     | Print usage. |
| `--json`   |   JSON-formatted list. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | Managing DC/OS quotas. |
