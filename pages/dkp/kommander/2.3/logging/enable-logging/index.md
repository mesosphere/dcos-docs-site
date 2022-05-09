---
layout: layout.pug
navigationTitle: Enable Workspace-level Logging
title: Enable Workspace-level Logging
menuWeight: 5
excerpt: How to enable Workspace-level Logging for use with Kommander
beta: false
---

<!-- markdownlint-disable MD030 -->

Logging is disabled by default. You will need to enable logging features explicitly at the Workspace level, if you want to capture and view log data.

<p class="message--important"><strong>IMPORTANT: </strong>You must perform these procedures to enable multi-tenant logging at the Project level as well.</p>

## Prerequisites

Before you begin, you must:

-  Be a cluster administrator with permissions to configure cluster-level platform services.
- Set a [default storage class][default-storage-class] on each attached cluster for successful Loki deployment.

## Enable Workspace-level logging

The steps required to enable multi-tenant logging include:

1.  [Create the AppDeployments to enable logging.][create-appdeployment]

1.  [Verify that the cluster's logging stack is installed.][verify-logging-deployment]

1.  [View a cluster's log data.][view-logdata]

To get started with logging, create the AppDeployments using the CLI. You can also [use the DKP UI to enable the logging applications][enable-logging-via-ui]. When Workspace-level logging is fully-configured and operational, then you can configure Kommander to enable [multi-tenant logging](../multi-tenant-logging), if needed.

[create-appdeployment]: ../../logging/enable-logging/create-appdeployment-workspace
[default-storage-class]: ../../clusters/attach-cluster/requirements-for-attaching#creating-a-default-storageclass
[enable-logging-via-ui]: ../enable-logging/enable-logging-via-ui
[verify-logging-deployment]: ../../logging/enable-logging/verify-cluster-logstack
[view-logdata]: ../../logging/enable-logging/view-cluster-logdata
