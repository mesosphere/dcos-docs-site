---
layout: layout.pug
navigationTitle:  dcos quota update
title: dcos quota update
menuWeight: 1
excerpt: Updating a quota
render: mustache
model: /mesosphere/dcos/2.0/data.yml
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
| `--cpu`     | Number of CPUs for the quota's limit. |
| `--disk`     | Amount of disk (in MiB) for the quota's limit. |
| `--force` | Force the quota creation. |
| `--gpu`     | Number of GPUs for the quota's limit. |
| `--help, h`     | Print usage. |
| `--mem`     | Amount of memory (in MiB) for the quota's limit. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | Managing DC/OS quotas. |
