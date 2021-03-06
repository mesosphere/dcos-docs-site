---
layout: layout.pug
navigationTitle: Enable Multi-tenant Logging
title: Enable Multi-tenant Logging
menuWeight: 1
excerpt: How to enable Multi-tenant Logging for use with Kommander
beta: true
---

<!-- markdownlint-disable MD030 -->

## Before you begin

-  Logging has to be [enabled at the Workspace level](../../enable-logging) before you can configure multi-tenant logging.
-  You must be a cluster administrator with permissions to configure cluster level platform services.

## Multi-tenant logging enablement process

The steps required to enable multi-tenant logging include:

1. Create a [Project](../../../projects/#create-a-project)
1. Create configMaps for Grafana and Loki configuration
1. Create Project-level AppDeployments
1. Create Project logging configuration
1. Verify Project logging stack installation
1. View a Project's log data

Start, by [creating a project][create-project-logging].

[create-project-logging]: ../create-project-for-logging
