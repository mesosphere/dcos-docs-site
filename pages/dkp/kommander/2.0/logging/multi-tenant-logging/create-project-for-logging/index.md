---
layout: layout.pug
navigationTitle: Create a Project for Logging
title: Create a Project for Logging
menuWeight: 5
excerpt: How to create a Project for use in multi-tenant logging
beta: false
---

To enable multi-tenant logging, you must first [create a Project](../../../projects/#create-a-project) and its namespace. Users assigned to this namespace will be able to access log data for only that namespace and not others.

Then, you can [create project-level AppDeployments for use in multi-tenant logging][project-app-deployment].

[project-app-deployment]: ../create-appdeployment
