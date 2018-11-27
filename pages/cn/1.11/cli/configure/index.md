---
layout: layout.pug
navigationTitle: 配置 CLI
title: 配置 CLI
menuWeight: 2
excerpt: 配置命令行界面

enterprise: false
---


您可以使用 [dcos cluster](/cn/1.11/cli/command-reference/dcos-cluster/) 和 [dcos confi](/cn/1.11/cli/command-reference/dcos-config/) 命令组访问 DC/OS CLI 配置。


# 配置 HTTP 代理

如果使用代理服务器连接到互联网，您可以配置 CLI 以使用代理服务器。

**前提条件**

* `pip` 版本 7.1.0 或更高版本。
* 定义 `http_proxy` 和 `https_proxy` 环境变量来使用 `pip`。

若要为 CLI 配置代理：

* 从 CLI 终端定义环境变量 `http_proxy` 和 `https_proxy`：

 export http_proxy=’http://<user>:<pass>@<proxy_host>:<http_proxy_port>’
 export http_proxy=’http://<user>:<pass>@<proxy_host>:<https_proxy_port>’


* 为您不想使用代理的域定义 `no_proxy`：

 export no_proxy=".mesos,.thisdcos.directory,.dcos.directory,.zk,127.0.0.1,localhost,foo.bar.com,.baz.com”
