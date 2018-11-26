---
layout: layout.pug
navigationTitle: CNI 插件支持
title: CNI 插件支持
menuWeight: 30
excerpt: 了解 CNI 插件支持
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


从版本 1.8 开始，DC/OS 可配合任何类型的容器网络接口 (CNI) 网络使用。使用 CNI 可以让容器在与它们运行所在的主机隔离时相互通信。

# 为 CNI 配置集群

将插件和配置文件添加到集群上的每个代理节点。参阅 [CNI 规范](https://github.com/containernetworking/cni/blob/master/SPEC.md)，进一步了解 CNI 插件和配置。

1. 将插件文件添加到 `/opt/mesosphere/active/cni/` 目录。

1. 将配置文件添加到 `/opt/mesosphere/etc/dcos/network/cni/` 目录。
 典型的配置文件看起来像这样。

   ```
   {
     "name": "dcos",
     "type": "bridge",
     "bridge": "m-dcos",
     "isGateway": true,
     "ipMasq": false,
     "mtu": 1420,
     "ipam": {
       "type": "host-local",
       "subnet": "9.0.1.0/25",
       "routes": [
         {
            "dst": "0.0.0.0/0"
         }
       ]
     }
   }
   ```
 `type` 参数指定插件的名称。此处，插件名称为 `bridge`。`name` 参数是网络的名称，您也可以稍后在服务定义中使用。

# 配置服务以使用 CNI 插件

**注意：** 您的服务必须使用 [通用容器运行时 (UCR)](/cn/1.11/deploying-services/containerizers/ucr/)。

添加 `ipAddress.networkName` 参数到服务定义。`networkName` 必须匹配在上一步中配置文件的 `name` 参数。此例中，它是 `dcos`。

```
"ipAddress": {
        "networkName": "dcos"
}
```
