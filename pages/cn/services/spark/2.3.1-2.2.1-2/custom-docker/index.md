---
layout: layout.pug
navigationTitle: 
excerpt: 自定义 Spark 图片 
title: 自定义 Docker 镜像
menuWeight: 95
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

<p class="message--note"><strong>注意：</strong> 支持自定义 Spark 映像 Mesosphere 提供。然而，自定义有可能对 Spark 和 DC/OS 之间的集成产生不利影响。在 Mesosphere 服务支持怀疑自定义可能对 Spark 和 DC/OS 产生不利影响的情况下，Mesosphere 服务支持可能要求客户使用未修改的
Spark 镜像再现该问题。</p>

您可以通过扩展标准 Spark Docker 镜像来自定义运行 Spark 的 Docker 镜像。这样，您可以安装自己的库，如自定义 Python 库。

1. 在您的 Dockerfile 中，从标准 Spark 镜像中延伸并添加您的自定义内容：

    ```
    FROM mesosphere/spark:1.0.4-2.0.1
    RUN apt-get install -y python-pip
    RUN pip install requests
    ```

1. 然后，从 Dockerfile 中创建镜像。
    ```
    docker build -t username/image:tag。
    docker push username/image:tag
    ```

1. 在运行 Spark 作业时，使用 `--docker-image` 选项引用您的自定义 Docker 镜像。
    ```
    dcos spark run --docker-image=myusername/myimage:v1 --submit-args="http://external.website/mysparkapp.py 30" 
    ```
