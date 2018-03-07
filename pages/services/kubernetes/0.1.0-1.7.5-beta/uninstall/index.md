---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

You can uninstall Kubernetes from the DC/OS CLI or the GUI.

From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes kubernetes`.

   For example, to uninstall a Kubernetes Services instance named `kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=kubernetes-dev kubernetes
```

From the DC/OS GUI, go to **Services**. Click the three-dot menu to the right of the service you want to delete and choose **Delete**.
