---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt: Instructions for removing the DC/OS Storage Service from a DC/OS cluster
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

# Uninstall the DSS package

You can uninstall the DSS using the following command:

```bash
$ dcos package uninstall beta-storage
WARNING: This action cannot be undone. This will uninstall [beta-storage] and delete all of its persistent data (logs, configurations, database artifacts, everything).
Please type the name of the service to confirm: beta-storage
Uninstalled package [beta-storage] version [v0.2.0-rc3]
```

# Uninstall the local universe

Remove the corresponding local universe using the following command:

```bash
$ dcos package repo remove storage-artifacts-<SHA>
```
