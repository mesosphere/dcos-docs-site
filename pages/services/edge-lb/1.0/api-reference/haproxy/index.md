---
layout: layout.pug
navigationTitle:  HAProxy Stats API Reference
title: HAProxy Stats API Reference
menuWeight: 90
excerpt:

enterprise: false
---

Endpoints exposed by HAProxy instances.

By default, each load-balancer instance in an Edge-LB pool exposes a few endpoints on port `9090`. This port can be configured by changing your `pool.haproxy.stats.bindPort` as well.

# Routes

| Route                                   | Description                                               |
|-----------------------------------------|-----------------------------------------------------------|
| `<agent-ip>:9090/_haproxy_health_check` | Returns `200 OK` if the instance is healthy               |
| `<agent-ip>:9090/_haproxy_getconfig`    | Shows the current running `haproxy.cfg` for this instance |
| `<agent-ip>:9090/_haproxy_getpids`      | Shows the current running HAProxy process IDs. If there are more than one, HAProxy is in the process of reloading due to a configuration change |
| `<agent-ip>:9090/haproxy?stats` | Shows the current connections and other useful statistics for this HAProxy instance |
| `<agent-ip>:9090/haproxy?stats;csv` | Same information as `haproxy?stats`, but in csv format |
