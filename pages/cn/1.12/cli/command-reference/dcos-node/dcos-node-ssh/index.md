---
layout: layout.pug
navigationTitle: dcos node ssh
title: dcos node ssh
menuWeight: 6
excerpt: 建立与主节点或代理节点的 SSH 连接

enterprise: false
---


# 说明
`dcos node ssh` 命令允许您建立与 DC/OS 群集主节点或代理节点的 SSH 连接。

# 使用

```bash
dcos node ssh <command> [OPTION]
```

# 选项

| Name<>shorthand | Default | Description |
|---------|-------------|-------------|
| `--config-file=<path>` | | SSH 配置文件路径。|
| `--leader` | | 主节点。|
| `--master` | | 此选项已弃用，并替换为 `--leader`。|
| | `--master-proxy` | | 通过主节点代理 SSH 连接。从单独的网络访问 DC/OS 时，这非常有用。例如，在默认 AWS 配置中，私有代理无法从公共互联网访问。您可以使用该选项访问它们，这将通过可公开访问的主节点代理 SSH 连接。|
| `--option SSHOPT=VAL` | | SSH 选项。有关更多信息，请在终端中输入 `man ssh_config`。| 
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|
| `--slave=<agent-id>`   |             | This option is deprecated and is replaced by `--mesos-id`. |
| `--user=<user>`   |   `core` | SSH 用户。|

# 位置自变量

| Name<>shorthand | Default | Description |
|---------|-------------|-------------|
| `<command>` | | 在 DCOS 群集节点上执行的命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

# 示例

有关示例，请参阅[文档](/1.11/administering-clusters/sshcluster/)。
