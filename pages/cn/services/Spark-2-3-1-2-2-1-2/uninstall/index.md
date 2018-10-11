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

要卸载您的 DC/OS {{ model.techName}} 服务，您必须删除您的 {{ model.techShortName }} 实例。

1. 使用 `dcos package uninstall` 命令卸载 {{ model.techShortName }}：
```
    dcos package uninstall --app-id=<app-id> {{ model.serviceName }}
```

2. {{ model.techShortName }} 调度器在 ZooKeeper 中保留状态，所以要完全
卸载 DC/OS {{ model.techShortName }} 包，您必须前往
http://<dcos-url>/exhibitor`, click on `Explorer`，并删除
与您的 {{ model.techShortName }} 实例相对应的 `znode`。默认情况下，此实例命名为 
`spark_mesos_Dispatcher`.
