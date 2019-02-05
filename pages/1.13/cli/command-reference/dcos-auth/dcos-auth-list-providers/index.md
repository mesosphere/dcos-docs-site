---
layout: layout.pug
navigationTitle:  dcos auth list-providers
title: dcos auth list-providers
menuWeight: 1
excerpt: Discovering configured authentication providers for your cluster

enterprise: true
---

# Description
This command lists configured authentication providers for your DC/OS cluster. For more information, see [Service Accounts](/1.13/security/ent/service-auth/).

# Usage

```bash
dcos auth list-providers <dcos-url> [OPTION]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--json`   | Specify a JSON-formatted list of authentication providers. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<dcos-url>`   |             | A URL or IP address to an accessible master node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos auth](/1.13/cli/command-reference/dcos-auth/) |  Manage DC/OS identity and access. |

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

For more information, see [Service Accounts](/1.13/security/ent/service-auth/).
