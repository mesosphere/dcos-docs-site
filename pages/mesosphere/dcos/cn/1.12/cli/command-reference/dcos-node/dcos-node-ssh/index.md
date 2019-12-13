---
layout: layout.pug
navigationTitle:  dcos node ssh
title: dcos node ssh
menuWeight: 15
excerpt: 建立与主节点或代理节点的 SSH 连接

enterprise: false
---


# 说明
`dcos node ssh` 命令让您建立与 DC/OS 群集管理节点或代理节点的 SSH 连接。

# 使用

```bash
dcos node ssh (--leader | --mesos-id=<mesos-id> | --private-ip=<private-ip>) [--config-file=<path>]  [--user=<user>]  [--master-proxy]  [--option SSHOPT=VAL ...]  [--proxy-ip=<proxy-ip>]  [<command>]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--leader` |  | 主管理节点。|
| `--mesos-id=<mesos-id>` | | 节点的代理 ID。|
| `--private-ip=<private-ip>` | | 具有提供的专用 IP 的代理节点。 |
| `--config-file=<path>` | | SSH 配置文件的路径。|
| `--user=<user>` | `core` | SSH 用户。 |
|  `--master-proxy` | | 通过管理节点代理 SSH 连接。从单独的网络访问 DC/OS 时，这非常有用。例如，在默认 AWS 配置中，私用代理无法从公共互联网访问。您可以使用该选项访问它们，这将通过可公开访问的管理节点代理 SSH 连接。|
| `--option SSHOPT=VAL` | | SSH 选项。有关更多信息，请在终端中输入 `man ssh_config`。|
| `--proxy-ip=<proxy-ip>` | | 通过不同 IP 地址代理 SSH 连接。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<command>` |  在 DCOS 群集节点上执行的命令。|


# 示例

有关示例，请参阅[文档](/mesosphere/dcos/cn/1.12/administering-clusters/sshcluster/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|
