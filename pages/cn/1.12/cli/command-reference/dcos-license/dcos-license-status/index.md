---
layout: layout.pug
navigationTitle:  dcos license status
title: dcos license status
menuWeight: 4
excerpt: 查看群集许可证状态

enterprise: true
---

# 说明
`dcos license status` 命令检索有效许可证条款和违规信息。命令默认输出为 `stdout`。

# 使用

```bash
dcos license status [OPTIONS]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--terms` | 筛选状态，确保仅打印有效许可证条款。 |
| `--breaches` | 筛选状态，确保仅打印有效许可证违规行为。 |
| `--help` | 显示此消息后退出。 |


# 示例

```json
dcos license status
{
  "current_timestamp": "2019-03-26T02:44:29.055698601Z",
  "end_timestamp": "2019-06-01T15:04:05Z",
  "id": "mesosphere-developer",
  "node_capacity": 300,
  "number_of_breaches": 0,
  "number_of_nodes": 1,
  "start_timestamp": "2018-12-01T15:04:05Z"
}

```
```
dcos license status --breaches
0
```
如需更多示例，请参阅 [许可证](/cn/1.12/administering-clusters/licenses/)。


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license](/cn/1.12/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |
