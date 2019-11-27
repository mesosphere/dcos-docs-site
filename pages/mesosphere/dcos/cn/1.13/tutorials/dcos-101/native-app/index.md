---
layout: layout.pug
navigationTitle: 部署和公开本地应用程序
title: 部署和公开本地应用程序
excerpt: 使用 UCR 容器部署应用程序，并将其公开以便从群集外部进行访问（第 8 部分）
menuWeight: 8
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
在[上一教程](/mesosphere/dcos/1.13/tutorials/dcos-101/app1/)中，您部署了一个在群集内部运行并与另一个也在群集内运行的应用程序（Redis 服务）进行交互的应用程序。两个应用程序都不在群集外部公开，也不可供任何外部用户使用。这是因为 DC/OS 支持在两种不同类型的节点上运行应用程序： **专用代理节点** 和 **公共代理节点**。

到目前为止，您只能使用在专用代理节点上运行的应用程序和服务，而这些节点无法从群集外部访问。要向外部世界公开服务或应用程序，您通常使用在公共节点上运行的负载均衡器。

本教程中，您将部署另一个示例应用程序，但有一些重要的差异：
- 新示例应用程序包括向访问应用程序的用户提供基于 Web 的用户界面的表示层。
- 新示例应用程序使用不依赖于 Docker 镜像或 Docker 引擎的本地 DC/OS 容器-通用容器运行时 (UCR)，使得应用程序更易于部署，且依赖性更少，复杂性更低。
- 通过在以 Marathon-LB 为负载均衡器的公共代理节点上运行新示例应用程序，您将公开该应用程序，以便从群集外部进行访问。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您可以通过至少一个管理节点和三个代理节点来访问运行中的 [DC/OS 群集](../start-here/)。
- 您可以访问安装了 [DC/OS CLI](../cli/) 的计算机。
- 您拥有在群集中部署和运行的示例 [dcos-101/app1](/mesosphere/dcos/1.13/tutorials/dcos-101/app1/) 应用程序。

# 学习目的
完成本教程，您将学习到：
- 如何部署使用 DC/OS 通用容器运行时而不是 Docker 的应用程序。
- 如何通过使用面向公众的 IP 地址和 Marathon-LB 负载均衡器在公共代理节点上运行应用程序，使其可供群集外的客户端使用。
- 如何测试对新示例应用程序的访问。

# 查看示例应用程序
[app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) 示例应用程序是 [基于 Go](https://golang.org/) 的 HTTP 服务器，它向 Redis 公开了一个简单的接口。

如果查看 [应用定义](https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json)，您可以发现该示例应用程序是一个没有任何外部依赖关系的二进制程序。因为它没有外部依赖关系，所以您可以使用 DC/OS 本地通用容器运行时 (UCR) 容器对其进行部署。

# 部署示例应用程序
1. 通过运行以下命令部署示例应用程序：

    ```bash
    dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json
    ```

    或者，您可以从 DC/OS 基于 Web 的管理控制台部署示例应用程序。
    
1. 通过运行以下命令以列出所有 DC/OS 任务，验证新的示例应用程序是否已成功部署：

    ```bash
    dcos task
    ```

    命令将返回类似于以下内容的输出：

    ```bash
    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    app2.dcos-101   10.0.1.127  root    R    dcos-101_app2.instance-d86ffa58-8935-11e9-a1c1-4a501e74c1fd._app.1   dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a
    ```

    您还可以通过运行以下命令以列出所有 Marathon 应用程序，来验证成功部署：

    ```bash
    dcos marathon app list
    ID               MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                       
    /dcos-101/app2   128    1     1/1    N/A       ---      False       N/A     chmod u+x app2 && ./app2  
    ```

1. 通过连接到主导管理节点并运行客户端 URL (`cURL`) 命令，从群集中测试 HTTP 服务器：

    ```bash
    dcos node ssh --master-proxy --leader
    curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000
    ```

    该 `cURL` 命令返回来自 app2 的 Web 服务器的原始 HTML 响应，输出类似于以下内容：

    ```
    <html><title>Welcome to DC/OS 101!</title><body><h1>Welcome to DC/OS 101!</h1><h1>Running on node '10.0.1.127' and port '26962' </h1><h1>Add a new key:value pair</h1><form action="/save" method="POST"><textarea name="key">Key</textarea><br><textarea name="value">Value</textarea><br><input type="submit" value="Save"></form></body></html>
    ```

    从群集中访问应用程序并查看原始 HTML 响应证明该应用程序正在运行。但是，对于本教程，您还希望向公众公开应用程序。在本教程的下一部分，您将完全做到这一点。

1. 关闭用于查看示例应用程序的原始 HTML 响应的管理节点上的会话。

# 安装负载均衡器
公共代理节点允许来自群集以外客户端的入站访问请求。公共代理通过负载均衡器暴露于外部世界。对于本教程，您将安装 [Marathon-LB](/mesosphere/dcos/services/marathon-lb/) 作为负载均衡器，为群集内部运行的应用程序提供外部访问。

1. 通过运行以下命令安装 Marathon-LB：

    ```bash
    dcos package install marathon-lb --yes
    ```

1. 通过运行以下命令验证 Marathon-LB 是否已成功部署：

    ```bash
    dcos task

    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    app2.dcos-101   10.0.1.127  root    R    dcos-101_app2.instance-d86ffa58-8935-11e9-a1c1-4a501e74c1fd._app.1   dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a  
    marathon-lb     10.0.7.218  root    R    marathon-lb.instance-0ffbfc6c-8942-11e9-a1c1-4a501e74c1fd._app.1     dedbb786-feb7-47f2-ae69-27bf86ba53fb-S1  aws/us-west-2  aws/us-west-2a  
    redis-tutorial  10.0.1.127  root    R    redis-tutorial.instance-97dae2d7-8934-11e9-a1c1-4a501e74c1fd._app.1  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a
    ``` 

    如果您的群集使用云提供程序（如 AWS），则 <code>dcos 任务</code>可能会显示主机的专用 IP 地址，该地址无法从群集外部解析。但是，使用 `dcos task` 命令的输出，您可以确定分配给 `marathon-lb` 任务的专用 IP。在本示例中，专用 IP 地址为 10.0.7.218。

1. 通过运行以下命令，确定 Marathon-LB 正在使用的公共代理节点的 IP 地址：

    ```bash
    dcos node list
    ```

    命令将返回类似于以下内容的信息：

    ```
    HOSTNAME         IP       PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
    10.0.7.218     10.0.7.218  34.214.200.181  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S1  agent            aws/us-west-2  aws/us-west-2a  
    10.0.1.127     10.0.1.127                  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  agent            aws/us-west-2  aws/us-west-2a  
    master.mesos.  10.0.7.173  34.219.206.248  dedbb786-feb7-47f2-ae69-27bf86ba53fb     master (leader)  aws/us-west-2  aws/us-west-2a  
    ```

    从 `dcos node list` 命令的输出中，您可以看到与 `marathon-lb` 任务运行所在的专用 IP 地址相对应的公共 IP 地址。在本示例中，Marathon-LB 服务的公共 IP 地址为 34.214.200.181。

# 使用公共 IP 地址连接
1. 使用公共 IP 地址和端口 10000 从您的本地计算机连接到 Web 应用程序。例如：`34.214.200.181:10000`。

    您应该看到一个简单的 web 页面表单，类似于：

    ![app2 网页示例](/mesosphere/dcos/1.13/img/tutorial-webpage.png)

1. 添加新密钥并添加新值，然后使用示例应用程序基于 Web 的前端单击 **保存**。

1. 通过运行 `dcos task log app1` 命令，使用 `app1` 示例应用程序验证密钥总数。

1. 通过运行 `dcos task`，复制 Redis 服务返回的 Mesos ID，然后打开运行 Redis 服务的节点上的安全外壳来直接检查 Redis。

    例如，如果 `dcos task` 输出显示 Redis 任务 `Mesos ID` 列的 `dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0`，您可以使用以下方式连接到节点：

    ```bash
    dcos node ssh --master-proxy --mesos-id=dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0
    ```
    
    连接到代理节点之后，执行以下操作：
    - 使用 `docker ps` 为代理列出 Docker 容器。
    
    - 从 `docker ps` 命令输出中复制 Redis 任务的 ContainerID 。
    
    - 使用上一命令的 ContainerID 在 Docker 容器中创建 `bash` 会话：
    
    ```bash
    sudo docker exec -i -t CONTAINER_ID  /bin/bash
    ```
    
    - 通过在 bash shell 中运行 `redis-cli` 来启动 Redis CLI。
    
    - 检查您通过运行 `get <newkey>` 命令所添加的密钥值。

# 后续步骤
祝贺您！您已部署使用本地 DC/OS UCR 容器的示例应用程序，使用 Marathon-LB 向公众公开该应用程序，并通过使用 Web 前端向 Redis 服务添加新密钥来测试您公开可用的应用程序。

# 相关主题
DC/OS 使用[容器化工具](/mesosphere/dcos/1.13/deploying-services/containerizers/)在容器中运行任务。在容器中运行任务使您能够将任务彼此隔离并以编程方式控制任务资源。DC/OS 支持两种类型的容器化工具：

- DC/OS 通用容器化工具运行时（Universal Containerizer Runtime, UCR)
- Docker 容器化工具

此时，您已经了解到如何使用 Docker 镜像 (app1) 和使用本地通用容器化工具运行时 (app2) 部署应用程序。

对于您的第一个应用程序，您使用了 Docker 容器镜像来封装依赖关系，因此您不需要依赖代理上可用的特定程序。然后，您使用 Docker 容器化工具运行 Docker 镜像中打包的应用程序。由于 Docker 容器化工具在内部使用 [Docker 运行时间](https://docs.docker.com/engine/userguide/intro/)，因此您还使用了 Docker 运行时间。

对于您的第二个示例应用程序，您没有任何依赖关系。因为没有外部依赖关系，您可以依赖默认 DC/OS 通用容器化工具运行时。在内部，两个容器化工具运行时都使用相同的操作系统功能进行资源隔离，即[cgroups](https://en.wikipedia.org/wiki/Cgroups) 和 [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces) 。
