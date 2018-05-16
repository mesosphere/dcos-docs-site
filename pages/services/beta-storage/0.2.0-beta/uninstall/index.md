---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt: Instructions for removing the DC/OS Storage Service from a DC/OS cluster.
enterprise: true
---

# Uninstall the DSS package

You can simply uninstall the DSS using the following command:

```bash
$ dcos package uninstall beta-storage
```

# Uninstall the local universe

Remove the corresponding local universe using the following command:

```bash
$ dcos package repo remove storage-artifacts-<SHA>
```
