---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


1. Install DC/OS on your cluster. See [the documentation](/1.10/installing/) for instructions.
1. If you are using open source DC/OS, install DC/OS Apache Cassandra with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for more information.
    ```
    dcos package install beta-cassandra
    ```
You can also install DC/OS Apache Cassandra from [the DC/OS web interface](/latest/usage/webinterface/).
1. The service will now deploy with a default configuration. You can monitor its deployment via the Services UI in the DC/OS Dashboard.
1. Connect a client to the DC/OS Apache Cassandra service.
    ```
    dcos beta-cassandra endpoints
    ["node"]
    dcos beta-cassandra endpoints node
    {
      "address": [
        "10.0.1.125:9042",
        "10.0.2.152:9042",
        "10.0.1.22:9042"
      ],
      "dns": [
        "node-1-server.cassandra.autoip.dcos.thisdcos.directory:9042",
        "node-0-server.cassandra.autoip.dcos.thisdcos.directory:9042",
        "node-2-server.cassandra.autoip.dcos.thisdcos.directory:9042"
      ],
      "vip": "node.cassandra.l4lb.thisdcos.directory:9042"
    }
    ```
1. Write some data to your cluster:
```
dcos node ssh --master-proxy --leader
core@ip-10-0-6-153 ~ docker run -it cassandra:3.0.14 cqlsh node-0-server.cassandra.autoip.dcos.thisdcos.directory
> CREATE KEYSPACE space1 WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };
> USE space1;
> CREATE TABLE testtable1 (key varchar, value varchar, PRIMARY KEY(key));
> INSERT INTO space1.testtable1(key, value) VALUES('testkey1', 'testvalue1');
> SELECT * FROM testtable1;
```
