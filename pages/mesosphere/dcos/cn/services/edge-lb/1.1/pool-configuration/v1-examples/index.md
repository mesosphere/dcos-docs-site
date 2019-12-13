---
layout: layout.pug
navigationTitle: V1 池示例
title: V1 池示例
menuWeight: 81
excerpt: 使用 V1 API 来示例 Edge-LB 池配置
enterprise: false
---

# V1 池示例

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

如果您不确定应用程序的 Mesos 任务名称，请在<cluster-url>`https:///mesos` 查看 Mesos Wed 界面

下面是一个池配置的简单示例，用于负载均衡 Marathon 应用程序（如上述）：

```json
{
  "pools": [{
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
        "servers": [{
          "framework": {
            "value": "marathon"
          },
          "task": {
            "value": "my-app"
          },
          "port": {
            "name": "web"
          }
        }]
      }]
    }
  }]
}
```

## SSL/TLS 证书

获取和使用证书有三种不同的方式：

### 自动生成自签名证书

```json
{
  "pools": [
    {
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
        "backends": [
          {
            "name": "host-httpd",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "host-httpd"
                },
                "port": {
                  "name": "web"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### DC/OS 密码

```json
{
  "pools": [
    {
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
        "backends": [
          {
            "name": "host-httpd",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "host-httpd"
                },
                "port": {
                  "name": "web"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 环境变量（不安全）

```json
{
 "pools": [
    {
 "name": "sample-certificates", 
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
 "backends": [
          {
 "name": "host-httpd", 
 "protocol": "HTTP", 
 "servers": [
              {
 "framework": {
 "value": "marathon" 
                },
 "task": {
 "value": "host-httpd" 
                },
 "port": {
 "name": "web" 
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## 虚拟网络

在此示例中，我们创建一个将在 DC/OS overlay （被称作“dcos”）所提供的虚拟网络上启动的池。通常，通过将 `pool.virtualNetworks[].name` 设置为 CNI 网络名称，您可以在任何 CNI 网络上启动池。

```json
{
  "pools": [
    {
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
        "frontends": [
          {
            "bindPort": 80,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "vnet-be"
            }
          }
        ],
        "backends": [
          {
            "name": "vnet-be",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "my-vnet-app"
                },
                "port": {
                  "name": "my-vnet-port"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```
