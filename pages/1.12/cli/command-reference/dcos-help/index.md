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
Output of `dcos help` (without options) should look like this:

```
Description:
The Mesosphere Datacenter Operating System (DC/OS) spans all of the machines in
your datacenter or cloud and treats them as a single, shared set of resources.

Usage:
    dcos [options] [<command>] [<args>...]

Options:
    --debug
        Enable debug mode.
    --help
        Print usage.
    --log-level=<log-level>
        Set the logging level. This setting does not affect the output sent to
        stdout. The severity levels are:
        The severity level:
        * debug    Prints all messages.
        * info     Prints informational, warning, error, and critical messages.
        * warning  Prints warning, error, and critical messages.
        * error    Prints error and critical messages.
        * critical Prints only critical messages to stderr.
    --version
        Print version information

Environment Variables:
    DCOS_CONFIG
        Set the path to the DC/OS configuration file. By default, this variable
        is set to $DCOS_DIR/dcos.toml.
    DCOS_DEBUG
        Indicates whether to print additional debug messages to stdout. By
        default this is set to false.
    DCOS_DIR
        Set the data directory for DC/OS configuration. By default, this
        variable is set to ~/.dcos
    DCOS_LOG_LEVEL
        Prints log messages to stderr at or above the level indicated. This is
        equivalent to the --log-level command-line option.
```

The Mesosphere Datacenter Operating System (DC/OS) spans all of the machines in your datacenter or cloud and treats them as a single, shared set of resources.


# Options


| Name, shorthand |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--info`   |   Display a short description of this subcommand. |
| `--version, v`   |  Display version information. |
| `<command>`   | The subcommand name. |

## Subcommands


| Name | Description |
|---------|-------------|-------------|
| `set` |  Add or set a DC/OS configuration property |
| `show` | Display the DC/OS configuration file contents   |
| `unset` | Remove a property from the configuration file  |
| `validate`  |Validate changes to the configuration file|

## Positional arguments

| Name | Description |
|---------|-------------|-------------|
|`<name>` | The name of the property |
| `<value>` | The value of the property |


## Environment variables

Configuration properties all have corresponding environment variables. If a
property is in the "core" section (ex. "core.foo"), it corresponds to
environment variable DCOS_FOO. All other properties (ex "foo.bar")
correspond to enviroment variable DCOS_FOO_BAR.

Environment variables take precedence over corresponding configuration
property.

# Examples

## Display help for `dcos config` command

The `dcos help config` command is the same as [`dcos config --help`](/1.12/cli/command-reference/dcos-config/).

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

    Environment variables take precedence over corresponding configuration
    property.
```
