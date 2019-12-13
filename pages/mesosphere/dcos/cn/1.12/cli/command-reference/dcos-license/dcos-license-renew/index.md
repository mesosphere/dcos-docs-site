---
layout: layout.pug
navigationTitle:  dcos license renew
title: dcos license renew
menuWeight: 3
excerpt: 更新群集许可证

enterprise: true
---

# 说明
`dcos license renew` 命令将新的 DC/OS 许可证与群集关联，并使其处于有效状态。此命令在给定的 PATH 中使用许可证。

# 使用

```bash
Usage: dcos license renew [OPTIONS] PATH
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PATH` | 包含许可证的文件的路径。|



# 示例
有关示例，请参阅[许可证](/mesosphere/dcos/cn/1.12/administering-clusters/licenses/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |
