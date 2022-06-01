---
layout: layout.pug
navigationTitle: Application Upgrades
title: Application Upgrades
menuWeight: 5
beta: false
excerpt: Upgrade catalog applications using the CLI and UI
---

## Upgrade catalog applications

Before upgrading your catalog applications, verify the current and supported versions of the application. Also, keep in mind the distinction between Platform applications and Catalog applications. Platform applications are deployed and upgraded as a set for each cluster or workspace. Catalog applications are deployed separately, so that you can deploy and upgrade them individually for each project.

### Upgrade with UI

Follow these steps to upgrade an application from the DKP UI:

1.  From the top menu bar, select your target workspace.

1.  Select **Applications** from the sidebar menu.

1.  Select the three dot button from the bottom-right corner of the desired application tile, and then select **Edit**.

1.  Select the **Version** drop-down, and select a new version. This drop-down will only be available if there is a newer version to upgrade to.

1.  Select **Save**.

### Upgrade with CLI

```bash
dkp upgrade catalogapp <appdeployment-name> --workspace=my-workspace --to-version=<version.number>
```

For example, the following command upgrades the Kafka Operator application, named `kafka-operator-abc`, in a workspace to version `0.20.2`:

```bash
dkp upgrade catalogapp kafka-operator-abc --workspace=my-workspace --to-version=0.20.2
```

<p class="message--note"><strong>NOTE: </strong>Platform applications cannot be upgraded on a one-off basis, and must be upgraded in a single process for each workspace. If you attempt to upgrade a platform application with these commands, you receive an error and the application is not upgraded.</p>
