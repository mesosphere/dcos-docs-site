---
layout: layout.pug
navigationTitle: Enable logging applications through the UI
title: Enable logging applications through the UI
menuWeight: 5
excerpt: How to enable the logging stack through the UI for Workspace-level logging
beta: false
---

<!-- markdownlint-disable MD030 -->

You can enable the Workspace logging stack to all attached clusters within the Workspace through the UI. If you prefer to enable the logging stack with `kubectl`, review how you [create AppDeployments to Enable Workspace Logging][create-appdeployment].

To enable workspace-level logging in DKP using the UI, follow these steps:

1.  From the top menu bar, select your target workspace.

1.  Select **Applications** from the sidebar menu.

1.  Traefik and cert-manager are required to be deployed for the logging stack. Ensure that Traefik is enabled in the Workspace, and cert-manager is enabled or already deployed to the cluster.

1.  Scroll to the **Logging** applications section.

1.  Select the three dot button from the bottom-right corner of the card for MinIO, and click **Enable**. On the **Enable Workspace Platform Application** page, you can add a customized configuration for settings that best fit your organization. You can leave the configuration settings unchanged to enable with default settings.

1.  Select **Enable** at the top right of the page.

1.  Repeat the process for the Grafana Loki, Fluent Bit, Logging Operator, and Grafana Logging applications.

1.  You can verify the cluster logging stack installation by waiting until the cards have a Deployed checkmark on the [cluster detail page][cluster-applications], or you can [verify the cluster logging stack installation via the CLI][verify-logging-install].

1.  Then, you can [view cluster log data][view-log-data].

[create-appdeployment]: ../create-appdeployment-workspace
[verify-logging-install]: ../verify-cluster-logstack
[view-log-data]: ../view-cluster-logdata
[cluster-applications]: ../../../clusters/applications#applications
