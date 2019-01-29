---
layout: layout.pug
navigationTitle: V2 Pool Examples
title: V2 Pool Examples
menuWeight: 86
excerpt: Example Edge-LB pool configurations using the V2 API


enterprise: false
---

# V2 Pool Examples

## Marathon Apps and DC/OS Services

DC/OS services are typically run as applications on the Marathon framework. To create a pool configuration file for a Marathon application, you will need to know the Mesos `task` name and `port` name.

For example, in the following snippet of a Marathon app definition, the `task` name is `my-app` and the `port` name is `web`.

```json
{
  "id": "/my-app",
  ...
  "portDefinitions": [
    {
      "name": "web",
      "protocol": "tcp",
      "port": 0
    }
  ]
}
```

# Simple Marathon Application

Below is a simple example of a pool configuration for load-balancing a Marathon application like the one above:

```json
{
  "apiVersion": "V2",
  "name": "app-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "app-backend"
      }
    }],
    "backends": [{
      "name": "app-backend",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-app"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

# Path Based Routing

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

Here are some examples of how the path would be changed for different `fromPath` and `toPath` values:

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

# Internal (East / West) Load Balancing

Sometimes it is desired or necessary to use Edge-LB for load balancing traffic inside of a DC/OS cluster. This can also be done using [Minuteman VIPs](/latest/networking/load-balancing-vips/), but if you need layer 7 functionality, Edge-LB can be configured for internal only traffic.

The changes necessary are:

* Change the `pool.haproxy.stats.bindPort`, `pool.haproxy.frontend.bindPort` to some port that is available on at least one private agent.
* Change the `pool.role` to something other than `slave_public` (the default). Usually `"*"` works unless you have created a separate role for this purpose.

```json
{
  "apiVersion": "V2",
  "name": "internal-lb",
  "role": "*",
  "count": 1,
  "haproxy": {
    "stats": {
      "bindPort": 15001
    },
    "frontends": [{
      "bindPort": 15000,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "app-backend"
      }
    }],
    "backends": [{
      "name": "app-backend",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-app"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

# Internal Static DNS, VIPs, and Addresses

Internal addresses such as those generated by Mesos-DNS, Spartan, or Minuteman VIPs can be exposed outside of the cluster with Edge-LB by using `pool.haproxy.backend.service.endpoint.type: "ADDRESS"`.

It should also be noted that this is not always a good idea. Exposing secured internal services to the outside world using an insecure endpoint can be dangerous, keep this in mind when using this feature.

```json
{
  "apiVersion": "V2",
  "name": "dns-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "app-backend"
      }
    }],
    "backends": [{
      "name": "app-backend",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "myapp.marathon.l4lb.thisdcos.directory",
          "port": 555
        }
      }]
    }]
  }
}
```

# Mesos Frameworks and DC/OS Services

For Mesos frameworks and DC/OS services that run tasks which are not managed by Marathon such as Kafka brokers, etc., use the `pool.haproxy.backend.service.mesos` object to filter and select mesos tasks appropriately.

```json
{
  "apiVersion": "V2",
  "name": "services-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 1025,
      "protocol": "TCP",
      "linkBackend": {
        "defaultBackend": "kafka-backend"
      }
    }],
    "backends": [{
      "name": "kafka-backend",
      "protocol": "TCP",
      "services": [{
        "mesos": {
          "frameworkName": "beta-confluent-kafka",
          "taskNamePattern": "^broker-*$"
        },
        "endpoint": {
          "port": 1025
        }
      }]
    }]
  }
}
```

Other useful fields for selecting frameworks and tasks in `pool.haproxy.backend.service.mesos`:

* `frameworkName`: Exact match
* `frameworkNamePattern`: Regular expression
* `frameworkID`: Exact match
* `frameworkIDPattern`: Regular expression
* `taskName`: Exact match
* `taskNamePattern`: Regular expression
* `taskID`: Exact match
* `taskIDPattern`: Regular expression

# Hostname / SNI Routing with VHOSTS

To direct traffic based on the hostname to multiple backends for a single port (such as 80 or 443), use `pool.haproxy.frontend.linkBackend`.

```json
{
  "apiVersion": "V2",
  "name": "vhost-routing",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "map": [{
          "hostEq": "nginx.example.com",
          "backend": "nginx"
        },{
          "hostReg": "*.httpd.example.com",
          "backend": "httpd"
        }]
      }
    },{
      "bindPort": 443,
      "protocol": "HTTPS",
      "linkBackend": {
        "map": [{
          "hostEq": "nginx.example.com",
          "backend": "nginx"
        },{
          "hostReg": "*.httpd.example.com",
          "backend": "httpd"
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

# Weighted Backend Servers

To add relative weights to backend servers, use the `pool.haproxy.backend.service.endpoint.miscStr` field. In the example below, the `/app-v1` service will receive 20 out of every 30 requests, and `/app-v2` will receive the remaining 10 out of every 30 requests. The default weight is 1, and the max weight is 256.

This approach can be used to implement some canary or A/B testing use cases.

```json
{
  "apiVersion": "V2",
  "name": "app-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "default"
      }
    }],
    "backends": [{
      "name": "default",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/app-v1"
        },
        "endpoint": {
          "portName": "web",
          "miscStr": "weight 20"
        }
      },{
        "marathon": {
          "serviceID": "/app-v2"
        },
        "endpoint": {
          "portName": "web",
          "miscStr": "weight 10"
        }
      }]
    }]
  }
}
```

# SSL/TLS certificates

There are three different ways to get and use a certificate:

## Automatically generated self-signed certificate

```json
{
  "apiVersion": "V2",
  "name": "auto-certificates",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$AUTOCERT"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

## DC/OS Secrets (Enterprise Only)

```json
{
  "apiVersion": "V2",
  "name": "secret-certificates",
  "count": 1,
  "autoCertificate": false,
  "secrets": [
    {
      "secret": "mysecret",
      "file": "mysecretfile"
    }
  ],
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$SECRETS/mysecretfile"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

## Environment variables (Insecure)

```json
{
  "apiVersion": "V2",
  "name": "env-certificates",
  "count": 1,
  "autoCertificate": false,
  "environmentVariables": {
    "ELB_FILE_HAPROXY_CERT": "-----BEGIN CERTIFICATE-----\nfoo\n-----END CERTIFICATE-----\n-----BEGIN RSA PRIVATE KEY-----\nbar\n-----END RSA PRIVATE KEY-----\n"
  },
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$ENVFILE/ELB_FILE_HAPROXY_CERT"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

# Virtual Networks

In this example we create a pool that will be launched on the virtual network provided by DC/OS overlay called "dcos". In general you can launch a pool on any CNI network, by setting `pool.virtualNetworks[].name` to the CNI network name.

```json
{
  "apiVersion": "V2",
  "name": "vnet-lb",
  "count": 1,
  "virtualNetworks": [
    {
      "name": "dcos",
      "labels": {
        "key0": "value0",
        "key1": "value1"
      }
    }
  ],
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "vnet-be"
      }
    }],
    "backends": [{
      "name": "vnet-be",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-vnet-app"
        },
        "endpoint": {
          "portName": "my-vnet-port"
        }
      }]
    }]
  }
}
```
