---
layout: layout.pug
navigationTitle:  dcos node diagnostics
title: dcos node diagnostics
menuWeight: 2
excerpt: Displaying the details of diagnostics bundles
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos node diagnostics` command allows you to view the details of diagnostics bundles.

# Usage

```bash
dcos node diagnostics (--list | --status | --cancel) [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `--cancel`   |  Cancel a running diagnostics job. |
| `--list`   |  List the available diagnostics bundles. |
| `--json`   |   Displays JSON-formatted data. |
| `--status`   |    Displays diagnostics job status. |
| `--help, h`   |   Displays usage. |


# Examples

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

# Parent command

| Command | Description |
|---------|-------------|
| [`dcos node`](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |

