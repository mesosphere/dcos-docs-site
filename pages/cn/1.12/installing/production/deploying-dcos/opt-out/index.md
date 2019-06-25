---
layout: layout.pug
navigationTitle: 禁用
excerpt: 为您的群集禁用身份认证和遥测
title: 禁用
menuWeight: 20
---

## 身份认证

您可以通过为您的群集禁用此选择项来禁用提供的身份认证。要禁用身份认证，请在安装期间将此参数添加到您的 [`config.yaml`](/1.12/installing/production/advanced-configuration/configuration-reference/) 文件（需要使用 [安装](/1.12/installing/production/deploying-dcos/installation/) 方法）：

```yaml
oauth_enabled: 'false'
```

<p class="message--note"><strong>注意：</strong>如果已经安装了群集，并且希望禁用此功能，则可以使用相同的<a href="/1.12/installing/production/advanced-configuration/configuration-reference/">配置参数</a>集进行升级。</p>



## 遥测

可以通过禁用群集遥测来选择不提供匿名数据。要禁用遥测，您可以：

- 在安装期间将此参数添加到 [`config.yaml`](/1.12/installing/production/advanced-configuration/configuration-reference/)文件（需要使用 [安装][1] 方法）：

    ```yaml
    telemetry_enabled: 'false'
    ```



<p class="message--note"><strong>注意：</strong>如果已经安装了群集，并且希望禁用此功能，则可以使用相同的<a href="/1.12/installing/production/advanced-configuration/configuration-reference/">配置参数</a>集进行升级。</p>
