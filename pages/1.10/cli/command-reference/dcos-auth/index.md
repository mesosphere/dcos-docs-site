---
layout: layout.pug
navigationTitle:  dcos auth
title: dcos auth
menuWeight: 1
excerpt:

enterprise: false
---

# Description
This command manages DC/OS identity and access.

# Usage

```bash
dcos auth 
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |

# Child commands

| Command | Description |
|---------|-------------|
|[dcos auth list-providers](/1.10/cli/command-reference/dcos-auth/dcos-auth-list-providers/) | List configured authentication providers for your DC/OS cluster (Enterprise only). |  
| [dcos auth login](/1.10/cli/command-reference/dcos-auth/dcos-auth-login/)   |   Log in to DC/OS authentication.  |  
| [dcos auth logout](/1.10/cli/command-reference/dcos-auth/dcos-auth-logout/)   |  Log out of DC/OS authentication.  |  
