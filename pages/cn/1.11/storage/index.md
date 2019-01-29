---
layout: layout.pug
navigationTitle: 存储
title: 存储
menuWeight: 90
excerpt: 在终止和重新启动时保存您的应用程序
enterprise: false
---

DC/OS 应用程序在终止和重新启动时失去状态。在某些情况下，例如，如果您的应用程序使用 MySQL，或者您正在使用像 Kafka 或 Cassandra 这样的有状态服务，您将希望应用程序保存其状态。本部分将向您展示如何创建有状态的应用程序，以在终止和重新启动时保存您的应用程序。

