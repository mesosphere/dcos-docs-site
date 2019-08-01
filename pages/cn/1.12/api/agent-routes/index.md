---
layout: layout.pug
navigationTitle: 代理路由
title: 代理路由
menuWeight: 11
excerpt: 在 DC/OS 代理节点上运行的 Admin Router。

---
在 DC/OS 代理节点上运行的 Admin Router 代理。它公开以下 API 路由。

- Admin Router 代理侦听端口 `61001` (HTTP)。

- DC/OS Enterprise 添加了组件通信的可选 SSL 加密，选用之后，Admin Router 代理也会侦听端口 `61002`（HTTPS）。

有关 API 路由方式的详细信息，请参阅 [DC/OS API 参考](/mesosphere/dcos/cn/1.12/api/)。

[ngindox api='/1.12/api/nginx.agent.yaml']
