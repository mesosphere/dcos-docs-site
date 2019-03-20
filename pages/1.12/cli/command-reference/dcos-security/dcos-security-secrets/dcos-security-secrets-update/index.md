---
layout: layout.pug
navigationTitle:  dcos security secrets update
title: dcos security secrets update
menuWeight: 320
excerpt: Updating secrets
enterprise: true
---

# Description
 
The `dcos security secrets update` command lets you update an existing secret stored in a specified path.

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|`-v`, `--value <text>`       |    Value of the secret.|
| `-t`, `--text-file`, `--value-file <filename>` | Treat contents of the file as value of the secret. The contents are assumed to be text encoded via UTF-8. |
|  `-f`, `--file <filename>`     |        Use the raw file contents as the value of the secret: pass the unmodified byte sequence to DC/OS Secrets service. |
|  `-h`, `--help`        |   Show this message and exit. |
| `PATH` | Secrets path. |



# Usage
 
 ```
 Usage: dcos security secrets update [OPTIONS] PATH

  Update a secret.

  Update an existing secret stored under the path PATH.

Options:
  -s, --store-id TEXT             Secrets backend to use.
  -v, --value TEXT                Value of the secret.
  -t, --text-file, --value-file FILENAME
                                  Treat contents of the file as value of the
                                  secret. The contents are assumed to be text
                                  encoded via UTF-8.
  -f, --file FILENAME             Use the raw file contents as the value of
                                  the secret: pass the unmodified byte
                                  sequence to DC/OS Secrets service.
  -h, --help                      Show this message and exit.
```
