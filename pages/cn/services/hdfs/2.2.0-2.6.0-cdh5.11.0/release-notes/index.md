---
layout: layout.pug
navigationTitle: 版本注释
excerpt: 版本 2.2.0-2.6.0-cdh5.11.0
title: 版本注释
menuWeight: 120
model: /cn/services/hdfs/data.yml
render: mustache
---

## 版本 2.2.0-2.6.0-cdh5.11.0

### 新特性
- 支持在远程地区部署服务。

## 错误修复
- 公开所有节点的堆设置。

## 版本 2.1.0-2.6.0-cdh5.11.0

### 新特性
- 支持 DC/OS 1.11+ 上使用 DC/OS 区的 HDFS 机架感知
- 支持自动配置 TLS 工件，以保护 HDFS 通信。
- 支持 Kerberos 授权和身份认证。
- 能够暂停服务 pod，以进行调试和恢复。

### 更新
- 服务编排稳定性和性能的重大改进
- 将 JRE 升级至 1.8u162。(#2135)
- 服务现在使用 Mesos V1 API。可以使用服务属性 `service.mesos_api_version` 将服务返回到 V0 API。


## 版本 2.0.4-2.6.0-cdh5.11.0

### 错误修复
- 现在公开布局约束。

## 版本 2.0.3-2.6.0-cdh5.11.0

### 错误修复
* envvars 中的破折号替换为支持 Ubuntu 的下划线。
* 某些数字配置参数可能被误解为浮点数，已修复。
* 卸载现在正确处理失败的任务。

## 版本 2.0.0-2.6.0-cdh5.11.0

### 改进
- 对日志和名称节点进行增强的节点间检查。
- 升级至 [dcos-commons 0.30.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.30.0)。

### 错误修复
- 对服务可靠性的多种修复和增强。

## 版本 1.3.3-2.6.0-cdh5.11.0-beta

### 新特性
- 支持在文件夹中安装
- 支持使用 CNI 网络

### 改进
- 升级至 [dcos-commons 0.20.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.20.1)
- 升级至 `cdh 5.11.0`
- 默认用户现在是 `nobody`
- 允许配置调度程序日志级别
- 向日志节点添加了一个准备就绪检查

### 文档
- 安装前备注包括五个代理先决条件
- 更新了 CLI 文档
