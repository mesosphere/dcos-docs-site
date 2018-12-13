---
layout: layout.pug
navigationTitle: 版本注释
excerpt: 版本 2.3.0-3.0.16
title: 版本注释
menuWeight: 120
model: /cn/services/cassandra/data.yml
render: mustache
---

# 版本 2.3.0-3.0.16

## 新功能

- 现在可以通过 `cassandra.disk_failure_policy` 服务配置来配置 Cassandra 的 `disk_failure_policy`。在之前的版本中，这被硬编码至 `stop`。([#2515](https://github.com/mesosphere/dcos-commons/pull/2515))
- 所有框架（包含 Cassandra）成为 Mesos [`SANDBOX_PATH` 卷资源](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source)之后，现在均孤立各自的 `/tmp` 任务目录。([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) 和 [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## 错误修复

- “使用非默认 `service.rack` 值升级 Cassandra”已修复。([#2553](https://github.com/mesosphere/dcos-commons/pull/2553))

## 改进

- SDK 测试现在可以为 `svc.yml` Mustache 变量验证缺失的值。([#2527](https://github.com/mesosphere/dcos-commons/pull/2527))

# 版本 2.2.0-3.0.16

## 新功能
- 支持在远程地区部署服务。

# 版本 2.1.0-3.0.16

## 新功能

- Cassandra 任务不再在 Docker 容器内运行。这消除了在基于 Centos 的分布上必须以 root 运行服务的要求。
- 支持自动配置 TLS 工件，以保护 Cassandra 通信。
- 初始部署时自动配置系统表。
- 支持 DC/OS 1.11 中的 `Zone` 布局约束。
- 能够暂停服务 pod，以进行调试和恢复。

## 更新
- 大幅度提升服务编排稳定性和性能。
- 服务现在使用 Cassandra v3.0.16。
- 将 JRE 升级至 1.8u162。
- 服务现在使用 Mesos V1 API。可以使用服务属性 `service.mesos_api_version` 将服务返回到 V0 API。

# 版本 2.0.3-3.0.14

## 错误修复

- “卸载”现在可以正确处理失败的任务。

# 版本 2.0.2-3.0.14

## 错误修复

- 进一步修复任务状态过渡期间调度器的行为。

## 改进

- 将 JRE 版本更新为 8u144。
- 改进服务 CLI 中错误代码的处理。

# 版本 2.0.1-3.0.14

## 错误修复

- 修正了 Cassandra mustache 中的大括号
- 修复了恢复快照端口渲染。
- 任务将在 DC/OS 1.10 上正确绑定。
- 修复了配置生成。

## 文档

- 已更新 package 的安装后链接。
- 已更新 `limitations.md`。
- 保证显示前一步的 `version-policy.md` 内容。
- 已更新服务用户部分

# 版本 2.0.0-3.0.14

## 改进
- 基于 dcos-commons SDK 的最新稳定版本，可提供多种优势：
 - 与 DC/OS 功能（例如，虚拟网络）集成，与 DC/OS 访问控制集成。
 - 编排软件和更新配置，加强版本升级路径，并且可以暂停/恢复更新。
 - pod 的布局约束。
 - 各种服务的统一用户体验。
- 升级到 3.0.14 版本的 Apache Cassandra。

## 突破性变更
- 这是一个主要版本。您无法从 1.0.x 版本的软件包升级到 2.0.0-3.0.14。要升级，您必须从备份执行新的安装和恢复。
