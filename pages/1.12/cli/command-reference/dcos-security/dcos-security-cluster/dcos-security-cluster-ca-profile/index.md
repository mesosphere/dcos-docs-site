---
layout: layout.pug
navigationTitle:  dcos security cluster ca profile
title: dcos security cluster ca profile
menuWeight: 15
excerpt: Managing the DC/OS Certificate Authority
enterprise: true
---

# Description

The `dcos security cluster ca profile` command displays information about a signing profile. If no profile name is specified or the given profile does not exist, the default profile information is returned.


# Usage

```
dcos security cluster ca profile [OPTIONS]
```

# Options

| Name| Description|
|-------|------------|
| `-p`, `--profile <text>`|  Signing profile to fetch information about.|
| `-j`, `--json` | Output data in JSON format.|
| `-h`, `--help` | Show this message and exit.|


