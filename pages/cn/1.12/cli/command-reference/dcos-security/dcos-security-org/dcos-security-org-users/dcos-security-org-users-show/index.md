---
layout: layout.pug
navigationTitle:  dcos security org users show
title: dcos security org users show
menuWeight: 210
excerpt: 显示用户信息
enterprise: true
---

# 说明

`dcos security org users show` 命令将显示一位或几位用户的信息。

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-j`, `--json` | JSON 格式的输出数据。|
| `UID` | 用户 ID。 |


# 使用

```
Usage: dcos security org users show [OPTIONS] [UIDS]...

  Print information about a user or users.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```