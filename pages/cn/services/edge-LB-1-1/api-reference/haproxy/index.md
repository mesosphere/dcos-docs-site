---
layout: layout.pug
navigationTitle:  HAProxy Stats API Reference
title: HAProxy Stats API Reference
menuWeight: 90
excerpt: Endpoints exposed by HAProxy instances

enterprise: false
---


默认情况下，Edge-LB 池中的每个负载均衡器实例都会暴露端口 `9090` 上的几个端点。您也可以通过更改您的 `pool.haproxy.stats.bindPort` 来配置该端口。

# 路由

| 路由 | 说明 |
|-----------------------------------------|-----------------------------------------------------------|
| `<agent-ip>:9090/_haproxy_health_check` | Returns `200 OK` 如果实例健康 |
| `<agent-ip>:9090/_haproxy_getconfig`    | Shows the current running `此实例的 haproxy.cfg` |
| `<agent-ip>:9090/_haproxy_getpids` | 显示当前运行中的 HAProxy 流程 ID。如果有多个 ID，那么 HAProxy 正处于因配置更改而引起的重新加载过程 |
| `<agent-ip>:9090/haproxy?stats` | 显示此 HAProxy 实例的当前连接和其他有用的统计数据 |
| `<agent-ip>:9090/haproxy?stats;csv` | Same information as `haproxy?stats`, but in `.csv` 格式 |
