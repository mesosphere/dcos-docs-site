---
layout: layout.pug
navigationTitle: Enable Multi-tenant Logging
title: Enable Multi-tenant Logging
menuWeight: 1
excerpt: How to enable Multi-tenant Logging for use with Kommander
beta: true
---

<!-- markdownlint-disable MD030 -->

## Prerequisites

Before you begin, you must:

-  Have logging [enabled at the Workspace level](../../enable-logging) before you can configure multi-tenant logging.
-  Be a cluster administrator with permissions to configure cluster level platform services.

## Multi-tenant logging enablement process

The steps required to enable multi-tenant logging include:

1. Create a [Project](../../../projects/#create-a-project)
1. [Create configMaps for Grafana and Loki configuration.](../../../logging/multi-tenant-logging/create-configmap)
1. [Create the required Project-level AppDeployments.](../../../logging/multi-tenant-logging/create-appdeployment)
1. [Create a Project logging configuration.](../../../logging/multi-tenant-logging/create-proj-logging-config)
1. [Verify that the Project logging stack is installed.](../../../logging/multi-tenant-logging/verify-proj-logstack-install)
1. [View a Project's log data.](../../../logging/multi-tenant-logging/view-proj-logdata)

Get started with multi-tenant logging by [creating a project][create-project-logging].

[create-project-logging]: ../create-project-for-logging
