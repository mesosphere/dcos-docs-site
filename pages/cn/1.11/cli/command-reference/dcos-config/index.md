---
layout: layout.pug
navigationTitle: dcos config
title: dcos config
menuWeight: 4
excerpt: 管理 DC/OS 配置文件

enterprise: false
---

# 说明
`dcos config` 命令让您管理您在运行 [dcos cluster setup](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/) 时创建的 DC/OS 配置文件。该配置文件位于：`~/.dcos/cluster/<cluster_id>/dcos.toml`. 如果您尚未更改任何配置属性, 你应该在运行时看到这个输出 `dcos config show`:
```
 cluster.name <cluster_name>
 core.dcos_acs_token ********
 core.dcos_url <cluster_url>
 core.ssl_verify `true` or `false`
```

## 环境变量
配置属性具有相应的环境变量。如果属性位于 `core` 部分（例如，`core.foo`)，它与环境变量`DCOS_FOO`对应。所有其他属性（例如，`foo.bar`）与环境变量 `DCOS_FOO_BAR`对应。环境变量优先于相应的配置属性。

# 使用

```bash
dcos config
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--info` | 显示此子命令的简短说明。|
| | `--version, v` | 显示版本信息。 |


## 显示 dcos config 命令的帮助

`dcos help config` 命令与 `dcos config --help`相同。

有关详细信息，请参阅 [`dcos help`](/cn/1.11/cli/command-reference/dcos-help/)命令。
