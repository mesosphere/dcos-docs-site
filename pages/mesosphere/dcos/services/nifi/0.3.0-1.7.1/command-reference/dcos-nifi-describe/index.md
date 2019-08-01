---
layout: layout.pug
navigationTitle:  dcos nifi describe
title: dcos nifi describe
menuWeight: 63
excerpt: View full configuration of the NiFi service.
featureMaturity:
enterprise: false
model: ../../../data.yml
render: mustache
---

# Description
The `dcos nifi describe` command displays full configuration of the NiFi service.


# Usage

```bash
dcos nifi describe [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
