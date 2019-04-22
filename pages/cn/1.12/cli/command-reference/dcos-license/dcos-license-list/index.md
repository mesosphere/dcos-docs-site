---
layout: layout.pug
navigationTitle:  dcos license list
title: dcos license list
menuWeight: 3
excerpt: 显示群集许可证

enterprise: true
---

# 说明
`dcos license list` 命令将列出与群集关联的所有许可证。此命令默认输出为 `stdout`。

# 使用

```bash
dcos license list [OPTIONS]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息并退出。|

# 示例

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
    "version": "1.12"
  }
]
```

如需更多示例，请参阅 [许可证](/cn/1.12/administering-clusters/licenses/)。


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license](/cn/1.12/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |

