---
layout: layout.pug
navigationTitle:  dcos config
title: dcos config
menuWeight: 4
excerpt: Managing the DC/OS configuration file

enterprise: false
---

# Description

The `dcos config` command manages the DC/OS configuration file created when you run [dcos cluster setup](/1.12/cli/command-reference/dcos-cluster/dcos-cluster-setup/). The configuration file is located in `~/.dcos/clusters/<cluster_id>/dcos.toml`. If you have not changed any configuration properties, you should see this output when you run `dcos config show`:

    cluster.name <cluster_name>
    core.dcos_acs_token ********
    core.dcos_url <cluster_url>
    core.ssl_verify `true` or `false`

## Environment variables
Configuration properties have corresponding environment variables. If a property is in the `core` section (for example, `core.foo`), it corresponds to the environment variable `DCOS_FOO`. All other properties (for example,  `foo.bar`) correspond to the environment variable `DCOS_FOO_BAR`. Environment variables take precedence over corresponding configuration property.

# Usage

```bash
dcos config
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--info`   |  Display a short description of this subcommand. |
| `--version, v`   |  Display version information. |
