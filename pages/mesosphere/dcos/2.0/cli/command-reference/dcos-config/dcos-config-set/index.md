---
layout: layout.pug
navigationTitle:  dcos config set
title: dcos config set
menuWeight: 1
excerpt: Adding or setting DC/OS configuration properties
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# Description

The `dcos config set` command will add or set a property in the configuration file used for the current cluster. Table 1 shows the available properties.

# Usage

```bash
dcos config set <name> <value> [flags]
```
# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<name>`   |  The name of the property |
| `<value>`   |   The value of the property |

### Table 1 - Properties


| Name  | Value |
|-----------------------|------------------------------------------------|
| `core.dcos_acs_token`   | The DC/OS authentication token. When you log into the DC/OS CLI using `dcos auth login`, it stores the authentication token value locally. For more information, see [the IAM API](/mesosphere/dcos/2.0/security/oss/iam-api/). |
| `core.dcos_url`         | The public master URL of your DC/OS cluster|
| `core.mesos_master_url` | The Mesos master URL. Defaults to `core.dcos_url` |
| `core.pagination`       | Indicates whether to paginate output. Defaults to true.|
| `core.ssl_verify`       | Indicates whether to verify SSL certificates or set the path to the SSL certificates|
| `core.timeout`          | The request timeout in seconds, with a minimum value of 1 second. Defaults to 3 minutes.|
| `core.ssh_user` | The user used when using `ssh` to connect to a node of your DC/OS cluster. Defaults to "core". |
| `core.ssh_proxy_ip`  | Whether to use a fixed ssh proxy host (Bastion) for node SSH access. |
|  `core.reporting` | Whether to report usage events to Mesosphere. |
| `core.prompt_login` | Whether to prompt the user to log in when token expired; otherwise automatically initiate login. |
| `cluster.name`   | Human readable name of cluster. |
| `job.url`   | Api URL for talking to the Metronome scheduler. |
| `job.service_name`   | The name of the metronome cluster. |
| `marathon.url`   | Base URL for talking to Marathon. It overwrites the value specified in `core.dcos_url`. |
| `package.cosmos_url` | Base URL for talking to Cosmos. It overwrites the value specified in `core.dcos_url`. |


# Examples

## Set request timeout

In this example, the request timeout is set to five minutes.

```bash
dcos config set core.timeout 300
```
If the command is successful, no confirmation will be displayed. To verify that the property was set, run `dcos config show`:


```bash
dcos config show
cluster.name user_13-3fwr25e
core.dcos_acs_token ********
core.dcos_url http://user_13-elasticl-1x5proho90v2b-1931064628.us-east-1.elb.amazonaws.com
core.timeout 300
```

## Set SSL setting

In this example, verification of SSL certificates for HTTPS is set to `true`.

```bash
dcos config set core.ssl_verify true
```
If the command is successful, no confirmation will be shown.

To verify that the property has been set, use `dcos config show`:

```bash
[core.ssl_verify]: set to 'true'
```


# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/mesosphere/dcos/2.0/cli/command-reference/dcos-config/) |  Manage DC/OS configuration |
