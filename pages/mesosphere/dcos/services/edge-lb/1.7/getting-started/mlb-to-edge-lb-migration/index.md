---
navigationTitle: Migrate from Marathon-LB to Edge-LB
title: Migrate from Marathon-LB to Edge-LB
menuWeight: 18
excerpt: Demonstrates how to migrate from Marathon-LB to Edge-LB Auto Pools
---

# Before you begin
You must have:
* The Edge-LB API server installed as described in the Edge-LB
  [installation instructions](/mesosphere/dcos/services/edge-lb/1.7/getting-started/installing).
* The DC/OS command-line interface (CLI) installed and configured to
  communicate with the DC/OS&trade; cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS cluster with at least one DC/OS
  **private agent** node to run the load-balanced service and at least two
  DC/OS **public agent** nodes for exposing the load-balanced service.
* Marathon-LB installed as described in the Marathon-LB
  [installation instructions](/mesosphere/dcos/services/marathon-lb/1.14/mlb-install).

# Migrating from Marathon-LB to Edge-LB Auto Pools

Edge-LB Auto Pools and Marathon-LB both support exposing services based on task
labels. While Marathon-LB only supports Marathon Applications, Edge-LB Auto
Pools supports all Mesos tasks.

## Label Support
Marathon-LB supports a mix of high-level labels and low-level labels where
haproxy configuration sections are inserted directly from the label. The
ability to override any section of the haproxy configuration, while powerful,
is fragile and error prone. As such, Edge-LB does not support haproxy override
directly from labels. Instead, an Edge-LB [`pool`](https://link/to/pool) object
is generated from the labels, and processed as any other Edge-LB pool.

Some advanced configurations that were possible with Marathon-LB soley with task
labels containing portions of haproxy configurations are still possible with
Edge-LB Auto Pools. However, because the haproxy configuration is decoupled
from the label processing, it requires an edge-lb administrator to modify the
template for the pool that the Auto Pool creates.

Since Edge-LB Auto Pools and Marathon-LB labels do not overlap, it is possible
to transition to Edge-LB Auto Pools by adding the new labels (preserving the
existing Marathon-LB labels) and testing the Edge-LB Auto Pools configuration
while Marathon-LB continues to serve traffic as usual.

## Label Mapping

The following table Marathon-LB iterates the common Marathon-LB labels and their
conterpart label for Edge-LB Auto Pools.

[//]: # (The labels in each should link to the label docs for mlb and elb)

| Marathon-LB | Edge-LB Auto Pools | Notes |
| --- | --- | --- |
| `HAPROXY_0_BALANCE` | `edgelb.<group>.backend.balance` | |
| `HAPROXY_0_ENABLED` | `edgelb.expose` | Must be set for Edge-LB Auto Pools |
| `HAPROXY_GROUP` | `edgelb.template` | |
| `HAPROXY_0_HTTP_BACKEND_PROXYPASS_PATH` | `edgelb.<group>.backend.rewriteHttp.path` | |
| `HAPROXY_0_HTTP_BACKEND_REVPROXY_PATH` | `edgelb.<group>.backend.rewriteHttp.path` | |
| `HAPROXY_0_MODE` | `edgelb.<group>.frontend.protocol` | |
| `HAPROXY_0_PATH` | `edgelb.<group>.frontend.rules` | `pathBeg` key in rules|
| `HAPROXY_0_PORT` | `edgelb.<group>.frontend.port` | |
| `HAPROXY_0_REDIRECT_TO_HTTPS` | `edgelb.<group>.frontend.redirectToHttps` | |
| `HAPROXY_0_SSL_CERT` | `edgelb.<group>.frontend.certificates` | |
| `HAPROXY_0_STICKY` | `edgelb.<group>.backend.rewriteHttp.sticky` | |
| `HAPROXY_0_VHOST` | `edgelb.<group>.frontend.rules` | `hostEq` key in rules |


## Migrating an NGINX site from Marathon-LB to Edge-LB

Since the labels for Edge-LB Auto Pools and Marathon-LB do not overlap, it is
possible to migration from one to the other without any downtime.

The following task defines a task that is exposed out via Marathon-LB with
the domain `example.com`:

```json
{
  "id": "/nginx",
  "labels": {
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST": "example.com"
  },
  "container": {
    "portMappings": [ {
      "containerPort": 80,
      "hostPort": 0,
      "protocol": "tcp",
      "name": "web"
      }],
    "type": "MESOS",
    "docker": {"image": "nginx"}
  },
  "cpus": 0.1,
  "instances": 1,
  "mem": 128
}
```

Assuming the IP of the Marathon-LB instance is `192.0.2.2`, the `--resolve`
parameter to `curl` can inject this IP and send the correct host header
for vHosting:

```sh
curl --resolve example.com:80:192.0.2.2 http://example.com
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

The Edge-LB Auto Pools labels cannot be added to the task:

```json
{
  "id": "/nginx",
  "labels": {
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST": "example.com",
    "edgelb.expose": "true",
    "edgelb.web.frontend.rules": "hostEq:example.com"
  },
  "container": {
    "portMappings": [ {
      "containerPort": 80,
      "hostPort": 0,
      "protocol": "tcp",
      "name": "web"
      }],
    "type": "MESOS",
    "docker": {"image": "nginx"}
  },
  "cpus": 0.1,
  "instances": 1,
  "mem": 128
}
```

Shortly after the labels being added to the task, Edge-LB will automatically
start the `auto-default` pool:

```sh
dcos edgelb list
  NAME          APIVERSION  COUNT  ROLE          PORTS
  auto-default  V2          1      slave_public
```

The Edge-LB CLI can also show the endpoints for the pool:

```sh
dcos edgelb endpoints auto-default
  NAME                 PORT  INTERNAL IPS   EXTERNAL IPS
  frontend_0.0.0.0_80  80    172.16.40.219  192.0.2.103
  stats                1025  172.16.40.219  192.0.2.103
Public/private IPs metadata is inaccurate in case of pools that use virtual networks.
```

Using the `--resolve` parameter to curl to inject the correct host header, the
Edge-LB endpoint can be validated to be functional:

```sh
curl --resolve example.com:80:192.0.2.103 http://example.com
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

At this point the task is being exposed through Edge-LB and Marathon-LB at the
same time. Now a standard DNS migration can be performed:

1. Lower the TTL for `A` record for `example.com` to 300 seconds.
2. Wait 48 hours, or the time specified in the `SOA` TTL, whichever is greater
3. Change the `A` record for `example.com` to point to the Edge-LB endpoint, and
   optionally, reset the TTL back to its desired or original value.
4. Within 5 minutes, traffic will start flowing through Edge-LB instead of
   Marathon-LB.

Once traffic has been migrated over, the Marathon-LB labels can be removed from
the task:

```json
{
  "id": "/nginx",
  "labels": {
    "edgelb.expose": "true",
    "edgelb.web.frontend.rules": "hostEq:example.com"
  },
  "container": {
    "portMappings": [ {
      "containerPort": 80,
      "hostPort": 0,
      "protocol": "tcp",
      "name": "web"
      }],
    "type": "MESOS",
    "docker": {"image": "nginx"}
  },
  "cpus": 0.1,
  "instances": 1,
  "mem": 128
}
```
