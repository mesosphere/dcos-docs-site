---
layout: layout.pug
navigationTitle: V2 池示例
title: V2 池示例
menuWeight: 86
excerpt: 使用 V2 API 来示例 Edge-LB 池配置
enterprise: false
---

# V2 池示例

##  Marathon 应用程序和 DC/OS 服务

DC/OS 服务通常作为 Marathon 框架上的应用程序运行。要为 Marathon 应用程序创建池配置文件，您需要知道 Mesos `task` 名称和 `port` 名称。

例如，在 Marathon 应用定义的 snippet 中，`task` 名称为 `my-app`， `port` 名称为 `web`。

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

# 简单 Marathon 应用

下面是一个池配置的简单示例，用于负载均衡 Marathon 应用程序（如上述）：

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

# 基于路径的路由

该池配置负载均衡器，将流量发送到 `httpd` 后端，除非路径以 `/nginx` 开始，在这种情况下， 则将流量发送到 `nginx` 后端。请求中的路径，在发送到 nginx 之前，会被重写。

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

以下是如何针对不同的 `fromPath` 和 `toPath` 值变更路径的一些示例：

* `fromPath: "/nginx"`, `toPath: ""`, 请求： `/nginx` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, 请求： `/nginx` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, 请求： `/nginx/` -> `/`
* `fromPath: "/nginx"`, `toPath: "/"`, 请求： `/nginx/index.html` -> `/index.html`
* `fromPath: "/nginx"`, `toPath: "/"`, 请求： `/nginx/subpath/index.html` -> `/subpath/index.html`
* `fromPath: "/nginx/"`, `toPath: ""`, 请求：`/nginx`-> `/nginx` （请求不匹配，在此情况下，路径未被重写 `/nginx/`）
* `fromPath: "/nginx/"`, `toPath: ""`, 请求： `/nginx/` -> `/`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, 请求： `/nginx` -> `/subpath`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, 请求： `/nginx/` -> `/subpath/`
* `fromPath: "/nginx"`, `toPath: "/subpath"`, 请求： `/nginx/index.html` -> `/subpath/index.html`
* `fromPath: "/nginx"`, `toPath: "/subpath/"`, 请求：`/nginx/index.html`-> `/subpath//index.html` （请注意，在 `toPath: ""` 或 `toPath: "/"` 除外的情况下，建议 `fromPath` 和 `toPath` 两者都以 `/` 结束或者都不是，否则，重写后的路径会以双斜杠结束。）
* `fromPath: "/nginx/"`, `toPath: "/subpath/"`, 请求： `/nginx/index.html` -> `/subpath/index.html`

我们在此示例中使用 `pool.haproxy.frontend.linkBackend.pathBeg`，以匹配路径的开始部分。其他有用的字段包括：

* `pathBeg`：匹配路径开始部分
* `pathEnd`：匹配路径结束部分
* `pathReg`：匹配路径正则表达式

# 内部（东/西）负载均衡

有时需要或必须使用 Edge-LB 来负载均衡 DC/OS 集群内部的流量。这也可以通过 [Minuteman VIP] 进行(/latest/networking/load-balancing-vips)，但如果需要第 7 层功能，则 Edge-LB 可以针对仅内部流量进行配置。

必要的变更包括：

* 将 `pool.haproxy.stats.bindPort`、`pool.haproxy.frontend.bindPort` 更改为在至少一个专用代理上可用的端口。
* 将 `pool.role` 更改为除 `slave_public`（默认）以外的内容。通常， `"*"` 会运行，除非您为此目的创建了单独的角色。

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

# 内部静态 DNS、VIP 和地址

内部地址（例如，由 Mesos-DNS、Spartan、Minuteman VIP 生成的地址）可使用 `pool.haproxy.backend.service.endpoint.type: "ADDRESS"` 与 Edge-LB 一起在集群外暴露 。

还应注意，这并不总是一个好主意。使用不安全的端点将安全的内部服务暴露给外部世界可能很危险，使用此功能时请牢记这一点。

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

# Mesos 框架和 DC/OS 服务

对于运行不受 Marathon（例如，Kafka broker 等等）管理的任务的 Mesos 框架和 DC/OS 服务，使用 `pool.haproxy.backend.service.mesos` 对象以适当筛选和选择 mesos 任务。

```json
{
  "apiVersion": "V2",
  "name": "services-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 1025,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "kafka-backend"
      }
    }],
    "backends": [{
      "name": "kafka-backend",
      "protocol": "HTTP",
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

用于在 `pool.haproxy.backend.service.mesos` 中选择框架和任务的其他有用字段：

* `frameworkName`：精确匹配
* `frameworkNamePattern`：正则表达式
* `frameworkID`：精确匹配
* `frameworkIDPattern`：正则表达式
* `taskName`：精确匹配
* `taskNamePattern`：正则表达式
* `taskID`：精确匹配
* `taskIDPattern`：正则表达式

使用 VHOSTS 的主机名/SNI 路由

要将单个端口（如 80 或 443）的流量在基于主机名的情况下导向至多个后端，则使用 `pool.haproxy.frontend.linkBackend`。

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

# 加权后端服务器

要向后端服务器添加相对权重，则使用 `pool.haproxy.backend.service.endpoint.miscStr` 字段。在以下示例中，`/app-v1` 服务会接收每 30 个请求中的 20 个请求，而 `/app-v2` 会接收每 30 个请求中剩余的 10 个请求。默认权重为 1，最大权重为 256。

这种方法可用于实施某些 canary 或 A/B 测试用例。

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

# SSL/TLS 证书

获取和使用证书有三种不同的方式：

## 自动生成的自签名证书

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

## DC/OS 密码（仅企业）

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

## 环境变量（不安全）

```json
{
 "apiVersion"："V2", 
 "name": "env-certificates", 
 "count": 1, 
 "autoCertificate": false, 
 "environmentVariables": {
 ELB_FILE_HAPROXY_CERT": " -----BEGIN CERTIFICATE-----\nfoo\n-----END CERTIFICATE-----\n-----BEGIN RSA PRIVATE KEY-----\nbar\n-----END RSA PRIVATE KEY-----\n" 
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

# 虚拟网络

在此示例中，我们创建一个将在 DC/OS overlay （被称作“dcos”）所提供的虚拟网络上启动的池。通常，通过将 `pool.virtualNetworks[].name` 设置为 CNI 网络名称，您可以在任何 CNI 网络上启动池。

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
