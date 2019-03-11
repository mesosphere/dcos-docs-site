---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_group
title: dcos security cluster directory import_group
menuWeight: 30
excerpt: Importing an LDAP group
enterprise: true
---

# Description

The `dcos security cluster directory import_group` command imports a group of users from the configured directory (LDAP) backend. See IAM documentation for details on group import.

# Options

| Name | Description |
|--------|-------------------|
| `-h`, `--help` |  Show this message and exit.|

# Usage


```
Usage: dcos security cluster directory import_user [OPTIONS] UID

Import an LDAP user.

Attempt to import a user from the configured directory (LDAP) backend.

Options:
-h, --help  Show this message and exit.
```