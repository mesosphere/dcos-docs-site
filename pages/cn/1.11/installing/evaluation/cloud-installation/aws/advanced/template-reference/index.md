---
layout: layout.pug
navigationTitle: 模板参考
title: 模板参考
menuWeight: 5
excerpt: 高级模板参数
---

这些高级模板参数是分别在各个 JSON 文件中指定的。在 DC/OS 安装期间，这些模板文件用于生成自定义 DC/OS 构架。

### Zen 模板
[Zen](#zen) 模板编排各个组件模板，用于创建 DC/OS 集群。

### 代理模板
[代理](#private-agent) 模板创建 [公共](/cn/1.11/overview/concepts/#public-agent-node) 或 [专用](/cn/1.11/overview/concepts/#private-agent-node) 代理节点，然后作为 AutoScalingGroup 的一部分附加到 DC/OS 集群。

### 管理节点模板
[管理节点](#master) 模板在已创建基础架构堆栈的顶部创建管理节点。

### 基础架构模板
[基础架构](#infrastructure) 模板定义并创建完全兼容现有 VPC 的 DC/OS 专用基础架构。


## <a name="zen"></a>Zen

Zen 模板（例如，`ee.elzen-1.json`) 编排各个组件模板。

<table class="table">
  <tr>
    <th>参数名称</th>
    <th>密钥值</th>
  </tr>
  <tr>
    <td>AdminLocation</td>
    <td>可选：指定用于访问管理分区 IP 范围白名单。必须是有效的 CIDR。若要允许在任何 IP 地址访问，请使用 <code>0.0.0.0/0</code>。</td>
  </tr>
  <tr>
    <td>CustomAMI</td>
    <td>可选：指定 AMI ID。必须位于同一分域，并安装所有 DC/OS 先决条件。</td>
  </tr>
  <tr>
    <td>InternetGateway</td>
    <td>互联网网关 ID，必须附加到 <code>Vpc</code>。供所有节点在向外互联网访问时使用。</td>
  </tr>
  <tr>
    <td>KeyName</td>
    <td>AWS EC2 密钥对，用于 SSH 到实例</td>
  </tr>
  <tr>
    <td>MasterInstanceType</td>
    <td>分域专用实例类型。示例：m3.xlarge</td>
  </tr>
  <tr>
    <td>PrivateAgentInstanceCount</td>
    <td>指定专用代理节点的数量或接受默认值。</td>
  </tr>
  <tr>
    <td>PrivateAgentInstanceType</td>
    <td>分域专用实例类型。示例：m3.xlarge</td>
  </tr>
  <tr>
    <td>PrivateSubnet</td>
    <td>供所有专用代理节点使用的子网 ID</td>
  </tr>
  <tr>
    <td>PublicAgentInstanceCount</td>
    <td>指定公共代理节点的数量或接受默认值。</td>
  </tr>
  <tr>
    <td>PublicAgentInstanceType</td>
    <td>分域专用实例类型。示例：m3.xlarge</td>
  </tr>
  <tr>
    <td>PublicSubnet</td>
    <td>供所有公共代理节点使用的子网 ID</td>
  </tr>
  <tr>
    <td>Vpc</td>
    <td>要使用的现有 VPC。节点将使用该 VPC 项下的子网和互联网网关启动</td>
  </tr>
</table>


## <a name="private-agent"></a>专用代理

专用代理模板（`advanced-priv-agent.json`) 创建代理，然后作为 AutoScalingGroup 的一部分附加到 DC/OS 集群。要配置模板，请指定要加入的 DC/OS 集群的 VPC、子网和管理节点 DNS 地址。

<table class="table">
  <tr>
    <th>参数名称</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>InternalMasterLoadBalancerDnsName</td>
    <td>内部负载均衡器的 DNS 名称。必须有助于代理加入正在运行的集群</td>
  </tr>
  <tr>
    <td>KeyName</td>
    <td>AWS EC2 密钥对，用于 SSH 到实例</td>
  </tr>
  <tr>
    <td>PrivateAgentInstanceCount</td>
    <td>指定专用代理节点的数量或接受默认值。</td>
  </tr>
  <tr>
    <td>PrivateAgentInstanceType</td>
    <td>分域专用实例类型。示例：m3.xlarge</td>
  </tr>
  <tr>
    <td>PrivateAgentSecurityGroup</td>
    <td>专用代理使用的权限安全组</td>
  </tr>
  <tr>
    <td>PrivateSubnet</td>
    <td>供所有专用代理节点使用的子网 ID</td>
  </tr>
</table>



## <a name="public-agent"></a>公共代理

公共代理模板（`advanced-pub-agent.json`) 创建随后代理，然后作为 AutoScalingGroup 的一部分附加到 DC/OS 集群。要配置模板，请指定要加入的 DC/OS 集群的 VPC、子网和管理节点 DNS 地址。

<table class="table">
  <tr>
    <th>参数名称</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>InternalMasterLoadBalancerDnsName</td>
    <td>内部负载均衡器的 DNS 名称。必须有助于代理加入正在运行的集群</td>
  </tr>
  <tr>
    <td>KeyName</td>
    <td>AWS EC2 密钥对，用于 SSH 到实例</td>
  </tr>
  <tr>
    <td>PublicAgentInstanceCount</td>
    <td>指定公共代理节点的数量或接受默认值。</td>
  </tr>
  <tr>
    <td>PublicAgentInstanceType</td>
    <td>分域专用实例类型。例如，m3.xlarge</td>
  </tr>
  <tr>
    <td>PublicAgentSecurityGroup</td>
    <td>公共代理使用的权限安全组</td>
  </tr>
  <tr>
    <td>PublicSubnet</td>
    <td>供所有公共代理节点使用的子网 ID</td>
  </tr>
</table>

## <a name="master"></a>管理节点

管理节点模板（`advanced-master-1.json`、`advanced-master-3.json`、`advanced-master-5.json`、`advanced-master-7.json`）在已创建基础架构堆栈的顶部创建管理节点。

<table class="table">
  <tr>
    <th>参数名称</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>AdminSecurityGroup</td>
    <td>管理 URL 安全组。控制对管理页面的访问</td>
  </tr>
  <tr>
    <td>ExhibitorS3Bucket</td>
    <td>S3 Bucket 资源名称。由 Exhibitor 用于 Zookeeper 发现和协调。如需有关“共享配置”的 Exhibitor 文档，请参阅 https://github.com/Netflix/exhibitor/wiki/Shared-Configuration，了解更多信息</td>
  </tr>
  <tr>
    <td>KeyName</td>
    <td>AWS EC2 密钥对，用于 SSH 到实例</td>
  </tr>
  <tr>
    <td>LbSecurityGroup</td>
    <td>Loadbalancer 安全组。支持管理节点和专用代理节点进行通信的规则。</td>
  </tr>
  <tr>
    <td>MasterInstanceType</td>
    <td>分域专用实例类型。示例：m3.xlarge</td>
  </tr>
  <tr>
    <td>MasterSecurityGroup</td>
    <td>管理节点使用的安全组</td>
  </tr>
  <tr>
    <td>PrivateAgentSecurityGroup</td>
    <td>专用代理使用的安全组，通常具备有限的向外访问权限</td>
  </tr>
  <tr>
    <td>PrivateSubnet</td>
    <td>供所有专用代理节点使用的子网 ID</td>
  </tr>
  <tr>
    <td>PublicAgentSecurityGroup</td>
    <td>公共代理使用的权限安全组</td>
  </tr>
  <tr>
    <td>PublicSubnet</td>
    <td>供所有公共代理节点使用的子网 ID</td>
  </tr>
</table>

## <a name="infrastructure"></a>基础架构

基础架构模板（`infra.json`）定义并创建完全兼容已创建 VPC 的 DC/OS 专用基础架构。这是 DC/OS 集群的最基础构建模块，并且在此堆栈中创建的组件由相关模板（管理和代理节点）占用。

<table class="table">
  <tr>
    <th>参数名称</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>AdminLocation</td>
    <td>可选：指定用于访问管理分区 IP 范围白名单。必须是有效的 CIDR。</td>
  </tr>
  <tr>
    <td>InternetGateway</td>
    <td>互联网网关 ID，必须附加到“Vpc”。供所有节点在向外互联网访问时使用。</td>
  </tr>
  <tr>
    <td>KeyName</td>
    <td>AWS EC2 密钥对，用于 SSH 到实例</td>
  </tr>
  <tr>
    <td>PrivateSubnet</td>
    <td>供所有专用代理节点使用的子网 ID</td>
  </tr>
  <tr>
    <td>PublicSubnet</td>
    <td>供所有公共代理节点使用的子网 ID</td>
  </tr>
  <tr>
    <td>Vpc</td>
    <td>要使用的现有 VPC。节点将使用该 VPC 项下的子网和互联网网关启动</td>
  </tr>
</table>
