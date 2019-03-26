---
layout: layout.pug
navigationTitle: Path-based routing
title: Path-based routing
menuWeight: 21
excerpt: How to configure path-based routing for Edge-LB
enterprise: true
---

This section provides code examples that illustrate how to set Edge-LB pool configuration options for path-based routing of inbound traffic.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Path-based routing
This pool configures a load balancer which sends traffic to the `httpd` backend unless the path begins with `/nginx`, in which case it sends traffic to the `nginx` backend. The path in the request is rewritten before getting sent to nginx.

```json
{
  "apiVersion": "V2",
  "name": "path-routing",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "httpd",
        "map": [{
          "pathBeg": "/nginx",
          "backend": "nginx"
        }]
      }
    }],
    "backends": [{
      "name": "httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    },{
      "name": "nginx",
      "protocol": "HTTP",
      "rewriteHttp": {
        "path": {
          "fromPath": "/nginx",
          "toPath": "/"
        }
      },
      "services": [{
        "mesos": {
          "frameworkName": "marathon",
          "taskName": "bridge-nginx"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```
# Modifying path values
The following examples illustrate how the path would be changed for different `fromPath` and `toPath` values:

* `fromPath: "/nginx"`, `toPath: ""`, request: `/nginx` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, request: `/nginx` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, request: `/nginx/` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, request: `/nginx/index.html` -> `/index.html`
* `fromPath: "/nginx"`, `toPath: "/"`, request: `/nginx/subpath/index.html` -> `/subpath/index.html`
* `fromPath: "/nginx/"`, `toPath: ""`, request: `/nginx` -> `/nginx` (The path is not rewritten in this case because the request did not match `/nginx/`)
* `fromPath: "/nginx/"`, `toPath: ""`, request: `/nginx/` -> `/`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, request: `/nginx` -> `/subpath`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, request: `/nginx/` -> `/subpath/`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, request: `/nginx/index.html` -> `/subpath/index.html`
* `fromPath: "/nginx"`, `toPath: "/subpath/"`, request: `/nginx/index.html` -> `/subpath//index.html` (Note that for cases other than `toPath: ""` or `toPath: "/"`, it is suggested that the `fromPath` and `toPath` either both end in `/`, or neither do because the rewritten path could otherwise end up with a double slash.)
* `fromPath: "/nginx/"`, `toPath: "/subpath/"`, request: `/nginx/index.html` -> `/subpath/index.html`

We used `pool.haproxy.frontend.linkBackend.pathBeg` in this example to match on the beginning of a path. Other useful fields are:

* `pathBeg`: Match on path beginning
* `pathEnd`: Match on path ending
* `pathReg`: Match on a path regular expression
