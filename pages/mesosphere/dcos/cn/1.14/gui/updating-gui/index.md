---
layout: layout.pug
navigationTitle:  更新 GUI
title: 更新 GUI
menuWeight: 90
excerpt: DCOS GUI 更新服务 
enterprise: true
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

DC/OS GUI 更新服务使用发布到 {{ model.packageRepo }} 的新版本更新当前版本的 DC/OS GUI。此服务允许您更新 GUI，而无需更新 DC/OS 版本。

DC/OS GUI 更新服务是在所有 DC/OS 管理节点上运行的组件。

# 使用

您可以通过向更新端点发布请求来更新当前版本的 DC/OS GUI `/dcos-ui-update-service/api/v1/update/<version>/` 提供的版本驻留在群集可用的 {{ model.packageRepo }} 资源库之一。您可以通过请求 `dcos-ui` 包的 Cosmos API `/package/list-versions/` 端点找到可用的包版本。

# 延迟

处理更新请求时，接收 API 调用的管理节点将下载包，提取其内容并开始服务于新版本。如果群集有多个管理节点，则 DC/OS GUI 更新将最终保持一致。

成功处理更新 API 请求后，所有管理节点完成 API 调用和完成更新之间存在一定的延迟。因为这种延迟，在每个管理节点完成更新之前，DC/OS GUI 可能不可用，并且每个管理节点都在服务于新的 DC/OS GUI 版本。当 DC/OS GUI 版本重置为默认版本时，也是如此。

## 资源

[swagger api='/mesosphere/dcos/1.14/api/endpoints.yaml']
