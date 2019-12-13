---
layout: layout.pug
navigationTitle:  dcos monitoring prometheus query
title: dcos monitoring prometheus query
menuWeight: 1
excerpt: Evaluate an instant query at a single point in time
enterprise: false
---

# Description

The `dcos monitoring prometheus query` command evaluates an instant query at a single point in time.

# Usage

```bash
dcos monitoring prometheus query <query> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--time int`   |   Evaluation UNIX timestamp (default: 0). |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<query>`   |  The Prometheus query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos monitoring prometheus](../monitoring-prometheus/) |  Query the Prometheus endpoint |
