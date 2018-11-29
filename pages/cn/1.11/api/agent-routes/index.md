---
layout: layout.pug
navigationTitle: 代理路由
title: 代理路由
menuWeight: 11
excerpt: 使用在 DC/OS 代理节点上运行的 Admin Router Agent

---
Admin Router Agent 在 DC/OS 代理节点上运行。它公开以下 API 路由。

Admin Router Agent 侦听端口 `61001` (HTTP)。

DC/OS Enterprise 增加组件通信的可选 SSL 加密。所以在 `strict` 和 `permissive` 安全模式中，Admin Router Agent 也会侦听端口 `61002` (HTTPS)。

有关 API 路由方式的详细信息，请参阅 [DC/OS API 参考](/cn/1.11/api/)。

<br/>

[ngindox api='/1.11/api/nginx.agent.yaml']
