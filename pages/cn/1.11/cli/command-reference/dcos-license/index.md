---
layout: layout.pug
navigationTitle: dcos license
title: dcos license
excerpt: 使用 DC/OS 许可证
menuWeight: 9
enterprise: true
---
`dcos license` 命令让您查看许可证的状态、审核您的许可证以及获取或更新许可证。

```
dcos license
Usage:
  dcos license list [--output <file_path>]
  dcos license get [<id>|active] [--output <file_path>] [--decryption-key]
  dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
  dcos license status [--terms] [--breaches]
  dcos license renew [OPTIONS] PATH
```
