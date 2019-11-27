---
layout: layout.pug
navigationTitle:  dcos node list
title: dcos node list
menuWeight: 6
excerpt: 显示 DC/OS 节点信息
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: false
---

# 说明

`dcos node list` 命令显示具有识别信息的 DC/OS 管理和代理节点列表，包括：
- 主机名
- IP 地址
- 公共 IP 地址
- 唯一标识符
- 节点类型
- 群集分域
- 可用分区      

如果在公共云提供程序（例如，AWS、Google Cloud 或 Azure）上部署 DC/OS，则可以使用此命令查找公共代理 IP 地址。如果 DC/OS 安装在内部网络（本地）或专用云上，节点通常不具有独立的公共和专用 IP 地址。对于内部网络或专用云上的节点，公共 IP 地址通常与 DNS 命名空间中为服务器定义的 IP 地址相同。

在大多数情况下，您可以使用此命令返回每个节点的专用和公共 IP 地址。但是，您应该记住，如果 EDGE-LB 池使用虚拟网络，则返回的公共和专用 IP 地址可能不准确。

# 使用

```bash
dcos node list [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--field name`   |  指定要包含在 dcos node 命令输出中的一个或多个其他字段的名称。您可以多次包含此选项以添加多个字段。 |
| `--help, h` | 显示用法。 |
| `--info` | 显示该子命令的简短描述。|
| `--json` | 显示 JSON 格式的数据。|
| `--version` | 显示版本信息。|

# 权限

运行此命令要求您的服务或用户帐户具有以下管理权限：
<p>
<code>dcos:adminrouter:ops:mesos full<br> 
dcos:adminrouter:ops:mesos-dns full</code>
</p>

如果您没有至少具有这些权限的帐户，该命令将返回错误。

要使用此命令返回面向公众的 IP 地址，您的服务或用户帐户必须具有以下管理权限：
<p>
<code>dcos:adminrouter:ops:networking full</code>
</p>

如果您在没有此权限的情况下运行 `dcos node list` 命令，命令会返回节点信息，但在输出中不包括公共 IP 地址列。有关设置和管理权限的更多信息，请参阅 [权限管理](/mesosphere/dcos/1.13/security/ent/perms-management/) 和 [权限参考](/mesosphere/dcos/1.13/security/ent/perms-reference/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/1.13/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

# 示例
以下示例说明了如何使用此命令查找小群集中节点面向公众的 IP 地址：
```bash
dcos node list

dcos node list 
    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
  10.0.2.148     10.0.2.148                 69e4f34a-e5c4-4271-85b5-b6609056bcde-S1  agent            aws/us-west-2  aws/us-west-2a  
  10.0.4.118     10.0.4.118  52.34.156.169  69e4f34a-e5c4-4271-85b5-b6609056bcde-S0  agent (public)   aws/us-west-2  aws/us-west-2a  
  master.mesos.  10.0.7.51   54.202.215.97  69e4f34a-e5c4-4271-85b5-b6609056bcde     master (leader)  aws/us-west-2  aws/us-west-2a  
```

以下示例说明了如何将端口信息添加到命令的输出中：
```bash
dcos node list --field port

    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       PORT  
  10.0.2.148     10.0.2.148                 69e4f34a-e5c4-4271-85b5-b6609056bcde-S1  agent            aws/us-west-2  aws/us-west-2a  5051  
  10.0.4.118     10.0.4.118  52.34.156.169  69e4f34a-e5c4-4271-85b5-b6609056bcde-S0  agent (public)   aws/us-west-2  aws/us-west-2a  5051  
  master.mesos.  10.0.7.51   54.202.215.97  69e4f34a-e5c4-4271-85b5-b6609056bcde     master (leader)  aws/us-west-2  aws/us-west-2a        
```
