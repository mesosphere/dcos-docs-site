---
layout: layout.pug
navigationTitle: 禁用
excerpt: 为您的集群禁用身份认证和遥测
title: 禁用
menuWeight: 20
---

## 身份认证

您可以通过禁用集群来选择禁用提供的身份认证。要禁用身份认证，请在安装期间将此参数添加到您的 [`config.yaml`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/) 文件（需要使用 [安装](/cn/1.11/installing/production/deploying-dcos/installation/) 方法）：

```yaml
oauth_enabled: 'false'
```

**注意：** 如果已经安装了集群，并且希望禁用此功能，可以使用同一 [配置参数](/cn/1.11/installing/production/advanced-configuration/configuration-reference/) 集进行升级。

## 遥测

可以通过禁用集群遥测来选择不提供匿名数据。要禁用遥测，您可以：

- 在安装期间将此参数添加到 [`config.yaml`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/)文件（需要使用 [安装][1] 方法）：

    ```yaml
    telemetry_enabled: 'false'
    ```


**注意：** 如果已经安装了集群，并且希望禁用此功能，可以使用同一 [配置参数](/cn/1.11/installing/production/advanced-configuration/configuration-reference/) 集进行升级。

