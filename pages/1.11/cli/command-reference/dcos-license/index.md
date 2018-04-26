---
layout: layout.pug
navigationTitle:  dcos license
title: dcos license
menuWeight: 9
excerpt: Display DC/OS license information
enterprise: true
---
The dcos license command lets you list, get, audit and retrieve the status of your DC/OS license.

```
dcos license
Usage:
  dcos license list [--output <file_path>]
  dcos license get [<id>|active] [--output <file_path>] [--decryption-key]
  dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
  dcos license status [--terms] [--breaches]
```
