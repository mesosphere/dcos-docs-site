---
layout: layout.pug
navigationTitle: Spark Shell
excerpt: Running commands interactively in the Apache Spark shell
title: Interactive Spark Shell
menuWeight: 90
render: mustache
model: /mesosphere/dcos/services/spark/data.yml
---

# Interactive {{ model.techShortName }} shell

You can run {{ model.techShortName }} commands interactively in the {{ model.techShortName }} shell. The {{ model.techShortName }} shell is available in Scala, Python, and R.

1. Launch a long-running interactive `bash` session using [`dcos task exec`](/mesosphere/dcos/latest/cli/command-reference/dcos-task/dcos-task-exec/).

1. From your interactive `bash` session, pull and run a {{ model.techShortName }} Docker image.

      ```bash
      docker pull mesosphere/spark:2.12.0-3.0.1-scala-2.12-hadoop-3.2
      docker run -it --net=host mesosphere/spark:2.12.0-3.0.1-scala-2.12-hadoop-3.2 /bin/bash
      ```

1. Run the {{ model.techShortName }} shell from within the Docker image.

    For the Scala {{ model.techShortName }} shell:

      ```bash
      ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.12.0-3.0.1-scala-2.12-hadoop-3.2 --conf spark.mesos.executor.home=/opt/spark/dist
      ```

    For the Python {{ model.techShortName }} shell:

      ```bash
      ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.12.0-3.0.1-scala-2.12-hadoop-3.2 --conf spark.mesos.executor.home=/opt/spark/dist
      ```

    For the R {{ model.techShortName }} shell:

      ```bash
      ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.12.0-3.0.1-scala-2.12-hadoop-3.2 --conf spark.mesos.executor.home=/opt/spark/dist
      ```

    <p class="message--note"><strong>NOTE: </strong>Find your internal leader IP by going to <code>dcos-url/mesos</code>. The internal leader IP is listed in the upper left hand corner.</p>

1. Run {{ model.techShortName }} commands interactively.

    In the Scala shell:

      ```scala
      val textFile = sc.textFile("/opt/spark/dist/README.md")
      textFile.count()
      ```

    In the Python shell:

      ```python
      textFile = sc.textFile("/opt/spark/dist/README.md")
      textFile.count()
      ```

    In the R shell:

      ```R
      df <- as.DataFrame(faithful)
      head(df)
      ```
