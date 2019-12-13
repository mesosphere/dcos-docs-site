---
layout: layout.pug
navigationTitle: HAProxy Stats API 参考
title: HAProxy Stats API 参考
menuWeight: 90
excerpt: 由 HAProxy 实例暴露的端点
enterprise: false
---


默认情况下，Edge-LB 池中的每个负载均衡器实例都会暴露端口 `9090` 上的几个端点。您也可以通过更改您的 `pool.haproxy.stats.bindPort` 来配置该端口。
 
# 路由

| 路由 | 说明 |
|-----------------------------------------|-----------------------------------------------------------|
| `<agent-ip>:9090/_haproxy_health_check` | Returns `200 OK` if the instance is healthy               |
| `<agent-ip>:9090/_haproxy_getconfig`    | Shows the current running `haproxy.cfg` for this instance |
| `<agent-ip>:9090/_haproxy_getpids`      | Shows the current running HAProxy process IDs. If there are more than one, HAProxy is in the process of reloading due to a configuration change |
| `<agent-ip>:9090/haproxy?stats` | Shows the current connections and other useful statistics for this HAProxy instance |
| `<agent-ip>:9090/haproxy?stats;csv` | Same information as `haproxy?stats`, but in `.csv` format |
