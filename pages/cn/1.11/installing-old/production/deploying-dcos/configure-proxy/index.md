---
layout: layout.pug
title: 为代理配置 DC/OS
menuWeight: 10
excerpt: 使用企业代理配置 DC/OS
---


默认在互联网上托管 DC/OS [Universe](https://github.com/mesosphere/universe) 存储库。如果 DC/OS 群集在企业代理后端，您必须在安装之前在 [配置文件](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy) 文件中指定代理配置。这将让您的群集能够连接到 Universe 包。

<p class="message--note"><strong>注意: </strong> 还应为 <a href="https://docs.docker.com/engine/admin/systemd/#/http-proxy">Docker</a>。配置 HTTP 代理 </p>
