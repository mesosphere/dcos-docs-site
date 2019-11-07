---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 3
excerpt: 取消另一个群集对一个群集的链接
enterprise: true
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---

# 说明
`dcos cluster unlink` 命令将从其链接的一个群集中取消链接当前群集。

# 使用

```bash
dcos cluster unlink <cluster> [flags]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示此命令的帮助。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<name>` | 链接的群集名称（必填）|

如果成功取消群集链接，则控制台没有输出信息。


# 示例
有关示例，请参阅 [群集链接](/mesosphere/dcos/1.13/administering-clusters/multiple-clusters/cluster-links/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/mesosphere/dcos/1.13/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |
