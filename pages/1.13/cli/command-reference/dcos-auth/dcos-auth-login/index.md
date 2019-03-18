---
layout: layout.pug
navigationTitle:  dcos auth login
title: dcos auth login
menuWeight: 2
excerpt: Authenticating to DC/OS

enterprise: false
---

# Description

This command allows you to authenticate to DC/OS. The [dcos cluster setup](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command also runs `dcos auth login`.

# Usage

```bash
dcos auth login [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
|  `--password-file=<password_file>`  |  | The path to a file that contains the password for login. |
|  `--password=<password>`  |            | Specify the password for login on the command line. This is insecure.  |
|  `--private-key=<key_path>`  |         | The path to a file that contains the private key.  |
|  `--provider=<provider_id>`  |         | [enterprise type="inline" size="small" /] The authentication provider to use for login.  |
|  `--username=<username>`  |            | The username for login. |

## TLS options

If you do not specify one of the SSL options `--insecure`, `--no-check`, or `--ca-certs`, the CA certificate is downloaded from the cluster and a `sha256` fingerprint of the certificate is presented to you for verification.

# Environment variables

## <a name="dcos-username"></a> `DCOS_USERNAME`

Specify the username for login. When set, the `--username` flag takes precedence over this environment variable.

## <a name="dcos-username"></a> `DCOS_PASSWORD`

Specify the password for login. When set, the password flags take precedence over this environment variable.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos auth](/1.13/cli/command-reference/dcos-auth/) |  Manage DC/OS identity and access. |
