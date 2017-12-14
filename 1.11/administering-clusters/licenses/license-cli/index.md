---
layout: layout.pug
navigationTitle:  License CLI
title: License CLI
menuWeight: 3
enterprise: true
---

# Prerequisites
- A DC/OS Enterprise cluster.
- The [DC/OS CLI](/1.11/cli/install/) installed.
- The [DC/OS Enterprise CLI](/1.11/cli/enterprise-cli/) installed.


# List licenses

```
dcos license list [--output <file-path>]
```

# Renew a license

At every update of license terms, you pass a new license to the DC/OS Licensing component.

```
dcos license renew --filename <file-path>
```

# Get a license

To retrieve licenses, run

```
dcos license get [<license-id>] [--output <file-path>] [--decryption-key]
```

You can specify an optional path to where to store the license. Returns active license by default. Takes an optional identifier to retrieve a specific license. The `--decryption-key` flag returns the license audit data entry checksum decryption key.

# Get license audit data

```
dcos license audit get [<license-id>] [--output <file-path>] [--decrypt]
```

You can specify an optional path to where to store the audit data. Takes optional identifier to retrieve the data generated for a specific license and can return a completely decrypted response with the `--decrypt` flag. If you return the audit data without decrypting, you can use the `dcos license get --decryption-key` command to retrieve the decryption key and manually decrypt the data.

# Get license status

```
dcos license status [--terms] [--breaches]
```

Print license terms and breaches. Optional flags can be used to filter the information.
