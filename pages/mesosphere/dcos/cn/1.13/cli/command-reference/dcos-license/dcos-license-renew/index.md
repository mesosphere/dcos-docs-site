---
layout: layout.pug
navigationTitle:  dcos license renew
title: dcos license renew
menuWeight: 3
excerpt: 更新群集许可证
render: mustache
model：/mesosphere/dcos/1.13/data.yml
enterprise: true
---

# 说明
`dcos license renew` 命令将新的 DC/OS 许可证与群集关联，并使其处于有效状态。此命令在给定的 `PATH` 中使用许可证。

运行 `dcos license renew` 命令不需要重新启动任何运行的服务或影响任何当前有效负载。

# 使用

```bash
dcos license renew [OPTIONS] PATH
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PATH` | 指定包含要更新许可证的文件的路径。 |

# 示例
有关示例，请参阅[许可证](/mesosphere/dcos/1.13/administering-clusters/licenses/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license](../../dcos-license/) | 管理 DC/OS 群集许可证。 |
