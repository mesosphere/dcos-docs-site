---
layout: layout.pug
navigationTitle:  dcos cluster list
title: dcos cluster list
menuWeight: 3
excerpt: Listing connected clusters
enterprise: false
render: mustache
model: /1.14/data.yml
---

# Description
The `dcos-cluster list` command will list the clusters configured and the ones linked to the current cluster.

# Usage

```bash
dcos cluster list [flags]
```



# Options

| Name | Description |
|---------|-------------|
| `--attached`   | Returnes attached clusters only. |
| `--json`   |  Displays a JSON-formatted list. |
|  `-h`, `--help`  | Displays help for this command. |



# Examples

```
dcos cluster list
      NAME                    CLUSTER ID                  STATUS    VERSION           URL
MyCluster  00548eb6-9626-47d8-9076-d57b56752225  AVAILABLE    1.13    https://100.220.241.100
```

```
dcos cluster list --attached
          NAME                        ID                    STATUS    VERSION                                         URL
  *  user_45-wosq2gi  7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE  1.13.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com
```

```json
dcos cluster list --json
[
    {
        "attached": false,
        "cluster_id": "bb07074e-2c3d-4dc5-8523-75cab9d517cb",
        "name": "user_84-rd373u5",
        "status": "UNAVAILABLE",
        "url": "http://user_84-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com",
        "version": "UNKNOWN"
    },
    {
        "attached": true,
        "cluster_id": "7edd47b7-7f22-4bd5-b8a9-b53a204aafd3",
        "name": "user_45-wosq2gi",
        "status": "AVAILABLE",
        "url": "https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com",
        "version": "1.13.0"
    }
]
```

For more examples, see [Cluster Connections](/1.14/administering-clusters/multiple-clusters/cluster-connections/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.14/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |
