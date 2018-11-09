---
layout: layout.pug
navigationTitle: Interactive Spark Shell
excerpt: Running Spark commands interactively in the Spark shell
title: Interactive Spark Shell
menuWeight: 90
model: /services/spark/data.yml
render: mustache
---


您可以在 {{ model.techShortName }} shell 中交互式地运行 {{ model.techShortName }}。{{ model.techShortName }} shell 在 Scala、Python 和 R 中都有提供。

1. [使用 `dcos task exec`启动长期运行的交互式 bash 会话](https://dcos.io/docs/1.9/monitoring/debugging/cli-debugging/task-exec/#launch-a-long-running-interactive-bash-session)。

1. 从互动式 bash 会话中，拉动并运行 {{ model.techShortName }} Docker 镜像。

 docker pull mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6

 docker run -it --net=host mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 /bin/bash

1. 从 Docker 镜像中运行 Scala {{ model.techShortName }} shell。

 ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

 或，运行 Python {{ model.techShortName }} shell。

 ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

 或,运行 R {{ model.techShortName }} shell。

 ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

 **注意：** 通过前往此处查找您的内部领导者 IP： `<dcos-url>/mesos`。内部领导者 IP 列在左上角。

1. 交互式运行 {{ model.techShortName }} 命令。

 在 Scala shell 中：

 val textFile = sc.textFile("/opt/spark/dist/README.md")
 textFile.count()

 在 Python shell 中：

 textFile = sc.textFile("/opt/spark/dist/README.md")
 textFile.count()

 在 R shell 中：

 df <- as.DataFrame(faithful)
 head(df)
