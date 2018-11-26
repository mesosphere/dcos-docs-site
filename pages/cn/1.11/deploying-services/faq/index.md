---
layout: layout.pug
navigationTitle: 常见问题
title: 常见问题
menuWeight: 120
excerpt: 关于部署 Marathon 服务的常见问题

enterprise: false
---


我们收集了一些关于 DC/OS 使用情况的常见问题。有您想查看的新问题？ 使用`Contribute`本页顶部的按钮提出问题或看看您是否也可以 [贡献](https://dcos.io/contribute/) 答案。

## 为什么我的 Marathon 应用程序卡在等待环节？

这种情况最常发生在当启动应用程序的系统要求高于任何可通过 Mesos 向 Marathon 提供的邀约的时候。部署最终将失败；如果您希望部署成功，请检查系统要求并为应用程序增加资源。

## 为什么我的 Marathon 应用程序发布在专用代理上，而非在公共代理上？

默认应用程序在专用节点上启动。如需更多信息，请参阅 [文档][5]。

## Marathon 应用程序中的服务端口是什么意思？

服务端口是指在通过代理或负载均衡器系统使用自动应用程序发现时，分配到应用程序的的全局唯一端口，如 [服务发现和负载均衡][1] 中所述。

## 为什么不能启动更多任务？ 我的集群中有免费资源。

最常见的原因是请求了集群中不可用的端口或资源角色。任务无法启动，除非它们找到具有所需端口的代理，并且它们不接受不包含其已接受资源角色的邀约。

## 如何将更多代理自动添加到集群？

DC/OS 无法自动启动新节点以响应硬件的负载，除非云提供商自动扩展组已被配置为备用主机并 `dcos_install.sh` 放置在备用节点上。这是一个复杂的过程，需要和云提供商 (AWS、GCE、Azure) 一起设立自动扩展组并在每个节点上放置安装文件。[此处](/cn/1.11/deploying-services/scale-service/) 提供概述。如需设立，请联系 Mesosphere 服务支持，获得更多指导。

## 服务发现的最佳实践是什么？

Marathon 中的 [服务发现][2] 有对一些服务发现常见实施的综合概述。

## 我的集群是否可以跨越不同云提供商？

目前不支持。如需更多信息，请参阅 [本文档](/cn/1.11/installing/production/advanced-configuration/configuring-zones-regions/)。

## 如何将文件上传到 Spark 驱动器/执行器？

以下示例展示了应该启动以使其工作的命令：


 dcos spark run --submit-args='--conf spark.mesos.uris=https://path/to/pi.conf --class JavaSparkPiConf https://path/to/sparkPi_without_config_file.jar /mnt/mesos/sandbox/pi.conf' 

更多信息：

 > --conf spark.mesos.uris=... Mesos 启动驱动器或执行器时，URI 的逗号分隔列表就会下载到沙盒。这一情况同时适用于粗粒度和细粒度模式。

 > /mnt/mesos/sandbox/pi.conf 您的主类作为第 0 个参数接收到的下载文件路径（参见下面的代码片段）。/mnt/mesos/sandbox/ 是映射到相应 mesos 任务沙盒的容器内的标准路径。

## 安装工具如何工作？

DC/OS 通过使用动态生成的设置文件安装到您的环境。此文件通过使用在配置过程中设置的特定参数生成。此安装文件包含 Bash 安装脚本和 Docker 容器，其中载有部署自定义 DC/OS 构建所需的所有要素。

如需更多信息，请参阅安装 [文档](/cn/1.11/installing/)。

## 建议使用什么版本的内核、本地操作系统、Docker 引擎、联合加载？

我们建议使用 CoreOS，搭配 Docker、文件系统和其他设置的正确版本和可信默认值。

[1]: /1.11/networking/load-balancing-vips/
[2]: /1.11/networking/
[4]: https://support.mesosphere.com/hc/en-us/articles/206474745-How-to-reserve-resources-for-certain-frameworks-in-Mesos-cluster-
[5]: /1.11/administering-clusters/convert-agent-type/
