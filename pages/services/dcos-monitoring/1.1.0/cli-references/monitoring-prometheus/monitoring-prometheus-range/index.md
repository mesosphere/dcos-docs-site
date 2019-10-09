---
layout: layout.pug
navigationTitle:  dcos monitoring prometheus range
title: dcos monitoring prometheus range
menuWeight: 1
excerpt: Evaluate an expression query over a range of time
enterprise: false
---

# Description

The `dcos monitoring prometheus range` command evaluates an expression query over a range of time.

# Usage

```bash
dcos monitoring prometheus range <query> --start=<start> --end=<end> --step=<step> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--end int`   |   End UNIX timestamp. |
| `--help, h`   |   Display usage. |
| `--start int`   |   Start UNIX timestamp. |
| `--step string`   |   Query resolution step width duration, e.g. '15m3s' (default to '1s'). |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<query>`   |  The Prometheus query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos monitoring prometheus](../monitoring-prometheus/) |  Query the Prometheus endpoint |
