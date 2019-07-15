---
layout: layout.pug
navigationTitle:  dcos quota update
title: dcos quota update
menuWeight: 1
excerpt: Updating a quota
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description

The `dcos quota update` command allows you to update an existing quota.

# Usage

```bash
dcos quota update <group> [flags]
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
