---
layout: layout.pug
navigationTitle: Create a Project for Logging
title: Create a Project for Logging
menuWeight: 5
excerpt: How to create a Project for use in multi-tenant logging
beta: true
---

To enable multi-tenant logging, you must first [create a Project](../../../projects/#create-a-project) and its namespace. Users assigned to this namespace will be able to access log data for only that namespace and not others.

Then, you can [create a configMap for multi-tenant logging][create-configmap].

[create-configmap]: ../create-configmap
