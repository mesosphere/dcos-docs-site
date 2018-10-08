---
layout: layout.pug
navigationTitle: History Server
excerpt: Enabling HDFS for the Spark History Server
title: Spark History Server
menuWeight: 30
model: /services/spark/data.yml
render: mustache
---

DC/OS {{ model.techName }} includes the [Spark History Server][3]. Because the history server requires HDFS, you must explicitly enable it.

1.  Install HDFS:

        dcos package install hdfs

    **Note:** HDFS requires five private nodes.

1.  Create a history HDFS directory (default is `/history`). [SSH into your cluster][10] and run:

        docker run -it mesosphere/hdfs-client:1.0.0-2.6.0 bash
        ./bin/hdfs dfs -mkdir /history

1. Create `spark-history-options.json`:

        {
          "service": {
            "hdfs-config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
          }
        }

1. Install the Spark History Server:

        dcos package install spark-history --options=spark-history-options.json

1. Create `spark-dispatcher-options.json`;

        {
          "service": {
            "spark-history-server-url": "http://<dcos_url>/service/spark-history"
          },
          "hdfs": {
            "config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
          }
        }

1.  Install the Spark dispatcher:

        dcos package install spark --options=spark-dispatcher-options.json

1.  Run jobs with the event log enabled:

        dcos spark run --submit-args="--conf spark.eventLog.enabled=true --conf spark.eventLog.dir=hdfs://hdfs/history ... --class MySampleClass  http://external.website/mysparkapp.jar"

1.  Visit your job in the dispatcher at `http://<dcos_url>/service/spark/`. It will include a link to the history server entry for that job.

 [3]: http://spark.apache.org/docs/latest/monitoring.html#viewing-after-the-fact
 [10]: /latest/administering-clusters/sshcluster/
