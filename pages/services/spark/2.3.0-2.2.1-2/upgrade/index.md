---
layout: layout.pug
navigationTitle: 
excerpt:
title: Upgrade
menuWeight: 50
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->

Because the Spark service dispatcher persists its state in ZooKeeper, upgrading the DC/OS Spark package requires you to complete the following steps:
- Remove the DC/OS Spark package from ZooKeeper.
- Uninstall your current DC/OS Spark service package.
- Install the DC/OS Spark service upgrade. 

To upgrade DC/OS Spark, do the following:
1. Navigate to `http://<dcos-url>/exhibitor`. 
1. Click `Explorer`. 
1. Delete the znode corresponding to your instance of the Spark service. By default, the znode instance is `spark_mesos_Dispatcher`.
1. Select the Spark service from the list of Services in DC/OS web interface and click **Delete** or run the following command from the DC/OS CLI:

        dcos package uninstall spark

1. Verify that you no longer see the Spark service on the **Services** page.
1. Install the new DC/OS Spark package by running the following command:

        dcos package install spark