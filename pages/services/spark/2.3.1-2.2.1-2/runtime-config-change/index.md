---
layout: layout.pug
navigationTitle: Runtime Changes
excerpt: Changing Spark configuration while running
title: Runtime Configuration Change
menuWeight: 70
featureMaturity:

---

You can customize DC/OS Apache Spark in-place when it is up and running.

1.  Go to the DC/OS web interface.

2.  Click the **Services** tab, then choose the Spark service.

![Spark dashboard](/services/img/spark-dashboard.png)

Figure 1. Services > Spark service

3. Choose the name of the Spark framework to be updated.

![Spark framework](/services/img/spark-framework-details.png)

Figure 2. Spark framework

4.  Choose **Edit** in the upper right.

5.  In the screen that appears, update any field(s) to their desired value(s). You may configure the **Service**, **Security**, or **HDFS** settings from the left hand menu.

![Spark configuration screen](/services/img/spark-config-properties.png)

Figure 3. Spark configuration screen

6.  Click the **Review and Run** button to apply any changes and cleanly reload Spark.

![Review button](/services/img/review-and-run-button.png)

Figure 4.  Review and Run button
