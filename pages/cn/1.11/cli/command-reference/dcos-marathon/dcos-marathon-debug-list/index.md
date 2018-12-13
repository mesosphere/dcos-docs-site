---
layout: layout.pug
navigationTitle: dcos marathon debug list
title: dcos marathon debug list
menuWeight: 12
excerpt: 显示 Marathon 应用程序部署的当前队列

enterprise: false
---



# 说明
`dcos marathon debug list` 命令显示正在等待的 Marathon 应用程序部署的当前队列。

# 使用

```bash
dcos marathon debug list [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

有关此命令的更多信息，请参阅[监控部分](https://docs.mesosphere.com/1.11/monitoring/debugging/cli-debugging/#dcos-marathon-debug-list)。
