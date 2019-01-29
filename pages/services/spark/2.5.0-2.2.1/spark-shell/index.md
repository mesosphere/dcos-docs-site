---
layout: layout.pug
navigationTitle: Spark Shell
excerpt: Running commands interactively in the Apache Spark shell
title: Interactive Spark Shell
menuWeight: 90
render: mustache
model: /services/spark/data.yml
---

# Interactive {{ model.techShortName }} shell

You can run {{ model.techShortName }} commands interactively in the {{ model.techShortName }} shell. The {{ model.techShortName }} shell is available in Scala, Python, and R.

1. Launch a long-running interactive `bash` session using [`dcos task exec`](/1.12/cli/command-reference/dcos-task/dcos-task-exec/).

1. From your interactive `bash` session, pull and run a {{ model.techShortName }} Docker image.

        docker pull mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6

        docker run -it --net=host mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 /bin/bash

1. Run the {{ model.techShortName }} shell from within the Docker image.

    For the Scala {{ model.techShortName }} shell:

        ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.5.0-2.2.1-rc1-hadoop-2.7 --conf spark.mesos.executor.home=/opt/spark/dist

    For the Python {{ model.techShortName }} shell:

        ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.5.0-2.2.1-rc1-hadoop-2.7 --conf spark.mesos.executor.home=/opt/spark/dist

    For the R {{ model.techShortName }} shell:

        ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:2.5.0-2.2.1-rc1-hadoop-2.7 --conf spark.mesos.executor.home=/opt/spark/dist

    <p class="message--note"><strong>NOTE: </strong>Find your internal leader IP by going to <code>dcos-url/mesos</code>. The internal leader IP is listed in the upper left hand corner.</p>

1. Run {{ model.techShortName }} commands interactively.

    In the Scala shell:

        val textFile = sc.textFile("/opt/spark/dist/README.md")
        textFile.count()

    In the Python shell:

        textFile = sc.textFile("/opt/spark/dist/README.md")
        textFile.count()

    In the R shell:

        df <- as.DataFrame(faithful)
        head(df)
