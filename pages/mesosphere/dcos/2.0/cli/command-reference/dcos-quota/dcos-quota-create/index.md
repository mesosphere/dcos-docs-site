---
layout: layout.pug
navigationTitle:  dcos quota create
title: dcos quota create
menuWeight: 1
excerpt: Creating a quota
render: mustache
model: /mesosphere/dcos/2.0/data.yml
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
