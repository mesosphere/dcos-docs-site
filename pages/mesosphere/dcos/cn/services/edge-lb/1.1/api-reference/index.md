---
layout: layout.pug
navigationTitle: Edge-LB API 参考
title: Edge-LB API 参考
menuWeight: 80
excerpt: 由 Edge-LB 安装包暴露的所有 API 端点的参考
enterprise: false
---

Edge-LB API 使用户能够创建和管理负载均衡器池。
# API 版本

 Edge-LB v1.0.0 中采用名为 `apiVersion` 的新顶级配置字段。两种版本几乎相同，只有一个重要区别：`pool.haproxy.backends.servers`（apiVersion `V1`）已被 `pool.haproxy.backends.services` 替代，以更直观的方式为 HAProxy 选择服务/后端。

<p class="message--note"><strong>注意：</strong> 针对向后兼容，Edge-LB 1.0 同时支持 `V1` 和 `V2` API。因此，针对 Edge-LB 1.0 之前的 Edge-LB 版本写入的客户端无需进行任何修改就可以使用 Edge-LB 1.0。</p>

在左侧选择一个 API 版本，以查看相应的 swagger 定义。
