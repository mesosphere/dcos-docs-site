---
layout: layout.pug
navigationTitle:  dcos config
title: dcos config
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
This command manages the DC/OS configuration file created when you run [dcos cluster setup](/1.10/cli/command-reference/dcos-cluster/dcos-cluster-setup/). The configuration file is located in `~/.dcos/clusters/<cluster_id>/dcos.toml`. If you have not changed any configuration properties, you should see this output when you run `dcos config show`:

    cluster.name <cluster_name>
    core.dcos_acs_token ********
    core.dcos_url <cluster_url>
    core.ssl_verify `true` or `false`


## Environment variables
Configuration properties have corresponding environment variables. If a property is in the `core` section (ex. `core.foo`), it corresponds to the environment variable `DCOS_FOO`. All other properties (ex. `foo.bar`) correspond to the environment variable `DCOS_FOO_BAR`.

Environment variables take precedence over corresponding configuration property.

# Usage

```bash
dcos config
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |

# Child commands

| Command | Description |
|---------|-------------|
| [dcos config set](/1.10/cli/command-reference/dcos-config/dcos-config-set/)   | Add or set a DC/OS configuration property. |
| [dcos config show](/1.10/cli/command-reference/dcos-config/dcos-config-show/)    | Print the DC/OS configuration file contents. |
| [dcos config unset](/1.10/cli/command-reference/dcos-config/dcos-config-unset/)    | Remove a property from the configuration file. |
| [dcos config validate](/1.10/cli/command-reference/dcos-config/dcos-config-validate/)    | Validate changes to the configuration file. |
