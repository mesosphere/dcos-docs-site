---
layout: layout.pug
navigationTitle: Runtime changes
excerpt: Making changes while running DC/OS Data Science Engine
title: Runtime changes
menuWeight: 3
model: /services/data-science-engine/data.yml
render: mustache
---



You can customize {{ model.techName }} in-place when it is up and running. This section describes how to make runtime changes to your {{ model.techName }} configuration.


1. Go to the DC/OS UI.
1. Click the **Services** tab, then the icon of the {{ model.packageName }} service.
1. Within the {{ model.packageName }} instance details view, click the menu in the upper right, then choose **Edit**.
1. In the dialog that appears, click the **Environment** tab and update any field(s) to their desired value(s).
1. Click **REVIEW & RUN** to apply any changes and cleanly reload {{ model.packageName }}.

