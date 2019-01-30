---
layout: layout.pug
navigationTitle:  dcos auth login
title: dcos auth login
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Authenticate to DC/OS. The [dcos cluster setup](/1.10/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command also runs `dcos auth login`.

# Usage

```bash
dcos auth login [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
|  `--ca-certs=<ca-certs>` |             | [enterprise type="inline" size="small" /] The path to a list of trusted CAs to verify requests against.  |
|  `--insecure` |                        | Allow requests to bypass SSL certificate verification. Analogous to `dcos config set core.ssl_verify=False`|
|  `--no-check` |                        | [enterprise type="inline" size="small" /] Do not check the CA certificate downloaded from the cluster. This is insecure. |
|  `--password-env=<password_env>` |     | The name of an environment variable that contains the password for login. |
|  `--password-file=<password_file>`  |  | The path to a file that contains the password for login. |
|  `--password=<password>`  |            | The password for login. This is insecure.  |
|  `--private-key=<key_path>`  |         | The path to a file that contains the private key.  |
|  `--provider=<provider_id>`  |         | [enterprise type="inline" size="small" /] The authentication provider to use for login.  |
|  `--username=<username>`  |            | The username for login. |

## SSL options

If you do not specify one of the SSL options `--insecure`, `--no-check`, or `--ca-certs`, the CA certificate is downloaded from the cluster and a sha256 fingerprint of the certificate is presented to you for verification.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos auth](/1.10/cli/command-reference/dcos-auth/) |  Manage DC/OS identity and access. |

# Examples
