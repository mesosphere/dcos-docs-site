---
layout: layout.pug
navigationTitle:  dcos cluster remove
title: dcos cluster remove
menuWeight: 4
excerpt: Removing a connected cluster from the DC/OS CLI
enterprise: false
---

# Description
The `dcos-cluster remove` command will remove a configured cluster from the DC/OS CLI. Either a cluster name or one of the `--all` / `--unavailable` options must be passed.

# Usage

```bash
  dcos cluster remove <cluster> [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--all`    |  Remove all clusters. |
|  `-h`, `--help`   | Help for `remove` command. |
| ` --unavailable`  | Remove unavailable clusters. |


## Positional arguments

| Name | Description |
|---------|-------------|
| `<name>`   | Name of the cluster |


# Examples

1. Run the `dcos cluster list` command to get the name of the cluster you want to remove:

    ```
    dcos cluster list
              NAME                          ID                     STATUS     VERSION                                         URL                                          
        user_81-rd373u5  bb07074e-2c3d-4dc5-8523-75cab9d517cb  UNAVAILABLE  UNKNOWN  http://user_81-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com        
    *  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com  
    ```

1. Run the `dcos cluster remove` command with the name of the cluster you want to remove. In this example, we are removing the cluster named "user_81-rd373u5":

    ```
    dcos cluster remove user_81-rd373u5
    ```
    If the command completes successfully, there will be no confirmation message. 

1. To confirm that the cluster has been removed, run `dcos cluster list` again:

    ```
    dcos cluster list
            NAME                        ID                    STATUS    VERSION                                         URL                                          
    *  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com
    ```


For more examples, see [Cluster Connections](/1.12/administering-clusters/multiple-clusters/cluster-connections/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | Manage your DC/OS clusters 