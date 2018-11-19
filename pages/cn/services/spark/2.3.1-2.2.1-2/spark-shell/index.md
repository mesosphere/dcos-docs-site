---
layout: layout.pug
navigationTitle: 交互式 Spark Shell
excerpt: 在 Spark shell 中交互运行 Spark 命令
title: 交互式 Spark Shell
menuWeight: 90
model: /cn/services/spark/data.yml
render: mustache
---


您可以在 {{ model.techShortName }} shell 中交互式地运行 {{ model.techShortName }}。{{ model.techShortName }} shell 在 Scala、Python 和 R 中都有提供。

1. [使用 `dcos task exec`启动长期运行的交互式 bash 会话](/cn/1.11/monitoring/debugging/task-exec//#launch-a-long-running-interactive-bash-session)。

1. 从互动式 bash 会话中，拉动并运行 {{ model.techShortName }} Docker 镜像。
    ```bash
    docker pull mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6

    docker run -it --net=host mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 /bin/bash
    ```

1. 从 Docker 镜像中运行 Scala {{ model.techShortName }} shell。

    ```bash
    ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist
    ```

    或，运行 Python {{ model.techShortName }} shell。

    ```bash
    ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist
    ```
    或,运行 R {{ model.techShortName }} shell。
    ```bash
    ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist
    ```
    <p class="message--note"><strong>注意：</strong> 通过前往此处查找您的内部领导者 IP： <tt>dcos-url/mesos</tt>。内部领导者 IP 列在左上角。</p>

1. 交互式运行 {{ model.techShortName }} 命令。

    在 Scala shell 中：
    ```bash
    val textFile = sc.textFile("/opt/spark/dist/README.md")
    textFile.count()
    ```
    在 Python shell 中：
    ```bash
    textFile = sc.textFile("/opt/spark/dist/README.md")
    textFile.count()
    ```
    在 R shell 中：
    ```bash
    df <- as.DataFrame(faithful)
    head(df)
    ```
