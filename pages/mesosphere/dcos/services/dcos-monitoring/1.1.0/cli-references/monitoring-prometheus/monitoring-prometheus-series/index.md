---
layout: layout.pug
navigationTitle:  dcos monitoring prometheus series
title: dcos monitoring prometheus series
menuWeight: 1
excerpt: Return the list of time series that match a certain label set
enterprise: false
---

# Description

The `dcos monitoring prometheus series` command returns the list of time series that match a certain label set.

# Usage

```bash
dcos monitoring prometheus series <selector>... [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--end int`   |   End UNIX timestamp. |
| `--help, h`   |   Display usage. |
| `--start int`   |   Start UNIX timestamp. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<selector>...`   |  Repeated series selector argument that selects the series to return. |

# Example

```bash
dcos monitoring prometheus series up mesos_master_disk_total --start=1557230502 --end=1557230507
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos monitoring prometheus](../monitoring-prometheus/) |  Query the Prometheus endpoint |
