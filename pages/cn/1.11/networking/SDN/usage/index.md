---
layout: layout.pug
navigationTitle: 使用 SDN
title: 使用 SDN
menuWeight: 20
excerpt: 使用软件定义的网络
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS 让您在各种基于 IP 的虚拟网络上运行容器，从而为每个容器提供自己的 IP 地址。要在虚拟网络上运行容器，您必须在带外安装 CNI 或 CNM 网络。DC/OS 本身附带自己的虚拟网络解决方案，称为 [DC/OS Overlay](/cn/1.11/networking/SDN/dcos-overlay/)，您可以用它为容器提供唯一性 IP 地址。

# 使用虚拟网络

首先，您必须 [配置虚拟网络](/cn/1.11/networking/SDN/dcos-overlay/)。虚拟网络在安装时进行配置。您必须为 `config.yaml` 中的每个网络指定一个规范名。当您的服务需要启动一个容器时，请通过该规范名来指代。要在 Marathon 应用定义中使用虚拟网络，请指定 `"network": "USER"` 属性以及表格中的 `ipAddress` 字段：`{"ipAddress": {"network": "$MYNETWORK"}}``$MYNETWORK` 的值是网络的规范名。

# 示例

以下 Marathon 应用定义指定了名为 `dcos-1` 的网络，指相同名称的目标 DC/OS 虚拟网络。

```json
{
   "id":"my-networking",
   "cmd":"env; ip -o addr; sleep 30",
   "cpus":0.10,
   "mem":64,
   "instances":1,
   "backoffFactor":1.14472988585,
   "backoffSeconds":5,
   "ipAddress":{
      "networkName":"dcos-1"
   },
   "container":{
      "type":"DOCKER",
      "docker":{
         "network":"USER",
         "image":"busybox",
         "portMappings":[
            {
               "containerPort":123,
               "servicePort":80,
               "name":"foo"
            }
         ]
      }
   }
}
```

详细了解 [Marathon] 中的端口和网络(/1.11/deploying-services/service-ports/)。
