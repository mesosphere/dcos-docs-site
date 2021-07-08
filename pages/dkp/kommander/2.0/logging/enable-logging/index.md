---
layout: layout.pug
navigationTitle: Enable Workspace-level Logging
title: Enable Workspace-level Logging
menuWeight: 5
excerpt: How to enable Workspace-level Logging for use with Kommander
beta: true
---

<!-- markdownlint-disable MD030 -->

Logging is disabled by default. You will need to enable logging features explicitly at the Workspace level, if you want to capture and view log data.

<p class="message--important"><strong>IMPORTANT: </strong>You must perform these procedures to enable multi-tenant logging at the Project level as well.</p>

## Before you begin

-  You must be a cluster administrator with permissions to configure cluster-level platform services.

-  Each federated cluster requires a default storage class for successful Loki deployment

## Workspace-level logging enablement process

The steps required to enable multi-tenant logging include:

1.  Create configMap for Grafana configuration

1.  Create AppDeployments to enable logging

1.  Verify cluster's logging stack installed

1.  View a cluster's log data

You can also configure Kommander to enable [multi-tenant logging](../../logging/multi-tenant-logging/enable-mt-logging).
