---
layout: layout.pug
navigationTitle:  dcos nifi endpoints
title: dcos nifi endpoints
menuWeight: 64
excerpt: Display endpoints related informations of the NiFi service.
featureMaturity:
enterprise: false
model: ../../../data.yml
render: mustache
---

# Description
The `dcos nifi endpoints` command displays endpoints related of the NiFi service.


# Usage

```bash
dcos nifi endpoints <name> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
