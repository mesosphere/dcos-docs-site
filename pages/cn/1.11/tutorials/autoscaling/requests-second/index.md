---
layout: layout.pug
navigationTitle: 每秒请求
title: 教程 - 使用每秒请求自动扩展
menuWeight: 1
excerpt: 根据每秒请求设置 microscaling
enterprise: false
---

<p class="message--warning"><strong>免责声明：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</p>

您可以使用 [marathon-lb-autoscale](https://github.com/mesosphere/marathon-lb-autoscale) 应用程序通过 Marathon 实施基于速率的自动扩展。marathon-lb-autoscale 应用程序与使用 TCP 流量的任何应用程序一起工作，并可通过 HAProxy 进行路由。

`marathon-lb-autoscale` 从所有 HAProxy 实例收集数据，以确定应用程序当前的 RPS（每秒请求数）。自动扩展控制器随后尝试维持每个服务实例每秒定义的目标请求数。 `marathon-lb-autoscale` 对 Marathon 进行 API 调用 以扩展应用程序。

有关更多信息，请参阅 [Marathon-LB Reference](/cn/services/marathon-lb/mlb-reference/)。
