---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 20
excerpt:
---
# Uninstall

## Uninstall the DSS package

You can simply uninstall the DSS using the following command:

```bash
$ dcos package uninstall storage
```

## Uninstall the local universe

Remove the corresponding local universe using the following command:

```bash
$ dcos package repo remove storage-artifacts-<SHA>
```