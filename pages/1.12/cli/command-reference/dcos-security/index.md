---
layout: layout.pug
navigationTitle:  dcos security
title: dcos security
menuWeight: 13
excerpt: Managing the DC/OS Certificate Authority

enterprise: true
---
The `dcos security` command allows you to manage your DC/OS certificate authority credentials.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `--version` | Print version information.  |
| `--info` |  Displays a short description of this subcommand.  |

# Commands

| Name |  Description |
|---------|-------------|
| `cluster` | Cluster management commands |
| `org` | Account management commands |
| `secrets` | Secrets management commands|



## dcos security secrets

```
Usage: dcos security secrets create [OPTIONS] PATH

  Create a secret.

  Store a secret under the path PATH.

Options:
  -s, --store-id TEXT        Secrets backend to use.
  -v, --value TEXT           Value of the secret.
  -f, --file FILENAME        Treat contents of the file as value of the secret.
                             The contents are assumed to be text encoded via
                             UTF-8.
  -h, --help                 Show this message and exit.
```

```
Usage: dcos security secrets create-sa-secret [OPTIONS] SA_PRIVATE_KEY SA_UID
                                         SECRET_PATH

  Create a service account secret.

  Create a secret that can be used by services running on top of DC/OS to
  login to service account.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  --strict             Use strict cluster configuration.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets delete [OPTIONS] PATH

  Delete a secret.

  Deletes a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets get [OPTIONS] PATH

  Get a secret from the store by its path.

  Get a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets list [OPTIONS] PATH

  List secret keys in a given path.

  Lists all secrets stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```

```
Usage: dcos security secrets update [OPTIONS] PATH

  Update a secret.

  Update an existing secret stored under the path PATH.

Options:
  -s, --store-id TEXT        Secrets backend to use.
  -v, --value TEXT           Value of the secret.
  -f, --file FILENAME        Treat contents of the file as value of the secret.
                             The contents are assumed to be text encoded via
                             UTF-8.
  -h, --help                 Show this message and exit.
```
