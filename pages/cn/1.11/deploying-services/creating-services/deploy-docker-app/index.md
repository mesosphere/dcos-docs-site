---
layout: layout.pug
navigationTitle: 部署基于 Docker 的服务
title: 部署基于 Docker 的服务
menuWeight: 100
excerpt: 部署基于 Docker 的服务
enterprise: false
---


在本教程中，您将创建自定义 Docker 镜像，并将其部署到 DC/OS。

## 先决条件

* [Docker][1] 安装在您的工作站上
* [Docker Hub][2] 账户
* 已安装 [DC/OS][3]
* 已安装 [DC/OS CLI][4]

# 创建自定义 Docker 镜像

1. 创建名为 `index.html` 的文件。将以下标记粘贴到 `index.html` 并保存：

    ```html
    <html>
        <body>
        <h1> Hello brave new world! </h1>
        </body>
    </html>
    ```

1. 创建名为 `Dockerfile` 的文件。将以下 Docker 命令粘贴到其中，并保存：

    ```dockerfile
    FROM nginx:1.9
    COPY index.html /usr/share/nginx/html/index.html
    ```

1. 构建 Docker 镜像，其中 <username><username>是您的 Docker Hub 用户名：

    ```bash
    docker build -t <username>/simple-docker .
    ```

    输出应类似于：

    ```bash
    Sending build context to Docker daemon 3.072 kB
    Step 1 : FROM nginx:1.9
    1.9: Pulling from library/nginx
    51f5c6a04d83: Pull complete
    a3ed95caeb02: Pull complete
    640c8f3d0eb2: Pull complete
    a4335300aa89: Pull complete
    Digest: sha256:54313b5c376892d55205f13d620bc3dcccc8e70e596d083953f95e94f071f6db
    Status: Downloaded newer image for nginx:1.9
        ---> c8c29d842c09
    Step 2 : COPY index.html /usr/share/nginx/html/index.html
        ---> 61373621782c
    Removing intermediate container 225910aa385d
    Successfully built 61373621782c
    ```

1. 登录到 Docker Hub：

    ```bash
    docker login
    ```

1. 将图像推送到 Docker Hub，其中 `<username>` 是您的 Docker Hub 用户名：

    ```bash
    docker push <username>/simple-docker
    ```

    输出应类似于：

    ```bash
    The push refers to a repository [docker.io/<username>/simple-docker]
    6e2a0db36f4c: Pushed
    5f70bf18a086: Mounted from library/nginx
    49027b789c92: Mounted from library/nginx
    20f8e7504ae5: Mounted from library/nginx
    4dcab49015d4: Mounted from library/nginx
    latest: digest: sha256:f733e23e1f5e83a29a223d0a7d30244b30c0d57d17aa0421d962019545d69c17 size: 2185
    ```

# 创建 Docker 应用程序并部署到 DC/OS

1. 使用以下内容创建 Marathon 应用定义，并另存为 `hello-nginx.json`：在 `image` 字段，替换 `<username>在` 使用Docker Hub用户名。 在里面 `type` 领域, 指定 `字段中，按您需要的` [containerizer runtime](/cn/1.11/deploying-services/containerizers/) 指定 MESOS 要么  或 DOCKER。

    ```json
    {
      "id": "hello-nginx",
      "container": {
        "type": "[MESOS | DOCKER]",
        "docker": {
          "image": "<username>/simple-docker",
          "parameters": [
            {
              "key": "log-driver",
              "value": "none"
            }
          ]
        },
        "portMappings": [
          { "hostPort": 80, "containerPort": 80, "protocol": "tcp" }
        ]
      },
      "networks": [
        {
          "mode": "container/bridge"
        }
      ],
      "acceptedResourceRoles": ["slave_public"],
      "instances": 1,
      "cpus": 0.1,
      "mem": 64
    }
    ```

    此文件指定了一个名为 `hello-nginx` 的简单 Marathon 应用程序，该应用程序在公共节点上运行自身的一个实例。

1. 使用 DC/OS 命令将 `hello-nginx` 应用程序添加到 Marathon：

    ```bash
    dcos marathon app add hello-nginx.json
    ```

    如果添加成功，则没有输出。

1. 如果您选择了 MESOS 运行时间，在您确认添加了该应用程序时，您将看到以下内容：

    ```bash
    dcos marathon app list
    ID MEM CPUS TASKS HEALTH DEPLOYMENT WAITING CONTAINER CMD
    /hello-nginx 64 0.1 1/1 N/A --- False MESOS N/A
    ```

1. 如果您使用 [AWS CloudFormation 模板](/cn/1.11/installing/evaluation/cloud-installation/aws/) 将应用程序公开到应用定义中指定的端口（例如，端口 80），则必须在公共 ELB 上重新设置运行状况检查。
    1. 在 CloudFormation 中，勾选堆栈旁边的复选框。
    2. 单击 **Resources** 选项卡。
    3. 搜索 **PublicSlaveLoadBalancer**。
    4. 单击 Physical ID（物理 ID）列中的链接。
    5. 遵循[更新运行状况检查配置](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-healthchecks.html#update-health-check-config)中的说明。

1. 转到公共代理节点，查看网站是否正在运行。若要查找公共代理 IP 地址，请参阅[查找公共代理 IP](/cn/1.11/administering-clusters/locate-public-agent/)。

    您应在浏览器中看到以下消息：

    ![Hello Brave World](/cn/1.11/img/helloworld.png)

    图 1. Hello World 消息 

# 后续步骤

了解如何使用 [Marathon-LB](/cn/1.11/networking/marathon-lb/mlb-basic-tutorial/) 在公共节点上对应用程序进行负载均衡。


 [1]:https://www.docker.com
 [2]:https://hub.docker.com
 [3]:/cn/1.11/installing/
 [4]:/cn/1.11/cli/install/
