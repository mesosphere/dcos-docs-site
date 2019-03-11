---
layout: layout.pug
navigationTitle:  dcos security cluster directory 
title: dcos security cluster directory
menuWeight: 30
excerpt: Managing LDAP related settings 
enterprise: true
---

# Description

The `dcos security cluster directory` command lets you import, test and retrieve LDAP configurations.

# Options

| Name | Description |
|------|-------------------|
| `-h`, `--help` | Show this message and exit.|
|  `-j`, `--json` | Output data in JSON format.|

# Commands

| Name | Description |
|------|-------------------|
| `get_config` |    Retrieve current LDAP configuration.|
|  `import_group` |  Import an LDAP group.|  
| `import_user`  | Import an LDAP user.|
|  `test`  |        Test connection to the LDAP backend.|



