---
layout: layout.pug
navigationTitle: Catalog applications
title: Catalog applications
menuWeight: 20
excerpt: Catalog applications
---
Catalog applications are any third-party or open source applications that appear in the Catalog. These can be DKP applications provided by D2iQ for use in your environment, or [Custom Applications](custom-applications) that can be used but are not supported by D2iQ.

## Upgrade catalog applications

Before upgrading your catalog applications, verify the current and supported versions of the application. Also, keep in mind the distinction between Platform applications and Catalog applications. Platform applications are deployed and upgraded as a set for each cluster or workspace. Catalog applications are deployed separately, so that you can deploy and upgrade them individually for each project.

<p class="message--note"><strong>NOTE: </strong>Catalog applications must be upgraded to the latest version BEFORE upgrading the Kubernetes version (or Konvoy version for managed Konvoy clusters) on attached clusters, due to the previous versions' incompatibility with Kubernetes 1.22.</p>

### Upgrade with UI

Follow these steps to upgrade an application from the DKP UI:

1.  From the top menu bar, select your target workspace.

1.  From the side menu bar, select **Projects**.

1.  Select your target project.

1.  Select **Applications** from the project menu bar.

1.  Select the three dot button from the bottom-right corner of the desired application tile, and then select **Edit**.

1.  Select the **Version** drop-down, and select a new version. This drop-down will only be available if there is a newer version to upgrade to.

1.  Select **Save**.

### Upgrade with CLI

```bash
dkp upgrade catalogapp <appdeployment-name> --workspace=my-workspace --project=my-project --to-version=<version.number>
```

<p class="message--note"><strong>NOTE: </strong>Platform applications cannot be upgraded on a one-off basis, and must be upgraded in a single process for each workspace. If you attempt to upgrade a platform application with these commands, you receive an error and the application is not upgraded.</p>
