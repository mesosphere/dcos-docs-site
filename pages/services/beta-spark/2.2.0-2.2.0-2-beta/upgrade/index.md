---
layout: layout.pug
navigationTitle: 
title: Upgrade
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/spark-build -->


1.  Go to the **Universe** > **Installed** page of the DC/OS GUI. Hover over your Spark Service to see the **Uninstall** button, then select it. Alternatively, enter the following from the DC/OS CLI:

        dcos package uninstall spark

1.  Verify that you no longer see your Spark service on the **Services** page.
1.  Reinstall Spark.

        dcos package install spark
