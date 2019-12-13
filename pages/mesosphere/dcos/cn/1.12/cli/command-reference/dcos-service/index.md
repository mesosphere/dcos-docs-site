---
layout: layout.pug
navigationTitle:  dcos service
title: dcos service
menuWeight: 14
excerpt: 管理 DC/OS 服务

enterprise: false
---

# 说明

`dcos service` 命令让您管理 DC/OS 服务。

# 使用

```bash
dcos service [OPTION]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--completed` | 显示已完成和活动的服务。已完成的服务已与主服务器断开连接并已达到故障切换超时时间或已经通过 `/shutdown` 端点显式关闭。|
| `--help, h` | 显示用法。 |
| `--inactive` | 显示非活动和活动的服务。非活动服务已与管理节点断开连接，但尚未达到故障切换超时时间。|
| `--info` | 显示该子命令的简短描述。|
| `--json` | JSON 格式的数据。|
| `--version, v` | 显示版本信息。|


# 命令

