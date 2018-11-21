---
layout: layout.pug
navigationTitle: 快速启动
title: 度量标准快速入门
menuWeight: 0
excerpt: DC/OS 度量标准入门
beta: false
---


使用本指南开始使用 DC/OS 度量标准组件。度量标准组件天生与 DC/OS 集成，无需额外设置。

**前提条件：**

- 必须 [安装 DC/OS CLI](/cn/1.11/cli/install/) 并通过 `dcos auth login` 命令以超级用户身份登户。

1. 可选：部署一个示例 Marathon 应用程序供在本快速入门指南中使用。如果您已有任务在 DC/OS 上运行，则可以跳过此设置步骤。

 1. 创建以下 Marathon 应用定义并另存为 `test-metrics.json`。

        ```json
        {
          "id": "/test-metrics",
          "cmd": "/opt/mesosphere/bin/statsd-emitter",
          "cpus": 0.001,
          "instances": 1,
          "mem": 128
        }
        ```

 1. 使用此 CLI 命令部署该应用程序：

        ```bash
        dcos marathon app add test-metrics.json
        ```

1. 要获得运行您应用程序的节点的 Mesos ID，请在运行 `dcos task` 后执行 `dcos node`。例如：

 1. 运行 `dcos task` 表明该主机 `10.0.0.193` 在运行 Marathon 任务 `test-metrics.93fffc0c-fddf-11e6-9080-f60c51db292b`。

        ```bash
        dcos task
        NAME          HOST        USER  STATE  ID                                                  
        test-metrics  10.0.0.193  root    R    test-metrics.93fffc0c-fddf-11e6-9080-f60c51db292b  
        ```

 1. 运行 `dcos node` 表明该主机 `10.0.0.193` 拥有 Mesos ID `7749eada-4974-44f3-aad9-42e2fc6aedaf-S1`。

        ```bash
        dcos node
         HOSTNAME       IP                         ID                    
        10.0.0.193  10.0.0.193  7749eada-4974-44f3-aad9-42e2fc6aedaf-S1  
        ```

1. 查看度量标准。

 - **<a name="container-metrics"></a>特定任务的容器度量标准**

 关于特定容器的资源消耗的概述，请运行此命令：

        ```bash
        dcos task metrics summary <task-id>
        ```

 输出应类似于：

        ```bash
        CPU           MEM              DISK
        0.17 (1.35%)  0.01GiB (6.46%)  0.00GiB (0.00%)
        ```

 - **<a name="task-metrics"></a>特定任务的所有度量标准**

 要获取与任务相关的所有度量标准的详细列表，请运行此命令：

        ```bash
        dcos task metrics details <task-id>
        ```
 输出是容器资源利用率和工作负载传输的度量标准的组合。例如：

        ```bash
        NAME                                                   VALUE
        cpus.limit                                             0.10
        cpus.system.time                                       0.07
        cpus.throttled.time                                    34.75
        cpus.user.time                                         0.18
        disk.limit                                             0.00GiB
        disk.used                                              0.00GiB
        mem.limit                                              0.16GiB
        mem.rss                                                0.01GiB
        mem.swap                                               0.00GiB
        mem.total                                              0.01GiB
        statsd_tester.time.uptime                              4469331
        ```

 CPU、磁盘和内存统计来自 Mesos 提供的容器数据。statsd_tester.time.uptime
 统计数据来自应用程序本身。

 - **<a name="host-metrics"></a>主机级度量标准**

 跟任务数据一样，主机级度量标准可用作摘要或详细表格。要查看主机级
 度量标准，请运行此命令：

        ```bash
        dcos node metrics details <mesos-id>
        ```

 输出将包含关于节点上可用资源及其利用率的统计数据。例如：

        ```bash
        NAME                       VALUE      TAGS
        cpu.cores                  4
        cpu.idle                   99.56%
        cpu.system                 0.09%
        cpu.total                  0.34%
        cpu.user                   0.25%
        cpu.wait                   0.01%
        filesystem.capacity.free   134.75GiB  path: /
        filesystem.capacity.total  143.02GiB  path: /
        filesystem.capacity.used   2.33GiB    path: /
        filesystem.inode.free      38425263   path: /
        filesystem.inode.total     38504832   path: /
        filesystem.inode.used      79569      path: /
        load.15min                 0
        load.1min                  0
        load.5min                  0
        memory.buffers             0.08GiB
        memory.cached              2.41GiB
        memory.free                12.63GiB
        memory.total               15.67GiB
        process.count              175
        swap.free                  0.00GiB
        swap.total                 0.00GiB
        swap.used                  0.00GiB
        system.uptime              28627
        ```

 - **<a name="script-metrics"></a>度量标准的有计划使用**

 所有 dcos-cli 度量标准命令都可以与 `--json` 一起运行，用于脚本。例如：

        ```bash
        dcos node metrics summary <mesos-id> --json
        ```

 输出将显示所有相同的数据，但以 JSON 格式显示，以方便解析：

        ```json
        [
          {
            "name": "cpu.total",
            "timestamp": "2018-04-09T23:46:16.834008315Z",
            "value": 0.32,
            "unit": "percent"
          },
          {
            "name": "memory.total",
            "timestamp": "2018-04-09T23:46:16.834650407Z",
            "value": 16830304256,
            "unit": "bytes"
          },
          {
            "name": "memory.free",
            "timestamp": "2018-04-09T23:46:16.834650407Z",
            "value": 13553008640,
            "unit": "bytes"
          },
          {
            "name": "filesystem.capacity.total",
            "timestamp": "2018-04-09T23:46:16.834373702Z",
            "value": 153567944704,
            "tags": {
              "path": "/"
            },
            "unit": "bytes"
          },
          {
            "name": "filesystem.capacity.used",
            "timestamp": "2018-04-09T23:46:16.834373702Z",
            "value": 2498990080,
            "tags": {
              "path": "/"
            },
            "unit": "bytes"
          }
        ]
        ```
