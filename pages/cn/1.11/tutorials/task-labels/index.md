---
layout: layout.pug
navigationTitle: 标记任务和作业
title: 标记任务和作业
menuWeight: 5
excerpt: 教程 - 使用 DC/OS Web 界面和 Marathon HTTP API 定义标签

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs-site -->
<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

本教程说明如何使用 DC/OS Web 界面和 Marathon HTTP API 定义标签，以及如何根据标签值条件查询与正在运行的应用程序和作业有关的信息。

在 DC/OS 集群中部署应用程序、容器或作业时，可以将标记或标签与部署的组件相关联，以跟踪和报告这些组件对集群的使用情况。例如，您可能希望为 Mesos 应用程序分配大消耗量标识符或客户编号，并在月末生成总结报告，其中包含使用情况度量，例如大消耗量应用或客户分配给应用程序的 CPU 和内存量。

# 将标签分配给应用程序和任务

您可以从 DC/OS CLI 为任务附加标签。您可以指定多个标签，但每个标签只能有一个值。

## DC/OS CLI

您还可以在应用定义的 `labels` 参数中指定标签值。

 vi myapp.json

    {
 "id": “myapp”，
 "cpus": 0.1，
 "mem": 16.0、
 "ports": [
 0
        ],
 "cmd": "/opt/mesosphere/bin/python3 -m http.server $PORT0", 
 "instances": 2, 
 "labels": {
 "COST_CENTER": “0001”
        }
    }

然后，从 DC/OS CLI 部署：

```bash
dcos marathon app add <myapp>.json
```

# 将标签分配给作业

您可以通过 DC/OS Web 界面的 **Jobs** 选项卡或 DC/OS CLI 为作业附加标签。您可以指定多个标签，但每个标签只能有一个值。

## DC/OS Web 界面

从 DC/OS Web 界面中单击 **Jobs** 选项卡，然后单击作业名称。这将带您进入单独的作业页面。单击右上角的 **Edit**。在“编辑作业”页面左侧，选择 **Labels**。

![作业标签](/cn/1.11/img/job-label.png)

图 1. 分配作业标签

## DC/OS CLI

您还可以在作业定义的 `labels` 参数中指定标签值。

 vi myjob.json

     ```json
        {
          "id": "my-job",
          "description": "A job that sleeps",
          "labels": {
            "department": "marketing"
          },
          "run": {
            "cmd": "sleep 1000",
            "cpus": 0.01,
            "mem": 32,
            "disk": 0
          }
        }
     ```

然后，从 DC/OS CLI 部署：

```bash
dcos job add <myjob>.json
```

# 显示标签信息


部署并启动应用程序后，您可以通过 DC/OS UI 的 **Services** 选项卡按标签进行筛选。您还可以使用 DC/OS CLI 中的 Marathon HTTP API，根据标签值条件查询正在运行的应用程序。

下面的代码片段显示了向 Marathon HTTP API 发出的 HTTP 请求。此示例中使用 curl 程序提交 HTTP GET 请求，但您可以使用任何能够发送 HTTP GET/PUT/DELETE 请求的程序。您可以看到 HTTP 端点是 `https://52.88.210.228/marathon/v2/apps`，以及随 HTTP 请求发送的参数包括标签条件 `?label=COST_CENTER==0001`：

 curl --insecure \
 > https://52.88.210.228/marathon/v2/apps?label=COST_CENTER==0001 \
 > | python -m json.tool | more

您还可以指定多个标签条件，如下所示：`?label=COST_CENTER==0001,COST_CENTER==0002`

在以上示例中，您收到的响应将仅包括具有定义值为 `0001` 的 `COST_CENTER` 的应用程序。还包括资源度量标准，例如 CPU 共享数和分配的内存量。在响应的底部，您可以看到部署此应用程序的日期/时间，可用于计算计费或退费目的的正常运行时间。
