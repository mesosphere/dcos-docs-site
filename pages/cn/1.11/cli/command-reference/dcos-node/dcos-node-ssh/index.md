---
layout: layout.pug
navigationTitle: dcos node ssh
title: dcos node ssh
menuWeight: 6
excerpt: 建立与管理节点或代理节点的 SSH 连接

enterprise: false
---


# 说明
`dcos node ssh` 命令让您建立与 DC/OS 集群管理节点或代理节点的 SSH 连接。

# 使用

```bash
dcos node ssh <command> [OPTION]
```

# 选项

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `--config-file=<path>` | | SSH 配置文件路径。|
| `--leader` | | 主导的管理节点。|
| `--master` | | 此选项已弃用，并替换为 `--leader`。|
| | `--master-proxy` | | 通过主节点代理 SSH 连接。从另外的网络访问 DC/OS 时，这非常有用。例如，在默认 AWS 配置中，私有代理无法从公共互联网访问。您可以使用该选项访问它们，这将通过可公开访问的管理节点代理 SSH 连接。|
| `--option SSHOPT=VAL` | | SSH 选项。有关更多信息，请在终端中输入 `man ssh_config`。| 
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|
| `--slave=<agent-id>`   |             | This option is deprecated and is replaced by `--mesos-id`. |
| `--user=<user>`   |   `core` | SSH 用户。|

# 位置自变量

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `<command>` | | 在 DCOS 集群节点上执行的命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

# 示例

有关示例，请参阅[文档](/cn/1.11/administering-clusters/sshcluster/)。
