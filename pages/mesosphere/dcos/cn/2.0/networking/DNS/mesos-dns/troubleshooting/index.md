---
layout: layout.pug
navigationTitle:  “故障排除”
title: “故障排除”
menuWeight: 400
excerpt: Mesos DNS 故障排除
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

# 如何查看 Mesos-DNS 版本？

# 您可以通过 `mesos-dns -version` 查看 Mesos-DNS 版本。

<p class="message--note"><strong>注意：</strong>HTTP 界面仅解析 Mesos 域中的主机名。我们不建议独立于 DC/OS 升级 Mesos-DNS。请使用随 DC/OS 版本发送的 Mesos-DNS 版本。</p>

# 如果 Mesos-DNS 未能启动，该怎么办？

检查端口 53 和端口 8123 是否可用，确保未被其他进程使用。

# 如果我的代理节点无法连接到 Mesos-DNS，该怎么办？

* 确保端口 53 未被群集上的防火墙规则阻止。

* 管理节点可能未在运行。运行 `sudo systemctl status dcos-mesos-dns` 和 `sudo journalctl -u dcos-gen-resolvconf.service -n 200 -f`，获取有关 Mesos-DNS 错误的更多信息。

# 如何配置 DC/OS 群集，以便与外部主机和服务通信？

对于 DC/OS 群集之外主机名或服务的 DNS 请求，Mesos-DNS 将查询外部域名服务器。默认将使用 IP 地址为 8.8.8.8 的 Google 域名服务器。如果需要配置自定义外部域名服务器，请在首次安装 DC/OS 时使用 [`resolvers` 参数][1]。

<p class="message--important"><strong>重要信息：</strong>只有在安装 DC/OS 时才能设置外部域名服务器。它们在安装后无法更改。<P>

# <a name="leader"></a>leader.mesos 和 master.mesos 的区别是什么？

要查询领导管理节点，应始终查询 `leader.mesos`。如果您尝试使用 HTTP 来连接到 `master.mesos`，则会被自动重定向到领导管理节点。

但是，如果您尝试使用 HTTP 以外的任何其他方式查询或连接到 `master.mesos`，结果将不可预测，因为该名称将解析到任意管理节点。例如，尝试向 `master.mesos` 注册的服务可能与非领导管理节点通信，并且无法在群集上注册为服务。

 [1]: /mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/

