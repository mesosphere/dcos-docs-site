---
layout: layout.pug
beta: false
navigationTitle: Resource Alert Settings
title: Resource Alert Settings
menuWeight: 10
excerpt: Customize when and if resource charts show an alert
---

Kommander displays bar charts that show consumption of CPU, memory, and disk (ephemeral storage) resource types. The charts show data for requests, limits, and usage on these resource types. When resources are being over-utilized or under-utilized, an alert is shown on the bar chart.

![Resource charts in a cluster card](/dkp/kommander/1.3/img/resource-warning-settings-chart-example.png)

The default minimum threshold to show an alert is 15% being used, and the maximum threshold is 95%. These may be customized to whatever percentages work best for your organization, or the alerts can be disabled. These settings apply to all workspaces and their respective clusters. They may only be changed by a user with [global administrator permissions][kommander-access-control].

![Resource charts in a cluster card](/dkp/kommander/1.3/img/resource-warning-settings.png)

[kommander-access-control]: /dkp/kommander/latest/operations/access-control/
