---
layout: layout.pug
navigationTitle:  dcos cluster link
title: dcos cluster link
menuWeight: 3
excerpt: Linking a connected cluster to another cluster
enterprise: true
---

# Description
You can configure uni-directional links from a cluster to one or more clusters. When accessing a cluster you can view the clusters linked to it. You can [attach](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-attach/) to a linked cluster without needing to run `dcos cluster setup` beforehand.

**Prerequisites**

- The [`dcos cluster setup`](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command used to set up the clusters to be linked must specify the same authentication provider. For example:

  ```
  dcos cluster setup <dcos-url-a> --provider=dcos-users
  dcos cluster setup <dcos-url-b> --provider=dcos-users
  ```

# Usage

```bash
dcos cluster link <dcos-url-a>
```

If the cluster links successfully there is no output to the console.

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|-------------|
| `<dcos-url-a>`   | A URL or IP address to an accessible master node. |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Links](/1.13/administering-clusters/multiple-clusters/cluster-links/).
