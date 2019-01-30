---
layout: layout.pug
navigationTitle: 负载平衡和暴露服务
title: 负载平衡和暴露服务
menuWeight: 10
excerpt: 教程 - 负载平衡 DC/OS 服务
enterprise: false
---

本教程演示如何负载均衡 DC/OS 服务，并将其设置为在集群外部进行访问。

## 先决条件

* 遵照 [Edge-LB 安装指南] 安装 Edge-LB(/services/edge-lb/1.1/installing) 指令。
* DC/OS CLI 已安装并配置为与 DC/OS 集群进行通信，并且 `edgelb` 已安装 CLI 包。
* 至少有一个 DC/OS 专用代理节点来运行负载均衡服务（更多最好）。
* 至少一个 DC/OS 公用代理节点。

1. 创建包含服务的 Marathon 应用程序定义。我们将称之为 `ping.json`。它将启动一个实例。

   ```json
   {
     "id": "/ping",
     "cpus": 0.1,
     "mem": 32,
     "instances": 1,
     "cmd": "echo \"pong\" > index.html && python -m http.server $PORT0",
     "container": {
       "type": "DOCKER",
       "docker": {
         "image": "python:3"
       }
     },
     "healthChecks": [{
       "protocol": "MESOS_HTTP",
       "path": "/",
       "portIndex": 0,
       "gracePeriodSeconds": 5,
       "intervalSeconds": 10,
       "timeoutSeconds": 10,
       "maxConsecutiveFailures": 3
     }],
     "portDefinitions": [{
       "protocol": "tcp",
       "port": 0,
       "name": "pong"
     }],
     "requirePorts": true
   }
   ```

1. 部署服务。

   ```bash
   dcos marathon app add ping.json
   ```

1. 创建一个 [池配置](/cn/services/edge-lb/1.1/pool-configuration/) 名称 `sample-minimal.json`。

   ```json
   {
     "apiVersion": "V2",
     "name": "sample-minimal",
     "count": 1,
     "haproxy": {
       "frontends": [{
         "bindPort": 80,
         "protocol": "HTTP",
         "linkBackend": {
           "defaultBackend": "ping-backend"
         }
       }],
       "backends": [{
         "name": "ping-backend",
         "protocol": "HTTP",
         "services": [{
           "marathon": {
             "serviceID": "/ping"
           },
           "endpoint": {
             "portName": "pong"
           }
         }]
       }]
     }
   }
   ```

1. 部署 Edge-LB 配置。

   ```bash
   dcos edgelb create sample-minimal.json
   ```

1. 部署池和服务之后，在 `http:// 访问 `host-httpd` 服务。<public-ip>/`.

 您可以通过以下命令找到 Edge-LB 负载均衡器正在运行的节点的专用 IP（已配置 DC/OS）：

   ```
   dcos edgelb endpoints sample-minimal
   ```

 然后，您可以使用此信息来确定您想用来访问负载均衡器的公用 IP。您还可以使用此技术来发现集群的公用 IP 地址：[查找公用代理 IP](/cn/1.11/administering-clusters/locate-public-agent/)。
