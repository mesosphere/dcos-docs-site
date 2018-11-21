---
layout: layout.pug
navigationTitle: 已升级
excerpt: 升级您的 DC/OS Apache Spark 服务
title: 已升级
menuWeight: 50
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

为了升级您的 DC/OS {{ model.techName }} 服务，您必须卸载服务，然后重新安装。

1. 转到 DC/OS GUI 的 **Universe** > **已安装** 页面。将鼠标悬停在您的 Spark Service 上，以查看 **卸载** 按钮，然后选择它。

或者，从 DC/OS CLI 中输入以下内容：
```
 dcos package uninstall spark
```
2. 验证您不再在 **服务** 页面上看到您的 Spark 服务。
3. 重新安装 Spark。
```
 dcos package install spark
```
