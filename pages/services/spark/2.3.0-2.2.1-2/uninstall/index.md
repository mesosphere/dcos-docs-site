---
layout: layout.pug
navigationTitle: 
excerpt:
title: Uninstall
menuWeight: 60
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


    dcos package uninstall --app-id=<app-id> spark

The Spark dispatcher persists state in ZooKeeper, so to fully
uninstall the Spark DC/OS package, you must go to
`http://<dcos-url>/exhibitor`, click on `Explorer`, and delete the
znode corresponding to your instance of Spark. By default this is
`spark_mesos_Dispatcher`.
