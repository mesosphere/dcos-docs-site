---
layout: layout.pug
navigationTitle: dcos marathon app update
title: dcos marathon app update
menuWeight: 9
excerpt: 添加应用程序

enterprise: false
---

# 说明
`command dcos marathon app add` 让您添加应用程序。

# 使用

```bash
dcos marathon app update <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |  应用程序ID。 您可以使用以下命令查看应用程序ID列表 `dcos marathon group list` 命令。|
| `<properties>`   |  一个或多个JSON对象属性的列表，以空格分隔。 列表必须格式化为 `<key>=<value>`. 例如, `cpus=2,0 mem=308`。如果遗漏了，则从 stdin 上提供的 JSON 对象读取属性。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

# 示例

有关示例，请参阅[文档](/mesosphere/dcos/cn/1.11/deploying-services/update-user-service/)。
