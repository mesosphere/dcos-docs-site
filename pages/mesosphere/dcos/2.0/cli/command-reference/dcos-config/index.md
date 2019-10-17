---
layout: layout.pug
navigationTitle:  dcos config
title: dcos config
menuWeight: 4
excerpt: Managing the DC/OS configuration file
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# Description

The `dcos config` command manages the DC/OS configuration file that is created when you run [dcos cluster setup](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/dcos-cluster-setup/). The configuration file is located in `~/.dcos/clusters/<cluster_id>/dcos.toml`.

# Usage

```bash
  dcos config [command]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |



# Commands

