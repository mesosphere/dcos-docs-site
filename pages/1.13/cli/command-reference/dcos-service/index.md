---
layout: layout.pug
navigationTitle:  dcos service
title: dcos service
menuWeight: 14
excerpt: Managing DC/OS services

enterprise: false
---

# Description

The `dcos service` commands allow you to manage your [DC/OS services](/1.13/cli/developing-services/).

# Usage

```bash
dcos service [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--completed`   |  Show the completed and active services. Completed services have either been disconnected from master and reached their failover timeout, or have been explicitly shutdown via the `/shutdown` endpoint. |
| `--help, h`   |  Displays usage. |
| `--inactive`   | Show the inactive and active services. Inactive services have been disconnected from master, but haven't yet reached their failover timeout. |
| `--info`   |   Displays a short description of this subcommand. |
| `--json`   |    JSON-formatted data. |
| `--version, v`   |   Displays version information. |
