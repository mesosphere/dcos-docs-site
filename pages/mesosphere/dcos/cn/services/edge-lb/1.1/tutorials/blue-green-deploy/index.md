---
layout: layout.pug
navigationTitle: 蓝色/绿色服务更新
title: 蓝色/绿色服务
menuWeight: 30
excerpt: 教程 - 使用蓝色/绿色部署
enterprise: false
---

蓝色/绿色部署是通过运行两个版本的相同服务（“蓝色”和“绿色”版本）实现零停机时间的方法，并且有负载均衡器在两个版本之间进行切换。

蓝色/绿色部署允许您拥有两个完全缩放的服务版本。如果一个出现错误，您可以通过调整负载均衡器快速切换到另一个。

### 使用案例：服务升级

1. `web-server` 服务有“蓝色”和“绿色”版本正在运行，负载均衡器将流量成功路由到“蓝色”版本。
1. Edge-LB 配置已更新，将流量路由到“绿色”版本，“绿色”服务的日志中开始发生错误。
1. 通过将 Edge-LB 恢复到原始配置，可使部署快速回滚。

# 先决条件

* Edge-LB CLI 已安装。

  ```
  dcos package install edgelb --cli
  ```

* 对于两个完全部署的服务，DC/OS 集群上的容量足够。

# 部署示例

以下是最小的 Edge-LB 配置、`sample-minimal.json`，可负载均衡“svc-blue”。

```json
{
  "apiVersion": "V2",
  "name": "sample-config",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "svc"
      }
    }],
    "backends": [{
      "name": "svc",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/svc-blue"
          },
          "endpoint": {
            "portName": "web"
          }
      }]
    }]
  }
}
```

复制示例服务并将其命名为 `svc-blue.json`。

```json
{
    "id": "/svc-blue",
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

再复制一份示例服务并将其命名为 `svc-green.json`。

```json
{
    "id": "/svc-green",
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

1. 将配置上传到 Edge-LB。

   ```
   dcos edgelb create sample-minimal.json
   ```

1. 启动服务“svc-blue”。

   ```bash
   dcos marathon app add svc-blue.json
   ```

1. 现在，"svc-blue" 暴露在 `http://<public-ip>/`.

1. 通过部署“svc-green”，启动蓝色/绿色部署。

   ```bash
   dcos marathon app add svc-green.json
   ```

1. 如果 `svc-green` 启动并且健康运行，则通过更改以下内容来修改 Edge-LB 配置以指向 `svc-green`：

   ```json
   {
     ...
     "haproxy": {
       "backends": [{
         ...
         "services": [{
           "marathon": {
             "serviceID": "/svc-blue"
           },
           ...
         }]
       }]
     }
   }
   ```

 至：

   ```json
   {
     ...
     "haproxy": {
       "backends": [{
         ...
         "services": [{
           "marathon": {
             "serviceID": "/svc-green"
           },
           ...
         }]
       }]
     }
   }
   ```

6. 将修改的配置上传到 Edge-LB。

   ```
   dcos edgelb update sample-minimal.json
   ```

7. 现在，"svc-green" 暴露在 `http://<public-ip>/`.
