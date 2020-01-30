---
layout: layout.pug
navigationTitle:  dcos security org users create
title: dcos security org users create
menuWeight: 190
excerpt: Creating new users
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---

# Description

The `dcos security org users create` command allows you to create new users and assign a User ID (UID) to them.

# Usage

```bash
Usage: dcos security org users create [OPTIONS] UID

  Create a new user.

Options:
  -d, --description TEXT  Description.
  -p, --password TEXT     Password.
  -h, --help              Show this message and exit.
```

# Options
 
| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
|  `-d`, `--description` <text> | Description. |
|  `-p`, `--password` <text>   |  Password. |
| `UID` | User ID. (Required)|