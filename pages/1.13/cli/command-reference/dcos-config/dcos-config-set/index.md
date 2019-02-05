---
layout: layout.pug
navigationTitle:  dcos config set
title: dcos config set
menuWeight: 1
excerpt: Adding or setting DC/OS configuration properties

enterprise: false
---

# Description

The `dcos config set` command will add or set DC/OS configuration properties. Table 1 show the available properties.

*Table 1 - `dcos config set` properties*

| **Property**  | **Description** |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `core.dcos_acs_token`   | The DC/OS authentication token. When you log into the DC/OS CLI using `dcos auth login`, it stores the authentication token value locally. For more information, see [the IAM API](/1.13/security/oss/iam-api/). |
| `core.dcos_url`         | The public master URL of your DC/OS cluster.|
| `core.mesos_master_url` | The Mesos master URL. Defaults to `core.dcos_url`. |
| `core.pagination`       | Indicates whether to paginate output. Defaults to true.|
| `core.ssl_verify`       | Indicates whether to verify SSL certificates or set the path to the SSL certificates.|
| `core.timeout`          | The request timeout in seconds, with a minimum value of 1 second. Defaults to 3 minutes.|

# Usage

```bash
dcos config set <name> <value> [OPTION]
```

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<name>`   |  The name of the property. |
| `<value>`   |   The value of the property. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.13/cli/command-reference/dcos-config/) |  Manage DC/OS configuration. |


# Examples

## Set request timeout

In this example, the request timeout is set to five minutes.

```bash
dcos config set core.timeout 300
```

Here is the output:

```bash
[core.timeout]: set to '300'
```

## Set SSL setting

In this example, verification of SSL certificates for HTTPS is set to `true`.

```bash
dcos config set core.ssl_verify true
```

Here is the output:

```bash
[core.ssl_verify]: set to 'true'
```
