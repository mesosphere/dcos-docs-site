---
layout: layout.pug
navigationTitle:  dcos monitoring prometheus values
title: dcos monitoring prometheus values
menuWeight: 1
excerpt: Return a list of label values, can be for a provided label name
enterprise: false
---

# Description

The `dcos monitoring prometheus values` command returns a list of label values, which can be for a provided label name.

# Usage

```bash
dcos monitoring prometheus values [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--filter string`   |   Filter for the values. |
| `--help, h`   |   Display usage. |
| `--label string`   |   Label values for a provided label name (default: `"__name__"`). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos monitoring prometheus](../monitoring-prometheus/) |  Query the Prometheus endpoint |
