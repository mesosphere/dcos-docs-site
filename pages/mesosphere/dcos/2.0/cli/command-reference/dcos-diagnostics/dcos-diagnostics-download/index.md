---
layout: layout.pug
navigationTitle:  dcos diagnostics download
title: dcos diagnostics download
menuWeight: 5
excerpt: Downloading a diagnostics bundle
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---



# Description
The `dcos diagnostics download` command allows you to download the diagnostics bundle to a specific location.

# Usage

```bash
dcos diagnostics download <bundle-id> [flags]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--help, -h`   |   |  Displays usage. |
| `--output=<location>`   |  ./<bundle-id>.zip |  Download the diagnostics bundle to a specific location. If not set, the default location is your current working directory. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<bundle-id>`   |  The bundle ID. For example, `a697769a-2d5d-4b2a-a2ec-055b9fe9eecf`. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos diagnostics](/mesosphere/dcos/2.0/cli/command-reference/dcos-diagnostics/) | Handling DC/OS diagnostics bundles |

