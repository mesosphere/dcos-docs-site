---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 3
excerpt: 取消另一个群集对一个群集的链接
enterprise: true
---

# 说明
`dcos cluster unlink` 命令将取消链接已连接群集中的一个当前群集。

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
有关示例，请参阅 [群集链接](/mesosphere/dcos/cn/1.12/administering-clusters/multiple-clusters/cluster-links/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |
