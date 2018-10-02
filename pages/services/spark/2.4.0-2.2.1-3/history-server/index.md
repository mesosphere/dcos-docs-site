---
layout: layout.pug
navigationTitle: History Server
excerpt: Enabling the Spark History Server
title: History Server
model: /services/spark/data.yml
render: mustache
menuWeight: 30

---

DC/OS {{ model.techName }} includes The [{{ model.techShortName }} History Server][3]. Because the history server requires HDFS, you must explicitly enable it.

# Installing HDFS 

1.  Install HDFS:

        dcos package install hdfs

  <p class="message--note"><strong>NOTE: </strong>HDFS requires five private nodes.</p>

1.  Create a history HDFS directory (default is `/history`). [SSH into your cluster][10] and run:

        docker run -it mesosphere/hdfs-client:1.0.0-2.6.0 bash
        ./bin/hdfs dfs -mkdir /history

1. Create `{{ model.serviceName }}-history-options.json`:

        {
          "service": {
            "hdfs-config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
          }
        }

# Installing {{ model.techShortName }} History Server

1. To install the {{ model.techShortName }} History Server:

        dcos package install {{ model.serviceName }}-history --options={{ model.serviceName }}-history-options.json

1. Create `{{ model.serviceName }}-dispatcher-options.json`;

        {
          "service": {
            "{{ model.serviceName }}-history-server-url": "http://<dcos_url>/service/{{ model.serviceName }}-history"
          },
          "hdfs": {
            "config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
          }
        }

1.  Install the {{ model.techShortName }} dispatcher:

        dcos package install {{ model.serviceName }} --options={{ model.serviceName }}-dispatcher-options.json

1.  Run jobs with the event log enabled:

        dcos {{ model.serviceName }} run --submit-args="--conf {{ model.serviceName }}.eventLog.enabled=true --conf spark.eventLog.dir=hdfs://hdfs/history ... --class MySampleClass  http://external.website/mysparkapp.jar"

# Confirm History Server installation

Visit your job in the dispatcher at `http://<dcos_url>/service/{{ model.serviceName }}/`. It will include a link to the history server entry for that job.

 [3]: http://spark.apache.org/docs/latest/monitoring.html#viewing-after-the-fact
 [10]: /latest/administering-clusters/sshcluster/
