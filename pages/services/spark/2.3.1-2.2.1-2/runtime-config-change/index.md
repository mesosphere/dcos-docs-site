---
layout: layout.pug
navigationTitle: 
excerpt: Customizing Spark while running
title: Runtime Configuration Change
menuWeight: 70
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

You can customize DC/OS {{ model.techName }} in-place when it is up and running.

1.  Go to the DC/OS GUI.

1.  Click the **Services** tab, then the name of the {{ model.techShortName }} framework to be updated.

1.  Within the {{ model.techShortName }} instance details view, click the menu in the upper right, then choose **Edit**.

1.  In the dialog that appears, click the **Environment** tab and update any field(s) to their desired value(s).

1.  Click **REVIEW & RUN** to apply any changes and cleanly reload {{ model.techShortName }}.
