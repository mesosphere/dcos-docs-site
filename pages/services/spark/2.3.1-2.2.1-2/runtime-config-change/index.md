---
layout: layout.pug
navigationTitle: Runtime Changes
excerpt: Customizing Spark while running
navigationTitle: Runtime Changes
title: Runtime Configuration Change
menuWeight: 70
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

You can customize DC/OS {{ model.techName }} in-place when it is up and running.

1.  Go to the DC/OS web interface.

2.  Click the **Services** tab, then choose the {{ model.techShortName }} service.

![Spark dashboard](/services/img/spark-dashboard.png)

Figure 1. Services > {{ model.techShortName }} service

3.  Choose the name of the {{ model.techShortName }} framework to be updated.

![Spark framework details](/services/img/spark-framework-details.png)

Figure 2. {{ model.techShortName }} details

4. Choose **Edit** in the upper right.

5.  In the screen that appears, update any field(s) to their desired value(s). You may configure the **Service**, **Security**, or **HDFS** settings from the left hand menu.

![Spark configuration screen](/services/img/spark-config-properties.png)

Figure 3. {{ model.techShortName }} configuration screen

6.  Click the **Review and Run** button to apply any changes and cleanly reload {{ model.techShortName }}.

![Review button](/services/img/review-and-run-button.png)

Figure 4.  Review and Run button

