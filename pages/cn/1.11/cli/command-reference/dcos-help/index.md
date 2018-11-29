---
layout: layout.pug
navigationTitle: dcos help
title: dcos help
menuWeight: 7
excerpt: 显示 DC/OS CLI 帮助信息

enterprise: false
---

# 说明
`dcos help` 命令显示 DC/OS CLI 帮助信息。

# 使用

```bash
dcos help <subcommand>
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--info` | 显示此子命令的简短说明。|
| | `--version, v` | 显示版本信息。 |
| `<subcommand>` | 子命令名称。|

# 示例

## 显示 dcos config 命令的帮助

`dcos help config` 命令与 [`dcos config --help`](/cn/1.11/cli/command-reference/dcos-config/)一样。

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
