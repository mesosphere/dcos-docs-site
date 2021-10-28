---
layout: layout.pug
navigationTitle: Enable logging applications through the UI
title: Enable logging applications through the UI
menuWeight: 5
excerpt: How to enable the logging stack through the UI for Workspace-level logging
beta: false
---

<!-- markdownlint-disable MD030 -->

You can enable the Workspace logging stack to all attached clusters within the Workspace through the UI. If you prefer to deploy the logging stack through `kubectl`, review how you [create AppDeployments to Enable Workspace Logging][create-appdeployment].

To enable logging in DKP using the UI, follow these steps in Kommander:

1. In the **Global workspace** nav, click on the **Global** dropdown and then select the Workspace you want to deploy for your logging stack.

1. In the left rail nav, click on **Applications**.

1. Ensure that cert-manager and Traefik are enabled in the Workspace. Scroll down in the **Applications** page to view the **Foundational** applications section. Confirm that cert-manager and Traefik are deployed.

1. After validating these applications are deployed, scroll to the **Logging** applications section.

1. Click on the three button action menu on the card for MinIO, and click **Deploy**. In this **Deploy Workspace Platform Application** page, you can add a customized configuration for settings that best fit your organization. You can leave the configuration settings unchanged to deploy with default settings.

1. Click **Deploy** at the top right of the page.

1. Repeat the deployment process for the cards on Grafana Loki, Fluent Bit, Logging Operator, and Grafana Logging.

1. You can verify the cluster logging stack installation by waiting until the cards have a Deployed checkmark, or you can [verify the cluster logging stack installation via the CLI][verify-logging-install].

1. Then, you can [view cluster log data][view-log-data].

[create-appdeployment]: ../create-appdeployment-workspace
[verify-logging-install]: ../verify-cluster-logstack
[view-log-data]: ../view-cluster-logdata
