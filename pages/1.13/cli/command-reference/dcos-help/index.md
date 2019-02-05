---
layout: layout.pug
navigationTitle:  dcos help
title: dcos help
menuWeight: 7
excerpt: Displaying DC/OS CLI help information

enterprise: false
---

# Description
The `dcos help` command will display DC/OS CLI help information.

# Usage

```bash
dcos help <subcommand>
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--info`   |   Display a short description of this subcommand. |
| `--version, v`   |  Display version information. |
| `<subcommand>`   | The subcommand name. |

# Examples

## Display help for dcos config command

The `dcos help config` command is the same as [`dcos config --help`](/1.13/cli/command-reference/dcos-config/).

```bash
dcos help config
Description:
    Manage the DC/OS configuration file.

Usage:
    dcos config --help
    dcos config --info
    dcos config set <name> <value>
    dcos config show [<name>]
    dcos config unset <name>
    dcos config validate

Commands:
    set
        Add or set a DC/OS configuration property.
    show
        Display the DC/OS configuration file contents.
    unset
        Remove a property from the configuration file.
    validate
        Validate changes to the configuration file.

Options:
    -h, --help
        Display usage.
    --info
        Display a short description of this subcommand.
    --version
        Display version information.

Positional Arguments:
    <name>
        The name of the property.
    <value>
        The value of the property.

Environment Variables:
    Configuration properties all have corresponding environment variables. If a
    property is in the "core" section (ex. "core.foo"), it corresponds to
    environment variable DCOS_FOO. All other properties (ex "foo.bar")
    correspond to enviroment variable DCOS_FOO_BAR.

    Environment variables take precendence over corresponding configuration
    property.
```
