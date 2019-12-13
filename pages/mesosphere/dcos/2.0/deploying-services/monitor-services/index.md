---
layout: layout.pug
navigationTitle:  Monitoring Services
title: Monitoring Services
menuWeight: 3
excerpt: Monitoring deployed DC/OS services from the CLI and UI
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


You can monitor deployed DC/OS services from the CLI and UI.

# Monitoring {{ model.packageRepo }} services

## CLI

From the DC/OS CLI, enter the `dcos service` command. In this example you can see the installed DC/OS services Chronos, HDFS, and Kafka.

```bash
dcos service
NAME      HOST             ACTIVE  TASKS CPU   MEM     DISK   ID
chronos   <privatenode1>   True     0    0.0    0.0     0.0   <service-id1>
hdfs      <privatenode2>   True     1    0.35  1036.8   0.0   <service-id2>
kafka     <privatenode3>   True     0    0.0    0.0     0.0   <service-id3>
```

## UI

See the monitoring [documentation](/mesosphere/dcos/2.0/monitoring/).

# Monitoring user-created services

## CLI

From the DC/OS CLI, enter the `dcos task` command. In this example you can see the installed DC/OS services Chronos, HDFS, Kafka, and the user-created service `suzanne-simple-service`.

```bash
dcos task
NAME                    HOST        USER  STATE  ID                                                           
cassandra               10.0.3.224  root    R    cassandra.36031a0f-feb4-11e6-b09b-3638c949fe6b               
node-0                  10.0.3.224  root    R    node-0__0b165525-13f2-485b-a5f8-e00a9fabffd9                 
suzanne-simple-service  10.0.3.224  root    R    suzanne-simple-service.47359150-feb4-11e6-b09b-3638c949fe6b
```

## UI

See the monitoring [documentation](/mesosphere/dcos/2.0/monitoring/). 
