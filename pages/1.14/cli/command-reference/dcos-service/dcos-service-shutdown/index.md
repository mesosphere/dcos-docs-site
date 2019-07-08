---
layout: layout.pug
navigationTitle:  dcos service shutdown
title: dcos service shutdown
menuWeight: 2
excerpt: Shutting down a service
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos service shutdown` command allows you to shut down a service.

# Usage

```bash
dcos service shutdown <service-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Print usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<service-id>`   |  The DC/OS service ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos service](/1.14/cli/command-reference/dcos-service/)   | Manage DC/OS services. |
