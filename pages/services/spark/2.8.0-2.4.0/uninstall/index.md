---
layout: layout.pug
navigationTitle: Uninstall
excerpt: Uninstalling DC/OS Apache Spark
title: Uninstalling Spark
menuWeight: 60
featureMaturity:
render: mustache
model: /services/spark/data.yml
---
To  uninstall DC/OS {{ model.techName }}, run the following command:

    dcos package uninstall --app-id=<app-id> spark

The {{ model.techShortName }} dispatcher persists state in ZooKeeper, so to fully uninstall the DC/OS {{ model.techName }} package, you must:

1. Navigate to `http://<dcos-url>/exhibitor`.
1. Click on `Explorer`.
1. Delete the znode corresponding to your instance of {{ model.techShortName }}. By default, this node is `spark_mesos_Dispatcher`.
