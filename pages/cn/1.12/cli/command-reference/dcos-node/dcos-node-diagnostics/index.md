---
layout: layout.pug
navigationTitle:  dcos node diagnostics
title: dcos node diagnostics
menuWeight: 2
excerpt: 显示诊断捆绑包的详细信息
enterprise: false
---


# 说明
`dcos node diagnostics` 命令让您可以查看诊断捆绑包的详细信息。

# 使用

```bash
dcos node diagnostics (--list | --status | --cancel) [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--cancel` | 取消正在运行的诊断工作。|
| `--list` | 列出可用的诊断捆绑包。|
| `--json` | 显示 JSON 格式的数据。|
| `--status` | 显示诊断工作状态。|
| `--help, h` | 显示用法。 |


# 示例

```bash
dcos node diagnostics --list
Available diagnostic bundles:
bundle-2019-03-18-1552932773.zip 213.2KiB
bundle-2019-03-18-1552932988.zip 239.3KiB
```

```bash
dcos node diagnostics --status
10.0.6.122
  command_exec_timeout_sec: 120
  diagnostics_bundle_dir: /var/lib/dcos/dcos-diagnostics/diag-bundles
  diagnostics_job_get_since_url_timeout_min: 8
  diagnostics_job_timeout_min: 720
  diagnostics_partition_disk_usage_percent: 0.1659509198286555
  errors: None
  is_running: False
  job_duration: 1.057296215s
  job_ended: 2019-03-18 18:12:54.64986437 +0000 UTC
  job_progress_percentage: 100
  job_started: 2019-03-18 18:12:53.592568425 +0000 UTC
  journald_logs_since_hours: 24h
  last_bundle_dir: /var/lib/dcos/dcos-diagnostics/diag-bundles/bundle-2019-03-18-1552932773.zip
  status: Diagnostics job successfully finished
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [`dcos node`](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

