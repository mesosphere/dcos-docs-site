---
layout: layout.pug
navigationTitle:  License CLI
title: License CLI
menuWeight: 0
enterprise: true
excerpt: Using the command line interface to manage your DC/OS license
---

# Prerequisites
- A DC/OS Enterprise cluster.
- The [DC/OS CLI](/1.13/cli/install/) installed.
- The [DC/OS Enterprise CLI](/1.13/cli/plugins/#enterprise-cli-plugin) installed.


# List licenses

```
dcos license list
```

# Renew a license

At every update of license terms, you pass a new license to the DC/OS Licensing component.

```
dcos license renew <file-path>
```

# Get a license

To retrieve licenses, run

```
dcos license get [--decryption-key] [<id>|active]
```

You can specify an optional path where to store the license. Returns the active license by default. Takes an optional identifier to retrieve a specific license. The `--decryption-key` flag returns the license audit data entry checksum decryption key.

# Get license audit data

```
dcos license audit get [<id>|active]
```

You can specify an optional path where to store the audit data. Takes an optional identifier to retrieve the data generated for a specific license. If you want to decrypt the audit data, you can use the `dcos license get --decryption-key` command to retrieve the decryption key.

# Get license status

```
dcos license status [--terms] [--breaches]
```

Displays license terms and breaches. Optional flags can be used to filter the information.
