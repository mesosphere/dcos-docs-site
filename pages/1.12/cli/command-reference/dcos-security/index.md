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




```
Usage: dcos security org service-accounts [OPTIONS] COMMAND [ARGS]...

  Service accounts manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  create   Create service account identified by SID.
  delete   Delete service account identified by SID.
  keypair  Create public-private keypair for use with...
  show     Print details of a service account identified...
```

```
Usage: dcos security org service-accounts create [OPTIONS] SID

  Create service account identified by SID.

  '--public-key' and '--secret' options are mutually exclusive.

Options:
  -p, --public-key FILENAME  Path to public key to use, '-' reads from STDIN
  -s, --secret TEXT          Passphrase to use.
  -d, --description TEXT     Description of the newly created service account.
                             ID of the account is used by default.
  -h, --help                 Show this message and exit.
```

```
Usage: dcos security org service-accounts delete [OPTIONS] SID

  Delete service account identified by SID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org service-accounts keypair [OPTIONS] PRIVATE_KEY PUBLIC_KEY

  Create public-private keypair for use with service accounts.

Options:
  -l, --key-length [2048|4096]  Length of the RSA key.
  -h, --help                    Show this message and exit.
```

```
Usage: dcos security org service-accounts show [OPTIONS] [SIDS]...

  Print details of a service account identified by SID.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org users [OPTIONS] COMMAND [ARGS]...

  Users manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  create  Create a new user.
  delete  Delete user identified by UID.
  grant   Grant the user with the given UID permission...
  revoke  Revoke permission for the user with the given...
  show    Print information about a user or users.
```

```
Usage: dcos security org users create [OPTIONS] UID

  Create a new user.

Options:
  -d, --description TEXT  Description.
  -p, --password TEXT     Password.
  -h, --help              Show this message and exit.
```

```
Usage: dcos security org users delete [OPTIONS] UID

  Delete user identified by UID.

Options:
  -h, --help  Show this message and exit.
```

```
Usage: dcos security org users show [OPTIONS] [UIDS]...

  Print information about a user or users.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```

```
Usage: security org users grant [OPTIONS] UID RID ACTION

  Grant the user with the given UID permission to enact a given ACTION on the
  resource with the given RID.

Options:
  --description TEXT  The description of the ACL with the given RID. If an ACL
                      exists with the given RID then the description will not be
                      overwritten. Default: "Created with the security CLI".
  -h, --help          Show this message and exit.
```

```
Usage: security org users revoke [OPTIONS] UID RID ACTION

  Revoke permission for the user with the given UID to enact a given ACTION on
  the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```

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
