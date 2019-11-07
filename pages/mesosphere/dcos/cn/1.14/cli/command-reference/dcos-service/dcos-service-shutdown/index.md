---
layout: layout.pug
navigationTitle:  dcos service shutdown
title: dcos service shutdown
menuWeight: 2
excerpt: 关闭服务
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
enterprise: false
---


# 说明
`dcos service shutdown` 命令允许您关闭服务。

# 使用

```bash
dcos service shutdown <service-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help`  | 打印使用情况。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<service-id>` | DC/OS 服务 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos service](/mesosphere/dcos/1.14/cli/command-reference/dcos-service/) | 管理 DC/OS 服务。|
