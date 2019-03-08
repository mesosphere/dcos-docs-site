---
layout: layout.pug
navigationTitle:  dcos job
title: dcos job
menuWeight: 8
excerpt: Deploying and managing jobs in DC/OS
enterprise: false
---


# Description
The `dcos job` commands allow you to deploy and manage jobs in DC/OS.

# Usage

```bash
dcos job
```

Output should resemble:

```
Usage:
        dcos job --config-schema
        dcos job --help
        dcos job --info
        dcos job --version
        dcos job add <job-file>
        dcos job remove <job-id> [--stop-current-job-runs]
        dcos job show <job-id>
        dcos job update <job-file>
        dcos job kill <job-id> [<run-id>][--all]
        dcos job run <job-id> [--json]
        dcos job list [--json|--quiet]
        dcos job schedule add <job-id> <schedule-file>
        dcos job schedule show <job-id> [--json]
        dcos job schedule remove <job-id> <schedule-id>
        dcos job schedule update <job-id> <schedule-file>
        dcos job show runs <job-id> [--run-id <run-id>][--json|--quiet]
        dcos job history <job-id> [--json|--quiet] [--failures --last]
```


# Options

| Name |  Description |
|---------|-------------|
| `--config-schema`   |  Show the configuration schema for the subcommand |
| `--help, h`   |   Displays usage |
| `--info`   |   Displays a short description of this subcommand |
| `--version, v`   |  Displays version information |