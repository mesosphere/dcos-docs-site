---
layout: layout.pug
navigationTitle:  dcos security org service-accounts create
title: dcos security org service-accounts create
menuWeight: 165
excerpt: Creating a service account
enterprise: true
---

# Description

The `dcos security org service-accounts create` command allows you to create a service account and give it a Service Account ID (SID). Be aware that the `--public-key` and `--secret` options are mutually exclusive.

# Options

| Name |  Description |
|---------|-------------|
| `-p`, `--public-key` <filename> | Path to public key to use; `-` reads from STDIN |
|  `-s`, `--secret <text>`   |       Passphrase to use. |
|  `-d`, `--description <text>`   |  Description of the newly created service account. ID of the account is used by default. |
|  `-h`, `--help` |  Show this message and exit.|
| `SID` | Service account ID. (Required)|

# Usage

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