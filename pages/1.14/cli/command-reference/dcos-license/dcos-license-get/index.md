---
layout: layout.pug
navigationTitle:  dcos license get
title: dcos license get
menuWeight: 2
excerpt: Displaying the cluster licenses
enterprise: true
---

# Description
The `dcos license get` command retrieves a specific license associated with this cluster. When no LICENSE_ID is passed, the current license is returned. This command outputs to `stdout` by default.


# Usage

```bash
 dcos license get [OPTIONS] [LICENSE_ID]
 ```

# Options

| Name |  Description |
|-------------------|-------------------|
| `--help`   |    Show this message and exit. |
| `--decryption-key`   |  Get the key to decrypt license audit records. |

## Positional Arguments

| Name |  Description |
|-------------------|-------------------|
| `LICENSE_ID` | ID of license to be retrieved. If no `LICENSE_ID` parameter is passed, the current license will be retrieved. |

# Examples

```json
dcos license get
{
  "decryption_key": "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMTUWJbWO4rWDe2Vg8DEW7B9AA\n3PWBT/j/mDEoSmqr3Tsh1hA38nxTjdEV5B1xljSZxOfVQ/7It1lqA6qgdDfNA1UC\nwOunuy3JIApql5n/OD2JGQQxaLYiS+c2nQS0rLUh6mQ0KvBCMSBtbXfYd6hBzy4Y\nOZEQ9UPaI1eF45yOtQIDAQAB\n-----END PUBLIC KEY-----\n",
  "id": "mesosphere-developer",
  "license_terms": {
    "end_timestamp": "2019-06-01T15:04:05Z",
    "node_capacity": 300,
    "start_timestamp": "2018-12-01T15:04:05Z"
  },
  "version": "1.13"
}
```

```bash
 dcos license get --decryption-key
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMTUWJbWO4rWDe2Vg8DEW7B9AA
3PWBT/j/mDEoSmqr3Tsh1hA38nxTjdEV5B1xljSZxOfVQ/7It1lqA6qgdDfNA1UC
wOunuy3JIApql5n/OD2JGQQxaLYiS+c2nQS0rLUh6mQ0KvBCMSBtbXfYd6hBzy4Y
OZEQ9UPaI1eF45yOtQIDAQAB
-----END PUBLIC KEY-----
```

For more examples, see [Licenses](/1.13/administering-clusters/licenses/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |
