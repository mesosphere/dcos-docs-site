---
layout: layout.pug
navigationTitle: dcos edge-lb lb-config
title: dcos edge-lb lb-config
menuWeight: 24
excerpt: Reference for the dcos edge-lb lb-config command
enterprise: true
---

Use this command to show the running loa balancer configuration associated with the pool. You can view the active load balancer configuration for all load balancers in a pool.

## Usage

```bash
dcos edgelb lb-config <pool-name> [options]
```

## Options

| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--raw`           | Show unparsed load balancer configuration. |

<!-- ### Permissions -->

## Examples

The following command displays the load balancer configuration settings for the `ping-lb` pool:

```bash
dcos edgelb lb-config ping-lb
```

The command displays the `haproxy` load balancer template with content similar to the following:

```bash
global
  # Do not enable as haproxy works under a supervisor and must not fork into
  # the background:
  # daemon
  log /dev/log local0
  spread-checks 5
  max-spread-checks 15000
  maxconn 50000
  tune.ssl.default-dh-param 2048
  ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-bind-options no-sslv3 no-tlsv10 no-tls-tickets
  ssl-default-server-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-server-options no-sslv3 no-tlsv10 no-tls-tickets
  # Required to provide seamless reloads. The supervisor config for haproxy
  # adds '-W' option to enable master-worker model:
  stats socket /var/run/haproxy/socket expose-fd listeners
  server-state-file global
  server-state-base /var/state/haproxy/
  lua-load "$LBWORKDIR/haproxy/lua/getpids.lua"
  lua-load "$LBWORKDIR/haproxy/lua/getconfig.lua"
  lua-load "$LBWORKDIR/haproxy/lua/getmaps.lua"
  lua-load "$LBWORKDIR/haproxy/lua/signalmlb.lua"
defaults
  load-server-state-from-file global
  log               global
  retries                   3
  backlog               10000
  maxconn               10000
  timeout connect          3s
  timeout client          30s
  timeout server          30s
  timeout tunnel        3600s
  timeout http-keep-alive  1s
  timeout http-request    15s
  timeout queue           30s
  timeout tarpit          60s
  option            dontlognull
  option            http-server-close
  option            redispatch
  default-server resolve-prefer ipv4
  default-server init-addr last,libc,none
resolvers default_resolvers
  nameserver ns1 198.51.100.1:53
  nameserver ns2 198.51.100.2:53
  nameserver ns3 198.51.100.3:53
  hold valid           2s
  hold other           2s
  hold refused         2s
  hold nx              2s
  hold timeout         2s
  hold valid           2s
listen stats
  bind 0.0.0.0:$HAPROXY_STATS_PORT
  balance
  mode http
  stats enable
  monitor-uri /_haproxy_health_check
  acl getpid path /_haproxy_getpids
  http-request use-service lua.getpids if getpid
  acl getvhostmap path /_haproxy_getvhostmap
  http-request use-service lua.getvhostmap if getvhostmap
  acl getappmap path /_haproxy_getappmap
  http-request use-service lua.getappmap if getappmap
  acl getconfig path /_haproxy_getconfig
  http-request use-service lua.getconfig if getconfig
  acl signalmlbhup path /_mlb_signal/hup
  http-request use-service lua.signalmlbhup if signalmlbhup
  acl signalmlbusr1 path /_mlb_signal/usr1
  http-request use-service lua.signalmlbusr1 if signalmlbusr1
  frontend frontend_0.0.0.0_15001
    bind 0.0.0.0:15001
      mode http
      option httplog
      default_backend ping-backend
  backend ping-backend
    balance roundrobin
      mode http
          option forwardfor
          http-request set-header X-Forwarded-Port %[dst_port]
          http-request add-header X-Forwarded-Proto https if { ssl_fc }
            server agentip_10.0.1.128_10006 10.0.1.128:10006 check
```
