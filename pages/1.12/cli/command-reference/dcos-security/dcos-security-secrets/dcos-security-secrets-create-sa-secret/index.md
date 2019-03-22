---
layout: layout.pug
navigationTitle:  dcos security secrets create-sa-secret
title: dcos security secrets create-sa-secret
menuWeight: 305
excerpt: Creating and storing a secret
enterprise: true
---

# Description

The `dcos security secrets create-sa-secret` command allows you to create a service account secret, or create one that can be used by services running on top of DC/OS to log in to a service account.


# Options

| Name |  Description |
|---------|-------------|
| `-s`,` --store-id <text>` | Secrets backend to use.|
|  `--strict `    |        Enforce secure cluster communication.|
|  `-h`, `--help`    |       Show this message and exit.|
|  `SA_PRIVATE_KEY` | Private key that belongs to service account. |
|  `SA_UID` | Service account user ID. |
|  `SECRET_PATH` | Secret path allows you to restrict which services can retrieve the value. |

# Usage 

```
Usage: dcos security secrets create-sa-secret [OPTIONS] SA_PRIVATE_KEY SA_UID
                                              SECRET_PATH

  Create a service account secret.

  Create a secret that can be used by services running on top of DC/OS to log in to service account.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  --strict             Enforce secure cluster communication.
  -h, --help           Show this message and exit.

```