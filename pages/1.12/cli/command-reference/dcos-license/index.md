---
layout: layout.pug
navigationTitle:  dcos license
title: dcos license
excerpt: Managing your DC/OS licenses
menuWeight: 9
enterprise: true
---
The `dcos license` commands allow you to review the status of your license, audit your license, and get or renew a license.

# Usage

```
dcos license [OPTIONS] COMMAND [ARGS]...
```

# Options

| Name |  Description |
|---------|-------------|
| `--version` | Show the version and exit.|
|  `--info`   |  Show information about the subcommand.|
|  `--help`   |  Show this message and exit.|

# Commands

| Name |  Description |
|---------|-------------|
| `list` | List all licenses associated with this cluster. |
| `get` | Retrieve a specific license associated with this cluster. | 
| `audit` | Retrieve audit data for your DC/OS licenses. |
| `status` | Retrieve the active license terms and breach information. |
| `renew` | Associate a new DC/OS license with the cluster and make it active. |
