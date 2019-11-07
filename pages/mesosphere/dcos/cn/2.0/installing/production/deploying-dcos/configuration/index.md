---
layout: layout.pug
navigationTitle:  # 配置
title: # 配置
menuWeight: 5
excerpt: 使用 YAML 文件配置 DC/OS 参数
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


采用 YAML 格式在 `config.yaml` 文件中指定 DC/OS 配置参数。此文件存储在 [bootstrap 节点](/mesosphere/dcos/2.0/installing/production/system-requirements/#bootstrap-node) 上并在 DC/OS 安装期间使用以生成自定义 DC/OS 系统。

<p class="message--important"><strong>重要信息：</strong>如果您想在安装后修改配置文件，就必须遵循 <a href="/mesosphere/dcos/2.0/installing/production/upgrading/">DC/OS 升级流程</a>。</p>

# 格式

## 密钥值对
config.yaml 文件格式化为密钥值对列表。

例如：

```yaml
bootstrap_url: file:///opt/dcos_install_tmp
```

## 配置块和列表
配置块是一组配置设置。它包括以下内容：

- 一个后面有冒号的密钥，例如：`agent_list:`。配置块的密钥必须在自己的行上并且无前导空格。
- 使用连字符（`-`）后加空格的格式的值列表，；或包含一个或多个密钥值对的缩进排列数集。每个密钥值对必须缩进两个空格。请勿使用选项卡。
- 任意数量的空行或备注行。

文件中出现新的配置块后，先前的配置块就会关闭而新的配置块则会启动。配置块只能在文件中出现一次。例如：

```yaml
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
```

## 备注
备注行以井号（`#`）开头。它们可以在开头缩进任意个数的空格。

不允许添加行内备注，例如 `agent_list # this is my agent list`。它们将被视为设置值的一部分。要被视为备注，井号必须作为本行的第一个非空格字符。

例如：

```yaml
master_list:
- <master-private-ip-1>
# here is a comment
- <master-private-ip-2>
- <master-private-ip-3>
```

## 依赖关系
某些参数要依赖其他参数。除非指定了所有依赖关系，否则将忽略这些依赖参数。这些依赖关系通过在父级中嵌套显示在文档中。例如， 只有在您指定 `master_list` 时才需要 ` master_discovery: static.`

# 基本设置

| 参数                              | 描述                                                                                                                                               |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [agent_list](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#agent-list) | 该参数指定 IPv4 地址的 YAML 嵌套列表 (`-`) 到您的 [专用代理](/mesosphere/dcos/2.0/overview/concepts/#private-agent-node) 主机名。 |
| [bootstrap_url](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#bootstrap-url)                          | 这一必填参数指定 DC/OS 安装工具存储自定义 DC/OS 构建文件的 URI 路径。                                         |
| [cluster_name](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#cluster-name)                           | 该参数指定群集的名称。    |
| [exhibitor_storage_backend](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#exhibitor-storage-backend) | 该参数指定用于 Exhibitor 的存储库后端类型。 |
| [master_discovery](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#master-discovery-required) | 这一必填参数指定 Mesos 管理节点发现方法。 |
| [public_agent_list](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#public-agent-list) | 该参数指定您的 [公共代理](/mesosphere/dcos/2.0/overview/concepts/#public-agent-node) 主机名的 IPv4 地址的 YAML 嵌套列表 (-)。 |
| [resolvers](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#resolvers) | 这一必填参数指定一组您的 DC/OS 群集节点的 DNS 解析器的 YAML 嵌套列表 (`-`) 。 |
| [security](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#security-enterprise) | [enterprise type="inline" size="small" /] 该参数指定安全模式：`permissive` 或 `strict`。 |
| [ssh_port](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#ssh-port)                           | 该参数指定 SSH 端口，例如 22。          |
| [ssh_user](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#ssh-user)                          |该参数指定 SSH 用户名，例如 `centos`。     |
| [superuser_password_hash](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#superuser-password-hash-required-enterprise) | [enterprise type="inline" size="small" /] 这一必填参数指定带有井号的超级用户密码。 |
| [superuser_username](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#superuser-username-required-enterprise) | [enterprise type="inline" size="small" /] 这一必填参数指定超级用户的用户名。 |
| [use_proxy](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#use-proxy) | 该参数指定是否启用 DC/OS 代理。|


# 高级设置

请参阅 [配置参考](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#configuration-parameters) 和 [示例](/mesosphere/dcos/2.0/installing/production/deploying-dcos/configuration/examples/)。

# 为代理配置 DC/OS

默认在互联网上托管 DC/OS [{{ model.packageRepo }}](https://github.com/mesosphere/universe) 存储库。如果 DC/OS 群集在企业代理后面，您必须在安装之前在 [配置文件] (/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#use-proxy) 文件中指定代理配置。这能让您的群集能够连接到 {{ model.packageRepo }} 包。

<p class="message--note"><strong>注意：</strong>还应为 <a href="https://docs.docker.com/engine/admin/systemd/#/http-proxy">Docker</a> 配置 HTTP 代理。</p>
