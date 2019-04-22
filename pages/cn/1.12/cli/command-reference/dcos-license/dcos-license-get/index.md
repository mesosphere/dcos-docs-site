---
layout: layout.pug
navigationTitle:  dcos license get
title: dcos license get
menuWeight: 2
excerpt: 显示群集许可证
enterprise: true
---

# 说明
`dcos license get` 命令检索与此群集关联的特定许可证。如果未传递 License_ID，则返回当前许可证。此命令默认输出为 `stdout`。


# 使用

```bash
 dcos license get [OPTIONS] [LICENSE_ID]
 ```

# 选项

| 名称 | 说明 |
|-------------------|-------------------|
| `--help` | 显示此消息后退出。 |
|  `--decryption-key` | 获取解密许可证审计记录的密钥。 |

## 位置自变量

| 名称 | 说明 |
|-------------------|-------------------|
| `LICENSE_ID` | 要检索的许可证的 ID。如果未传递 `LICENSE_ID` 参数，将检索当前许可证。 |

# 示例

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
  "version": "1.12"
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

如需更多示例，请参阅 [许可证](/cn/1.12/administering-clusters/licenses/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license](/cn/1.12/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |
