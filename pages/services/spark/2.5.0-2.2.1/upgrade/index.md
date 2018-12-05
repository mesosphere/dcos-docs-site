---
layout: layout.pug
navigationTitle: Upgrade
excerpt: Upgrading DC/OS Apache Spark
title: Upgrade
menuWeight: 50
featureMaturity:
render: mustache
model: /services/spark/data.yml
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
1. Select the {{ model.techShortName }} service from the list of Services in the DC/OS web interface and click **Delete** or run the following command from the DC/OS CLI:

        dcos package uninstall --app-id=<app-id> spark
1. Verify that you no longer see your {{ model.techShortName }} service on the **Services** page.
1. Reinstall the new {{ model.techShortName }} package by running the following command:

        dcos package install spark
