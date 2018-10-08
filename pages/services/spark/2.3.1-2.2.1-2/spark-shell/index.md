---
layout: layout.pug
navigationTitle: Interactive Spark Shell
excerpt: Running Spark commands interactively in the Spark shell
title: Interactive Spark Shell
menuWeight: 90
model: /services/spark/data.yml
render: mustache
---


You can run {{ model.techShortName }} commands interactively in the {{ model.techShortName }} shell. The {{ model.techShortName }} shell is available in Scala, Python, and R.

1. [Launch a long-running interactive bash session using `dcos task exec`](https://dcos.io/docs/1.9/monitoring/debugging/cli-debugging/task-exec/#launch-a-long-running-interactive-bash-session).

1. From your interactive bash session, pull and run a {{ model.techShortName }} Docker image.

        docker pull mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6

        docker run -it --net=host mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 /bin/bash

1. Run the Scala {{ model.techShortName }} shell from within the Docker image.

        ./bin/spark-shell --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

    Or, run the Python {{ model.techShortName }} shell.

        ./bin/pyspark --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

    Or, run the R {{ model.techShortName }} shell.

        ./bin/sparkR --master mesos://<internal-leader-ip>:5050 --conf spark.mesos.executor.docker.image=mesosphere/spark:1.0.9-2.1.0-1-hadoop-2.6 --conf spark.mesos.executor.home=/opt/spark/dist

    **Note:** Find your internal leader IP by going to `<dcos-url>/mesos`. The internal leader IP is listed in the upper left hand corner.

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
