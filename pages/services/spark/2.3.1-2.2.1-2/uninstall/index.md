---
layout: layout.pug
navigationTitle: Uninstall
excerpt: Uninstalling DC/OS Apache Spark service
title: Uninstall
menuWeight: 60
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

To uninstall your DC/OS {{ model.techName}} service, you must delete your instance of {{ model.techShortName }}.

1. Use the `dcos package uninstall` command to uninstall {{ model.techShortName }}:
```
    dcos package uninstall --app-id=<app-id> {{ model.serviceName }}
```

2. The {{ model.techShortName }} dispatcher persists state in ZooKeeper, so to fully
uninstall the DC/OS {{ model.techShortName }} package, you must go to
`http://<dcos-url>/exhibitor`, click on `Explorer`, and delete the
`znode` corresponding to your instance of {{ model.techShortName }}. By default this instance is named 
`spark_mesos_Dispatcher`.
