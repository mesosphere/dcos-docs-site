---
layout: layout.pug
navigationTitle: 使用 CPU 和内存自动扩展 Marathon 服务
title: 教程 - 使用 CPU 和内存的自动扩展 Marathon 服务
menuWeight: 0
excerpt: 使用 CPU 和内存自动扩展 Marathon 服务

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

#include /cn/include/tutorial-disclaimer.tmpl


您可以使用 Python 服务 `marathon-autoscale.py` 根据 Mesos 报告的利用率指标自动扩展您的 Marathon 应用程序。您可以从 DC/OS 群集中运行此服务。`marathon-autoscale.py` 旨在演示在 DC/OS 上运行服务时可能出现的情况。

`marathon-autoscale.py` 将定期监控组成指定 Marathon 服务的所有任务的总 CPU 和内存利用率。达到阈值时，`marathon-autoscale.py` 将增加您 Marathon 服务的任务数量。

**先决条件**

* [正在运行的 DC/OS 群集][1]。
* 您希望自动扩展的在 Marathon 上运行的服务。
* Python 3
* Git：
 * **macOS**从 [Git 下载](http://git-scm.com/download/mac)获取安装程序。
 * **Unix/Linux**：请参阅这些 [安装说明](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。

# 在节点上安装 Marathon Autoscale 应用程序

通过 SSH 连接到您将运行 `marathon-autoscale.py` 并安装它的系统。

1. SSH 到您要运行的节点`marathon-autoscale.py`，其中节点 ID（`<mesos-id>`）是您要运行该应用程序的节点。

    ```bash
    dcos node ssh --master-proxy --mesos-id=<mesos-id>
    ```

    运行 `dcos node` 以获取可用的节点 ID。

1. 将 [autoscale Github r存储库](https://github.com/mesosphere/marathon-autoscale) 克隆到您的节点。

    ```bash
    git clone https://github.com/mesosphere/marathon-autoscale.git
    ```

# 运行 Autoscale 应用程序

1. 导航至 `marathon-autoscale` 存储库：

    ```bash
    cd marathon-autoscale
    ```

1. 输入此命令以运行应用程序：

    ```bash
    python marathon-autoscale.py
    ```

    系统将提示您查看以下参数：

    ```bash
    # Fully qualified domain name or IP of the Marathon host (without http://).
    Enter the DNS hostname or IP of your Marathon Instance : ip-**-*-*-***
    # The name of the Marathon app to autoscale (without "/").
    Enter the Marathon Application Name to Configure Autoscale for from the Marathon UI : testing
    # The percentage of average memory utilization across all tasks for the target Marathon app before scaleout is triggered.
    Enter the Max percent of Mem Usage averaged across all Application Instances to trigger Autoscale (ie. 80) : 5
    # The average CPU time across all tasks for the target Marathon app before scaleout is triggered.
    Enter the Max percent of CPU Usage averaged across all Application Instances to trigger Autoscale (ie. 80) : 5
    # 'or' or 'and' determines whether both CPU and memory must be triggered or just one or the other.
    Enter which metric(s) to trigger Autoscale ('and', 'or') : or
    # The number by which current instances will be multiplied. This determines how many instances to add during scaleout.
    Enter Autoscale multiplier for triggered Autoscale (ie 1.5) : 2
    # The ceiling for the number of instances to stop scaling out EVEN if thresholds are crossed.
    Enter the Max instances that should ever exist for this application (ie. 20) : 10
    ```

欲了解更多信息，请参阅 [Marathon-Autoscale GitHub](https://github.com/mesosphere/marathon-autoscale) 存储库。

 [1]: /cn/1.12/installing/
