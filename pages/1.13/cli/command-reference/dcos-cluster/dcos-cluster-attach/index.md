---
layout: layout.pug
navigationTitle:  dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt: Attaching the CLI to a connected or linked cluster
enterprise: false
render: mustache
model: /1.13/data.yml
---

# Description
The `dcos cluster attach` command will attach the CLI to a connected or [linked](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-link/) cluster. When you run the [`dcos cluster setup`](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command, the cluster is automatically attached.

# Usage

```bash
dcos cluster attach <cluster> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |  Display usage. |

## Positional arguments

| Name | Description |
|---------|-------------|
| `<cluster>`   | ID of cluster (required) |



# Examples

```
dcos cluster list
        NAME                          ID                     STATUS     VERSION                                         URL
    user_81-rd373u5  bb07074e-2c3d-4dc5-8523-75cab9d517cb  UNAVAILABLE  UNKNOWN  http://user_81-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com
*  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.13.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com
```


For more examples, see [Cluster Connections](/1.13/administering-clusters/multiple-clusters/cluster-connections/) and [Cluster Links](/1.13/administering-clusters/multiple-clusters/cluster-links/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage connections to DC/OS clusters |
