---
layout: layout.pug
navigationTitle:  dcos cluster link
title: dcos cluster link
menuWeight: 3
excerpt: Linking a connected cluster to another cluster
enterprise: true
render: mustache
model: /1.13/data.yml
---

# Description
The `dcos cluster link` command lets you configure uni-directional links from a cluster to one or more clusters. When accessing a cluster you can view the clusters linked to it. You can [attach](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-attach/) to a linked cluster without needing to run `dcos cluster setup` beforehand.

**Prerequisites**

- The [`dcos cluster setup`](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command you used to set up the clusters to be linked must specify the same authentication provider.


# Usage

```bash
dcos cluster link <cluster> [flags]
```

If the cluster links successfully there is no output to the console.

# Options

| Name | Description |
|---------|-------------|
| `--ca-certs string`  |      Specify the path to a file with trusted CAs to verify requests against.|
|  `-h`, `--help`  | Displays help for link. |
| `--insecure` |  Allow requests to bypass TLS certificate verification (insecure). |
| `--name string`    |  Specify a custom name for the cluster. |
|  `--no-check`  |  Do not check CA certficate downloaded from cluster (insecure). Applies to Enterprise DC/OS only. [enterprise type="inline" size="small" /]|
|  `--password string`   |     Specify the password on the command line (insecure).|
| `--password-file string`  | Specify the path to a file that contains the password. |
| `--private-key string`   |  Specify the path to a file that contains the service acc`ount private key. |
|  `--provider string`    |    Specify the login provider to use. |
|  `--username string`    |    Specify the username for login. |

## Positional Arguments

| Name | Description |
|---------|-------------|
| `<cluster>`   | A URL or IP address to an accessible master node. (Required)|



# Examples
For examples, see [Cluster Links](/1.13/administering-clusters/multiple-clusters/cluster-links/).



# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |
