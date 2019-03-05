---
layout: layout.pug
navigationTitle: Configuring Edge-LB
title: Configuring Edge-LB
menuWeight: 20
excerpt: Provides examples for the most common required and optional Edge-LB configuration settings
enterprise: false
---

This section provides code examples that illustrate how to set Edge-LB pool configuration options using the Edge-LB REST API with application definitions and sample pool configuration settings.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and hae previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/installing/) instructions.

# Using Edge-LB for a sample Marathon application
DC/OS services typically run as applications on the Marathon framework. To create a pool configuration file for a Marathon application, you need to know the Mesos `task` name and `port` name. With this information, you can then configure an Edge-LB pool to handle load balancing for that Marathon appllication.

## Identify the task and port for an app
The following code snippet is an excerpt from a sample Marathon app definition. For this sample app definition:
* the `task` name is `my-app`
* the `port` name is `web`

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

## Configure load balancing for the sample app
After you identify a Marathon application task name and port, you can create a pool configuration for load balancing that app definition. 

1. Create an Edge-LB pool configuration file and name it `app-lb.json`.

    The following code provides a simple example of how to configure an Edge-LB pool named `app-lb` with a pool configuration file named `app-lb.json` to do load balancing for the sample Marathon application:

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

1. Upload the pool configuration to Edge-LB by running the following command:

    ```bash
    dcos edgelb create app-lb.json
    ```

1. Create a Marathon application definition containing the service and name it `my-app.json`. For example:

    ```json
    {
        "id": "/my-app",
        "cmd": "/start $PORT0",
        "instances": 1,
        "cpus": 0.1,
        "mem": 32,
        "container": {
            "type": "DOCKER",
            "docker": {
                "image": "mesosphere/httpd"
            }
        },
        "portDefinitions": [
            {
                "name": "web",
                "protocol": "tcp",
                "port": 0
            }
        ],
        "healthChecks": [
            {
                "portIndex": 0,
                "path": "/",
                "protocol": "HTTP"
            }
        ]
    }
    ```

1. Deploy the service by running the following command:

    ```bash
    dcos marathon app add my-app.json
    ```

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

# Internal (East / West) load balancing
In most cases, load balancing for traffic inside of a DC/OS cluster--referred to **internal** or **East-West** load balancing--is managed through the DC/OS layer-4 load-balancer (`dcos-l4lb`), which is part of the networking layer (`dcos-net`) of the DC/OS platform. With the DC/OS layer-4 load-balancer, you configure load balancing through [virtual IP addresses](/latest/networking/load-balancing-vips) in app definitions without creating a separate load balancing configuration file.

In some cases, however, you might find it desirable or necessary to use Edge-LB for load balancing the traffic inside of a DC/OS cluster. For example, if you need layer-7 load balancing capability at the application level for traffic within the cluster, you can configure an Edge-LB pool to handle load balancing for internal-only traffic.

The following changes necessary are:

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

# Using static DNS and virtual IP addresses

Internal addresses, such as those generated by Mesos-DNS, Spartan, or the DC/OS layer-4 load-balancer (`dcos-l4lb`) can be exposed outside of the cluster with Edge-LB by using `pool.haproxy.backend.service.endpoint.type: "ADDRESS"`.

Keep in mind that exposing secured internal services to the outside world using an insecure endpoint can make your cluster vulnerable to attack. To mitigate the risk involved when using this feature, you should ensure access to internal endopoints is strictly regulated and monitored.

The following code sample illustrates the Edge-LB pool configuration for a static IP address resolved by Mesos-DNS.

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

# Using Edge-LB with other frameworks and data services

You can use Edge-LB load balancing for frameworks and data services that run tasks not managed by Marathon. For example, you might have tasks managed by Kafka brokers or Cassandra. For tasks that run under other frameworks and data services, you can use the `pool.haproxy.backend.service.mesos` object to filter and select tasks for load balancing.

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

# Using host name and SNI routing with VHOSTS

To direct traffic based on the host name to multiple backends for a single port (such as 80 or 443), use `pool.haproxy.frontend.linkBackend`.

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
          "hostReg": ".*.httpd.example.com",
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
          "hostReg": ".*.httpd.example.com",
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

# Setting weighted values for backend servers

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

# Using SSL/TLS certificates

There are three different ways to get and use a certificate for secure communication. You can use:
- Self-signed or trusted certificates as part of a public key infrastructure (PKI). 
- Secrets stored as encrypted files in the DC/OS vault.
- Environment variables stored as secrets in the DC/OS vault.

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

# Using virtual networks

The following example creates a pool that will be launched on the virtual network provided by DC/OS overlay called "dcos". In general, you can launch a pool on any CNI network, by setting `pool.virtualNetworks[].name` to the CNI network name.

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
