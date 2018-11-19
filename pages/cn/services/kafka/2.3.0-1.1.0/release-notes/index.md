---
layout: layout.pug
navigationTitle: 
excerpt: DC/OS Apache Kafka 服务的已知限制
title: 限制
menuWeight: 120
model: /cn/services/kafka/data.yml
render: mustache
---


## 版本 2.3.0-1.1.0

### 更新
- 升级 {{ model.techShortName }} base tech 至版本 1.1.0。参见 [{{ model.techShortName }}的发行说明](https://www.apache.org/dist/kafka/1.1.0/RELEASE_NOTES.html)，以了解详情。

## 版本 2.3.0-1.0.0

### 新特性
- 支持通过缺省安全来配置 {{ model.techShortName }} 传输加密密码。

## 版本 2.2.0-1.0.0

### 新特性
- 支持使用自定义顶级域，以便于将服务安全地暴露在集群之外。详情 [此处](/services/kafka/2.3.0-1.0.0/security/#securely-exposing-dcos-apache-kafka-outside-the-cluster)。
- 支持在远程区域启动服务。

## 版本 2.1.0-1.0.0

### 新特性
- 支持自动配置 TLS 工件，以保护 {{ model.techShortName }} 通信。
- 支持 Kerberos 和 SSL 授权和身份认证。
- 支持 `Zone` DC/OS 1.11 中的布局约束（DC/OS 1.11 的 beta 版本即将推出）。
- 能够暂停服务 pod，以进行调试和恢复。

### 更新
- 大幅度提升服务编排稳定性和性能。
- 协议和日志版本默认值也设置为 `1.0`。
- 改善 {{ model.techShortName }}的 ZK 库，以根据虚拟网络的要求启用重新解析。
- 将 JRE 升级至 1.8u162
- 服务现在使用 Mesos V1 API。可以使用服务属性 `service.mesos_api_version` 将服务返回到 V0 API。

## 版本 2.0.4-1.0.0

### 更新
- 已升级至 {{ model.techShortName }} v1.0.0。**注意：** 协议和日志版本默认值设置为 0.11.0。升级到此版本后，它们可以被设置为1.0.0。

# 版本 2.0.3-0.11.0

### 错误修复
* 卸载现在正确处理失败的任务。
* 修复了 broker 就绪检查中的定时问题，当服务的每个 broker 被分配 2 个以上 CPU 时，该问题就会导致 broker 停留在 STARTING 状态。

# 版本 2.0.2-0.11.0

### 错误修复

- 动态端口不再粘滞于 pod 替换
- 进一步修复任务状态过渡期间调度器的行为。

#### 改进

- 将 JRE 版本更新为 8u144。
- 改进服务 CLI 中错误代码的处理。

# 版本 2.0.1-0.11.0

### 错误修复
* 任务将在 DC/OS 1.10 上正确绑定。

### 文档
- 已更新包的安装后链接。
- 已更新 `limitations.md`。
- 保证显示前一步的 `version-policy.md` 内容。

# 版本 2.0.0-0.11.0

## 改进
- 基于 dcos-commons SDK 的最新稳定版本，可提供多种优势：
 - 与 DC/OS 功能（例如，虚拟网络）集成，与 DC/OS 访问控制集成。
 - 编排软件和更新配置，加强版本升级路径，并且可以暂停/恢复更新。
 - pod 的布局约束。
 - 各种服务的统一用户体验。
- broker 正常关闭。
- 更新至 0.11.0.0 版本的 Apache {{ model.techShortName }} （包括日志和协议版本）。

## 突破性变更
- 这是一个主要版本。您无法将 1.0.x 版本的包升级至版本 2.0.0-0.11.0。要升级，您必须在集群中执行新的安装和复制数据。
