---
layout: layout.pug
navigationTitle:  Marathon-LB
title: Marathon-LB
menuWeight: 80
excerpt: Marathon-LB 基于 HAProxy，是快速代理和负载均衡器。
enterprise: false
---

Marathon-LB 基于 HAProxy，是快速代理和负载均衡器。HAProxy 为基于 TCP 和 HTTP 的应用程序提供代理和负载均衡，具有 SSL 支持、HTTP 压缩、健康检查、Lua 脚本等特性。Marathon-LB 订阅 Marathon 事件总线，并实时更新 HAProxy 配置。



您可以使用各种拓扑配置 Marathon-LB。以下是您如何使用 Marathon-LB 的一些示例：

* 使用 Marathon-LB 作为边缘负载均衡器和服务发现机制。您可以在面向公共的节点上运行 Marathon-LB 来路由 ingress 流量。对于内部或外部 DNS 记录，您将在 A 记录中使用面向公共的节点的 IP 地址（取决于您的使用情况）。
* 使用 Marathon-LB 作为内部 LB 和服务发现机制，使用单独的 HA 负载均衡器来路由入口公共流量。例如，您可以使用预置的外部 F5 负载均衡器，或者在 Amazon Web Services 上的弹性负载均衡器。
* 严格使用 Marathon-LB 作为内部负载均衡器和服务发现机制。
* 您也可能想要组合使用内部和外部负载均衡器，同时在不同的负载均衡器上使用不同的服务。

我们在此讨论 Marathon-LB 作为边缘负载均衡器，以及内部和外部负载均衡器。

## Marathon-LB 作为边缘负载均衡器

![lb1](/1.10/img/lb1.png)

图 1. Marathon-LB 作为负载均衡器

## Marathon-LB 作为内部和外部负载均衡器

![lb7](/1.10/img/lb7.jpg)

图 2. Marathon-LB 作为内部和外部负载均衡器

## 了解更多
有关 Marathon-LB 的更多信息，请访问 GiThub 页面。

 * [Marathon-LB GiThub 项目][1]
 * [详细模板文档][2]


[1]:https://github.com/mesosphere/marathon-lb
[2]:https://github.com/mesosphere/marathon-lb/blob/master/Longhelp.md#templates
