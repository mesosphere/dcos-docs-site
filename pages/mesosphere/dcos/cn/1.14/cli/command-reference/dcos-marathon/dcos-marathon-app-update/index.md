---
layout: layout.pug
navigationTitle:  dcos marathon app update
title: dcos marathon app update
menuWeight: 9
excerpt: 更新应用程序
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

# 说明

命令 `dcos marathon app update` 允许您更新指定应用程序。

# 使用

```bash
dcos marathon app update [--force] <app-id> [<properties>...]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--force` | 在更新期间禁用 Marathon 中的检查。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|
| `<properties>` | 一个或多个 JSON 对象属性的列表，以空格分开。列表必须格式化为 `<key>=<value>`。例如， `cpus=2.0 mem=308`。如果遗漏了，则从 `stdin` 上提供的 JSON 对象读取属性。|



# 示例

有关示例，请参阅[文档](/mesosphere/dcos/1.14/deploying-services/update-user-service/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
