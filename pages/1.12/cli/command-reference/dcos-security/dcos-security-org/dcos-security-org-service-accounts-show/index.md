---
layout: layout.pug
navigationTitle:  dcos security org service-accounts show
title: dcos security org service-accounts show
menuWeight: 180
excerpt: Showing service account details
enterprise: true
---

# Description

The `dcos security org service-accounts show` command displays the details of a service account identified by its SID.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-j`, `--j` | Output data in JSON format.|
| `SID` | Service Account ID. (Required)|

# Usage

```
Usage: dcos security org service-accounts show [OPTIONS] [SIDS]...

  Print details of a service account identified by SID.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```