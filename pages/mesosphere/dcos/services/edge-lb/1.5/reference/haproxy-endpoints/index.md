---
layout: layout.pug
navigationTitle:  Edge-LB HAProxy endpoints
title: Edge-LB HAProxy endpoints reference
menuWeight: 85
excerpt: Describes the endpoints exposed by Edge-LB HAProxy instances
enterprise: true
---

Edge-LB automatically generates configuration information for the HAProxy&reg; program, then reloads and restarts HAProxy, as needed. Edge-LB generates the HAProxy configuration based on application data available from configuration templates in the HAProxy configuration file (`haproxy.cfg`) and Marathon app definition.

When an application starts, stops, relocates, or has any change in health status, Edge-LB automatically regenerates the HAProxy configuration and reloads HAProxy.

# Edge-LB HAProxy endpoints

By default, each load-balancer instance in an **Edge-LB pool** exposes the following endpoints on port `9090`. Alternatively, you can configure which port to use for these endpoints by changing the `pool.haproxy.stats.bindPort` configuration setting.

| <b>Endpoint</b> | <b>Description</b> |
| :--- | :-------- |
|<code>public-node:9090/haproxy?stats</code> | The **Statistics** endpoint produces an HTML page that provides statistical information about the current HAProxy instance, including information about current connections and load balancing activity for the HAProxy instance. You can view the statistics provided by this endpoint in your browser. |
<code>public-node:9090/haproxy?stats;csv</code> | The **Statistics CSV** endpoint provides statistical information about the current HAProxy instance and load balancing activity as comma-separated values (CSV). In CSV format, other tools can consume the information. For example, this endpoint produces the results used in the `zdd.py` script. |
<code>public-node:9090/_haproxy_health_check</code> | The **Health check** endpoint returns 200 OK if HAProxy is healthy. |
<code>public-node:9090/_haproxy_getconfig</code> | The **Configuration** endpoint returns the current HAProxy configuration file (`haproxy.cfg`) for an HAProxy instance. This endpoint returns the configuration used when the HAProxy instance was started. The endpoint is implemented by the `getconfig.lua` script. |
