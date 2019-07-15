---
layout: layout.pug
navigationTitle:  dcos quota create
title: dcos quota create
menuWeight: 1
excerpt: Creating a quota
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description

The `dcos quota create` command allows you to create a new quota.

# Usage

```bash
dcos quota create <group> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--cpu`     | Amount of CPU for the quota (default: 1). |
| `--force` | Force the quota creation. |
| `--help, h`     | Print usage. |
| `--mem`     | Amount of memory for the quota (default: 1). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos quota](/1.14/cli/command-reference/dcos-quota/)   | Managing DC/OS quotas. |
