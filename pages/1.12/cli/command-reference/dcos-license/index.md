---
layout: layout.pug
navigationTitle:  dcos license
title: dcos license
excerpt: Using the DC/OS license
menuWeight: 9
enterprise: true
---
The `dcos license` commands allow you to review the status of your license, audit your license, and get or renew a license.

```
dcos license
Usage:
  dcos license list [--output <file_path>]
  dcos license get [<id>|active] [--output <file_path>] [--decryption-key]
  dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
  dcos license status [--terms] [--breaches]
  dcos license renew [OPTIONS] PATH
```

# Options

| Name |  Description |
|---------|-------------|
| `list` | Display the cluster licenses |
| `get` | Display the cluster licenses | 
| `audit get` | Get the cluster license audit records |
| `status` | Review the cluster license status |
| `renew` | Renew a cluster license |
