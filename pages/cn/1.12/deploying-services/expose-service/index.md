---
layout: layout.pug
navigationTitle: 公开服务
title: 公开服务
menuWeight: 5
excerpt: 通过 Marathon 应用定义启动服务

enterprise: false
---


DC/OS 代理节点在 [安装](/mesosphere/dcos/cn/1.12/installing/)过程中可被指定为[公共](/mesosphere/dcos/cn/1.12/overview/concepts/#public-agent-node) 或[专用](/mesosphere/dcos/cn/1.12/overview/concepts/#private-agent-node)。公共代理节点通过基础架构网络从群集外部访问 DC/OS 服务。默认情况下，服务在专用代理节点上启动，不可从群集外部访问。

若要在公共节点上启动服务，则必须通过指定的 `"acceptedResourceRoles":["slave_public"]` 参数创建 Marathon 应用程序并配置边缘负载均衡器和服务发现机制。

**先决条件：**

- DC/OS [已安装](/mesosphere/dcos/cn/1.12/installing/)
- DC/OS CLI [已安装](/mesosphere/dcos/cn/1.12/cli/install/)

1. 创建 Marathon 应用定义，并指定所需的 `"acceptedResourceRoles":["slave_public"]` 参数。例如：

    ```json
    {
       "id":"/product/service/myApp",
       "acceptedResourceRoles":[
          "slave_public"
       ],
       "instances":1,
       "cpus":0.1,
       "mem":64,
       "networks":[
          {
             "mode":"container/bridge"
          }
       ],
       "container":{
          "type":"DOCKER",
          "docker":{
             "image":"group/image"
          },
          "portMappings":[
             {
                "containerPort":8080,
                "hostPort":0
             }
          ]
       }
    }
    ```

   有关 `acceptedResourceRoles` 参数的更多信息，请参阅 Marathon API [文档](/mesosphere/dcos/cn/1.12/deploying-services/marathon-api/)。

1. 使用此命令将您的应用程序添加到 Marathon，其中 `myApp.json` 是包含 Marathon 应用定义的文件。

    ```bash
    dcos marathon app add myApp.json
    ```

   如果添加成功，则没有输出。您还可以使用 DC/OS [Web 界面](/mesosphere/dcos/cn/1.12/gui/services/) 的 **Services** 选项卡添加您的应用程序 。

1. 使用此命令验证应用程序是否已添加：

    ```bash
    dcos marathon app list
    ```

   输出应如下所示：

    ```bash
     ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
    /myApp   64  0.1    0/1    ---      scale       DOCKER   None
    ```

   您还可以使用 DC/OS [Web 界面](/mesosphere/dcos/cn/1.12/gui/services/) 的 **Services** 选项卡查看已部署的应用程序 。

1. 配置边缘负载均衡器和服务发现机制。

   - AWS 用户：如果您通过使用 [AWS CloudFormation 模板](/mesosphere/dcos/cn/1.12/installing/oss/cloud/aws/) 安装了 DC/OS，则会包含 ELB。但是，您则必须在公共 ELB 上重新配置运行状况检查，以将应用程序公开到应用定义中指定的端口（例如，端口 80）。
   - 所有其他用户：您可以使用 [Marathon-LB](/mesosphere/dcos/services/marathon-lb/)，一种基于 HAProxy 的快速代理程序和负载均衡器。

1. 转到公共代理节点，查看网站是否正在运行。有关如何查找公共代理 IP 的信息，请参阅 [文档](/mesosphere/dcos/cn/1.12/administering-clusters/locate-public-agent/)。

   您应在浏览器中看到以下消息：

   ![Hello Brave World](/mesosphere/dcos/1.12/img/helloworld.png)

   图 1. 确认页面

## 后续步骤

了解如何使用 [Marathon-LB](/mesosphere/dcos/cn/1.12/tutorials/dcos-101/marathon-lb/) 在公共节点上对应用程序进行负载均衡。
