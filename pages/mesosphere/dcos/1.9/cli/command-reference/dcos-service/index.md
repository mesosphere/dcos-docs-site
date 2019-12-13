---
layout: layout.pug
navigationTitle:  dcos service
title: dcos service
menuWeight: 8
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Manage DC/OS services.

# Usage

```bash
dcos service [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--completed`   |             | Show the completed and active services. Completed services have either been disconnected from master and reached their failover timeout, or have been explicitly shutdown via the `/shutdown` endpoint. |
| `--help, h`   |             |  Print usage. |
| `--inactive`   |             | Show the inactive and active services. Inactive services have been disconnected from master, but haven't yet reached their failover timeout. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--json`   |             |  JSON-formatted data. |
| `--version, v`   |             | Print version information. | 

# Child commands

| Command | Description |
|---------|-------------|
| [dcos service log](/mesosphere/dcos/1.9/cli/command-reference/dcos-service/dcos-service-log/)   | Print the service logs. | 
| [dcos service shutdown](/mesosphere/dcos/1.9/cli/command-reference/dcos-service/dcos-service-shutdown/)   | Shutdown a service. |
