---
layout: layout.pug
navigationTitle: AWS 上的高可用性负载平衡
title: AWS 上的高可用性负载平衡
menuWeight: 20
excerpt: 教程 - 设置多个负载平衡器实例
enterprise: false
---

本教程演示了如何在单个 AWS 经典负载均衡器后方的单个池中设置多个负载均衡器实例。AWS 应用负载均衡器或 AWS 网络负载均衡器可以遵循类似步骤。多个 Edge-LB 实例使您能够创建高可用性负载均衡环境，并提高吞吐量。

# 先决条件

* 遵照 [Edge-LB 安装指南] 安装 Edge-LB(/services/edge-lb/1.1/installing)。
* DC/OS CLI 已安装并配置为与 DC/OS 集群进行通信，并且 `edgelb` 已安装 CLI 包。
* 至少有一个 DC/OS 专用代理节点来运行负载均衡服务（更多最好）。
* 单个 VPC 中的多个（两个或多个）DC/OS 公用代理节点。要使用 AWS ALB 或 NLB，代理节点必须位于多个 AZ 中。
* 创建 AWS 负载均衡器的权限。

# 环境设置

1. 创建包含样本服务 `customer.json` 的 Marathon 应用程序定义。它将启动四个实例。

   ```json
   {
     "id": "/customer",
     "instances": 4,
     "cpus": 0.1,
     "mem": 32,
     "cmd": "sed -i 's:Welcome to nginx!:Customer Application:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
     "container": {
       "portMappings": [{
         "containerPort": 80,
         "hostPort": 0,
         "protocol": "tcp",
         "servicePort": 0,
         "name": "nginx-80"
       }],
       "type": "DOCKER",
       "volumes": [],
       "docker": {
         "image": "nginx"
       }
     },
     "networks": [{
       "mode": "container/bridge"
     }]
   }
   ```

1. 部署样本服务。

   ```bash
   dcos marathon app add customer.json
   ```

1. 使用具有多个负载均衡器实例的单个 Edge-LB 池创建 Edge-LB JSON 配置文件。我们将此文件称作 `multi-lb.json`。

   ```json
   {
     "apiVersion": "V2",
     "name": "multi-lb",
     "count": 2,
     "haproxy": {
       "frontends": [{
         "bindPort": 80,
         "protocol": "HTTP",
         "linkBackend": {
           "defaultBackend": "customer-backend"
         }
       }],
       "backends": [{
         "name": "customer-backend",
         "protocol": "HTTP",
         "services": [{
           "marathon": {
             "serviceID": "/customer"
           },
           "endpoint": {
             "portName": "nginx-80"
           }
         }]
       }],
       "stats": {
         "bindAddress": "0.0.0.0",
         "bindPort": 9090
       }
     }
   }
   ```

1. 部署 Edge-LB 配置。

   ```bash
   dcos edgelb create multi-lb.json
   ```

1. 导航至每个公用节点的公用 IP 地址。您应该能够看到 NGINX web 服务器初始 UI。

# 负载均衡器设置: AWS 经典负载均衡器

AWS 经典弹性负载均衡器 (Classic ELB) 支持 TCP 和 HTTP 连接。

1. 在 AWS UI 中，导航到 EC2 负载均衡器配置页面：**服务** > **计算机** > **EC2**。

1. 在左侧菜单栏的“负载均衡”部分，单击 **负载均衡器**。

1. 单击 **创建负载均衡器**。

1. 在“经典负载均衡器”下单击 **创建**。

1. 在“定义负载均衡器”页面中选择这些选项：
 * 为您的经典负载均衡器提供名称。
 * 选择实例所属的 VPC。
 * 在“负载均衡器协议”下指定这些设置：
 - 协议：HTTP
 - 负载均衡器端口：80
 - 实例协议：HTTP
 - 实例端口：80
 * 单击 `+` 每个实例所属子网旁边签名。

1. 单击 **分配安全组**。

1. 从 0.0.0.0/0 创建 TCP 端口 80 中所允许的安全组（或指定现有安全组），单击 **下一步：配置安全设置**，然后单击 **下一步：配置健康检查**。

1. 在“配置健康检查”页面，选择以下选项：
 * Ping 协议：TCP。
 * Ping 端口：80。
 * 响应超时：2. 
 * 间隔：5. 
 * 不健康阈值：2. 
 * 健康阈值：2. 

1. 单击 **下一步：添加 EC2 实例**。

1. 在“添加 EC2 实例”页面，选择与您的公用代理节点对应的实例，然后单击 **下一步：添加标签**。

1. 或者（可选），为 ELB 指定标签，以便稍后进行标识，单击 **查看和创建**，然后单击 **创建**。

在负载均衡器页面，您可以通过转到 **实例**来检查负载均衡器的状态。可能需要一些时间才能注册实例。当您的实例被正确注册后，您可以通过负载均衡器名称访问负载均衡器。

# 负载均衡器设置: AWS 应用负载均衡器/网络负载均衡器

AWS 应用负载均衡器 (ALB) 是进行 HTTP 处理的第 7 层负载均衡器；AWS 网络负载均衡器是第 4 层负载均衡器，可实现 TCP 负载均衡。在概念上，他们如下运行：

- ALB：HTTP 负载均衡器：HTTP 连接在 ALB 上终止。
- NLB：TCP 负载均衡器：HTTP 连接在 EC2 实例本身上终止（在此情况下，是直接在 Edge-LB 负载均衡器实例上）。

两者的配置大致相同：

1. 在 AWS UI 中，导航到 EC2 负载均衡器配置页面：**服务** > **计算机** > **EC2**。

1. 在左侧菜单栏的“负载均衡”部分，单击 **负载均衡器**。

1. 单击 **创建负载均衡器**。

1. 在“应用负载均衡器”（或“网络负载均衡器”）下单击 `Create`。

1. 在“配置负载均衡器”页面，选择以下选项：
 * 为您的应用负载均衡器（或网络负载均衡器）提供名称。
 * 选择 **internet-facing** 和 **ipv4**。
 * 在 **Listeners** 部分，指定 **HTTP**和 **80**（或网络负载均衡器的 **TCP**）。
 * 选择实例所属的 VPC，然后选择实例所属的子网。

1. 单击 **下一步：配置安全设置**，然后单击 **下一步：配置安全组**。

1. 从 0.0.0.0/0 创建 TCP 端口 80 中所允许的安全组（或指定现有安全组），然后单击 **下一步：配置路由**。

1. 在“配置路由”页面，选择以下内容：
 * 目标组：新目标组。
 * 名称：（为目标组指定名称）。
 * 协议：HTTP（或网络负载均衡器的 TCP）。
 * 端口：80。
 * 目标类型：实例。
 * 健康检查：协议：HTTP（或网络负载均衡器的 TCP）。
 * 健康检查：路径： /. 

1. 单击 **注册目标**。

1. 选择您的实例，单击 **添加至已注册**，然后单击 **下一步：审阅**，然后单击 **创建**。

您需要稍等一下。您的实例将通过新生成的负载均衡器中的 DNS 名称提供。
