---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_user
title: dcos security cluster directory import_user
menuWeight: 35
excerpt: Importing a user from an LDAP backend
enterprise: true
---
# Description

The `dcos security cluster directory import_user` command imports a user from the configured directory (LDAP) backend.

# Options

| Name | Description |
|----------|---------|
| `-h`, `--help` |  Show this message and exit.|

# Usage

```
Usage: dcos security cluster directory import_user [OPTIONS] UID

Import an LDAP user.

Attempt to import a user from the configured directory (LDAP) backend.

Options:
-h, --help  Show this message and exit.
```