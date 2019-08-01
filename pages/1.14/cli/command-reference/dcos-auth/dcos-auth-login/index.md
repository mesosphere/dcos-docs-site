---
layout: layout.pug
navigationTitle:  dcos auth login
title: dcos auth login
menuWeight: 2
excerpt: Log-in to your DC/OS cluster
enterprise: false
render: mustache
model: /1.14/data.yml
---

# Description

The `dcos auth login` command allows you to log in to the current cluster.

# Usage

```bash
dcos auth login [flags]
```

# Options

| Name |  Description |
|---------|-------------|-------------|
| `--help, h`   | Display usage. |
| `--password string`  |    Specify the password on the command line (insecure).|
| `--password-file string` | Specify the path to a file that contains the password.|
| `--private-key string` | Specify the path to a file that contains the service account private key. |
| `--provider string`  |   Specify the login provider to use.|
|  `--username string`  |   Specify the username for login. |
|


# Parent command

| Command | Description |
|---------|-------------|
| [dcos auth](/mesosphere/dcos/1.14/cli/command-reference/dcos-auth/) |  Manage DC/OS identity and access. |
