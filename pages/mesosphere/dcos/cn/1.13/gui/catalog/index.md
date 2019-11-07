---
layout: layout.pug
navigationTitle:  目录
title: 目录
menuWeight: 4
excerpt: 使用目录页面
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---

{{ model.packageRepo }} 页面显示所有可用的 DC/OS 服务。只需单击即可从 DC/OS {{ model.packageRepo }} 安装包。可以使用默认设置安装包，或直接在 Web 界面中自定义安装。

![{{ model.packageRepo }}](/mesosphere/dcos/1.13/img/GUI-Catalog-Main_View-1_12.png)

图 1 - {{ model.packageRepo }}

