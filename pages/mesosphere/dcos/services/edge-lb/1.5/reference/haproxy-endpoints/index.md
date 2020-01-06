---
layout: layout.pug
navigationTitle:  Edge-LB HAProxy endpoints
title: Edge-LB HAProxy endpoints reference
menuWeight: 85
excerpt: Describes the endpoints exposed by Edge-LB HAProxy instances
enterprise: true
---

Edge-LB automatically generates configuration information for the HAProxy program, then reloads and restarts HAProxy, as needed. Edge-LB generates the HAProxy configuration based on application data available from configuration templates in the HAProxy configuration file (`haproxy.cfg`) and Marathon app definition.

When an application starts, stops, relocates, or has any change in health status, Edge-LB automatically regenerates the HAProxy configuration and reloads HAProxy.

# Edge-LB HAProxy endpoints

By default, each load-balancer instance in an **Edge-LB pool** exposes the following endpoints on port `9090`. Alternateively, you can configure the port to use for these endpoints by changing the `pool.haproxy.stats.bindPort` configuration setting.

| <b>Endpoint</b> | <b>Description</b> |
| :--- | :-------- |
|<code>public-node:9090/haproxy?stats</code> | The **Statistics** endpoint produces an HTML page that provides statistical information about the current HAProxy instance, including information about current connections and load balancing activity for the HAProxy instance. You can view the statistics provided by this endpoint in your browser. |
<code>public-node:9090/haproxy?stats;csv</code> | The **Statistics CSV** endpoint provides statistical information about the current HAProxy instance and load balancing activity as comma-separated values (CSV). In CSV format, the information can be consumed by other tools. For example, this endpoint produces the results used in the `zdd.py` script. |
<code>public-node:9090/_haproxy_health_check</code> | The **Health check** endpoint returns 200 OK if HAProxy is healthy. |
<code>public-node:9090/_haproxy_getconfig</code> | The **Configuration** endpoint returns the current HAProxy configuration file (`haproxy.cfg`) for an HAPProxy instance. This endpoint returns the configuration used when the HAProxy instance was started. The endpoint is implemented by the `getconfig.lua` script. |
<code>public-node:9090/_haproxy_getvhostmap</code> | The **Virtual-host-to-backend** endpoint returns the HAProxy virtual host to backend map if the `--haproxy-map` flag is enabled. If you are not using the `--haproxy-map` option, the endpoint returns an empty string. The endpoint is implemented by the `getmaps.lua` script. |
<code>public-node:9090/_haproxy_getappmap</code> | The **App-ID-to-backend** endpoint returns the HAProxy application identifier to backend map. Like `_haproxy_getvhostmap`, this endpoint requires you to enable the `--haproxy-map` option and returns an empty string otherwise. The endpoint is also implemented by the `getmaps.lua` script. |
<code>public-node:9090/_haproxy_getpids</code> | The **Process identifiers** endpoint returns the PIDs for all HAProxy instances within the current process namespace. The endpoint literally returns the output of $(`pidof haproxy`). The endpoint is implemented by the `getpids.lua` script. This endpoint is also used by the `zdd.py` script to determine if connections have finished draining during a deployment. |
<code>public-node:9090/_mlb_signal/hup</code> | The **Reload configuration** endpoint sends a SIGHUP signal to the Edge-LB process, causing it to fetch the running apps from Marathon and reload the `HAProxy` configuration. |
<code>public-node:9090/_mlb_signal/usr1</code> | The **Restart configuration** endpoint sends a `SIGUSR1` signal to the Edge-LB process, causing it to restart the `HAProxy` load balancer with the existing configuration, without checking Edge-LB for changes. |
