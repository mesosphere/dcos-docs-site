---
layout: layout.pug
navigationTitle:  dcos auth list-providers
title: dcos auth list-providers
menuWeight: 1
excerpt: Listing login providers for a cluster
enterprise: true
render: mustache
model: /1.14/data.yml
---

# Description

The `dcos auth list-providers` command lists available login providers for a cluster.

# Usage

```bash
dcos auth list-providers <url> [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--json`   | Returns a list of providers in JSON format. |
| `-h`, `--help` | Displays help for list providers. |

## Positional Arguments

| Name | Description |
|---------|-------------|
| `<url>`  |    |

# Example

In this example, the available DC/OS authentication providers are listed.

```bash
dcos auth list-providers
```

The output should resemble:

```bash
PROVIDER ID    AUTHENTICATION TYPE
dcos-services  Authenticate using a DC/OS service user account (using username and private key)
dcos-users     Authenticate using a standard DC/OS user account (using username and password)
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos auth](/mesosphere/dcos/1.14/cli/command-reference/dcos-auth/) |  Manage DC/OS identity and access. |
