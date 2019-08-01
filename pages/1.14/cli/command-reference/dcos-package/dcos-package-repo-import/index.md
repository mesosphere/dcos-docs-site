---
layout: layout.pug
navigationTitle:  dcos package repo import
title: dcos package repo import
menuWeight: 4
excerpt: Adding a package repository to DC/OS
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos package repo import` command lets you import a file containing a package repository identified by `<repo-file>`.

# Usage

```
dcos package repo import <repos-file>
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `<repo-file>` | A file containing package repositories, listed in the format of `dcos package list --json`.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/mesosphere/dcos/1.14/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
