---
layout: layout.pug
navigationTitle: Exposing DC/OS Monitoring using EdgeLB
title: Exposing DC/OS Monitoring using EdgeLB
menuWeight: 30
excerpt: Exposing DC/OS Monitoring using EdgeLB
render: mustache
model: ../data.yml
---

If you are expecting high traffic on the Prometheus and/or Grafana interfaces it is recommended to expose {{ model.techName }} over edge-lb. Without it, AdminRouter can limit the capabilities of Grafana.

Exposing Grafana over Edge-LB is a twofold process:

- Configure {{ model.techName }} to disable AdminRouter proxy
- Configure an Edge-LB Pool to expose the Grafana service
 
# Prerequisites

- DC/OS 1.12 or later.
- [DC/OS CLI](/mesosphere/dcos/latest/cli/install/) is installed.
- [Edge-LB](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing/) is installed.
- [Edge-LB Service Account](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing/#create-a-service-account) configured (in case of DC/OS Enterprise)
- You are logged in as a superuser.

# Disable AdminRouter proxy on {{ model.techName }}

It is important to disable AdminRoute proxy on Grafana service of {{ model.techName }}. Failing to do so will cause invalid URL redirects when viewing the published service.

To disable the AdminRouter proxy on {{ model.techName }} you should (re-)deploy it with the `admin_router_proxy` option set to `false`.

For example, your `options.json` should include the following option:
```json
{
  "grafana": {
    "admin_router_proxy": false
  }
}
```

# Crate an Edge-LB Pool

To expose the `grafana` service via Edge-LB we are going to create an Edge-LB pool that exposes the `dcos-monitoring/grafana` task under a designated port.

For example, to expose `grafana` on the public agent's port `15002`, crate the following `grafana-lb-pool.json` file with the following contents:

```json
{
  "apiVersion": "V2",
  "name": "grafana-lb",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 15002,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "grafana-backend"
        }
      }
    ],
    "backends": [
      {
        "name": "grafana-backend",
        "protocol": "HTTP",
        "services": [
          {
            "mesos": {
              "frameworkName": "dcos-monitoring",
              "taskNamePattern": "^grafana-.*$"
            },
            "endpoint": {
              "port": 3000
            }
          }
        ]
      }
    ]
  }
}
```

Then crate the pool using:

```sh
dcos edgelb create grafana-lb-pool.json
```

If you follow the principle of least-privilege when installing Edge-LB you should **also** grant the following permission to the Edge-LB principal:

```sh
dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools/grafana-lb full
```

# Viewing Grafana from Outside

You can query the public endpoints of the pool from Edge-LB using:

```sh
dcos edgelb endpoints grafana-lb
```

You can then access Grafana from:

```
http://<EXTERNAL IP>:<PORT>
```

