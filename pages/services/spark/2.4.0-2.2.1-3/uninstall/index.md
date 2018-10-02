---
layout: layout.pug
navigationTitle: Uninstalling Spark
excerpt: Uninstalling DC/OS Apache Spark
title: Uninstall
menuWeight: 60
featureMaturity:
render: mustache
model: /services/spark/data.yml
---
To  uninstall DC/OS {{ model.techName }}, run the following command:


    dcos package uninstall --app-id=<app-id> {{ model.packageName }}

The {{ model.techShortName }} dispatcher persists state in ZooKeeper, so to fully uninstall the DC/OS {{ model.techName }} package, you must 
1. Navigate to `http://<dcos-url>/exhibitor`. 
1. Click on `Explorer`. 
1. Delete the znode corresponding to your instance of {{ model.techShortName }}. By default this is   `{{ model.packageName }}_mesos_Dispatcher`.
