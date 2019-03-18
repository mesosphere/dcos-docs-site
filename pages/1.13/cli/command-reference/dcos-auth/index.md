---
layout: layout.pug
navigationTitle:  dcos auth
title: dcos auth
menuWeight: 1
excerpt: Managing DC/OS identity and access


enterprise: false
---

# Description
The `dcos auth` command manages DC/OS identity and access.

# Usage

```bash
dcos auth
```

# Options

| Name, shorthand | Description |
|---------|-------------|-------------|
| `--help, h`   | Display usage. |
| `--info`   |  Display a short description of this subcommand. |
| `--version, v`   | Display version information. |

# Child commands

| Command | Description |
|---------|-------------|
|[dcos auth list-providers](/1.13/cli/command-reference/dcos-auth/dcos-auth-list-providers/) | List configured authentication providers for your DC/OS cluster. |
| [dcos auth login](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/)   |   Log in to DC/OS authentication.  |
| [dcos auth logout](/1.13/cli/command-reference/dcos-auth/dcos-auth-logout/)   |  Log out of DC/OS authentication.  |
