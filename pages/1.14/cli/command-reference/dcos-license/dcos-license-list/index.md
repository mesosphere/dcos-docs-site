---
layout: layout.pug
navigationTitle:  dcos license list
title: dcos license list
menuWeight: 3
excerpt: Displaying the cluster licenses
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description
The `dcos license list` command will list all licenses associated with a cluster. By default, this command outputs to `stdout`.

# Usage

```bash
dcos license list [OPTIONS]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |   Show this message and exit.|

# Examples

```json
dcos license list
[
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
]
```

For more examples, see [Licenses](/1.14/administering-clusters/licenses/).


# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.14/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

