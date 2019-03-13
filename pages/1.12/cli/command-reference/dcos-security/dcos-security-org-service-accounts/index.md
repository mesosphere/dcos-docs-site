---
layout: layout.pug
navigationTitle:  dcos security org service-accounts
title: dcos security org service-accounts
menuWeight: 160
excerpt: Revoke permission for a group to act on a resource
enterprise: true
---
# Description

The `dcos security org service-accounts` command allows you to manage your security accounts.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `SID` | Service account ID. (Required)|

# Commands

| Name |  Description |
|---------|-------------|
|  `create` |  Create service account identified by SID.|
|`delete`   |Delete service account identified by SID.|
|  `keypair` | Create public-private keypair for use with service account|
|  `show`  |   Print details of a service account identified by SID.|

# Usage

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