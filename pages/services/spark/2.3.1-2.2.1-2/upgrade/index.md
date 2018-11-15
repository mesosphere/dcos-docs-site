---
layout: layout.pug
navigationTitle: 
excerpt: Upgrading your DC/OS Apache Spark service
title: Upgrade
menuWeight: 50
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

Because the {{ model.techShortName }} dispatcher persists its state in ZooKeeper, upgrading the DC/OS {{ model.techName }} package requires you to complete the following steps:
- Remove the DC/OS {{ model.techName }} package from ZooKeeper.
- Uninstall your current DC/OS {{ model.techName }} package.
- Install the DC/OS {{ model.techName }} upgrade. 

To upgrade DC/OS {{ model.techName }}, do the following:
1. Navigate to `http://<dcos-url>/exhibitor`. 
1. Click `Explorer`. 
1. Delete the znode corresponding to your instance of {{ model.techShortName }}. 
        By default, the znode instance is `spark_mesos_Dispatcher`.
1. Select the {{ model.techShortName }} service from the list of Services in DC/OS web interface and click **Delete** or run the following command from the DC/OS CLI:

        dcos package uninstall spark

2.  Verify that you no longer see your Spark service on the **Services** page.
1.  Reinstall Spark.

        dcos package install spark
