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

Follow these steps to upgrade an application from the DKP Dashboard:

1.  Select Applications from the left-hand menu of the DKP Dashboard.

1.  Select the three dots from the bottom-right corner of the desired application tile, and then select Edit.

1.  Select the drop-down arrow next to Version, select the new version, and then select Save.

### Upgrade with CLI

Depending in which environment an application runs, execute the appropriate command for each catalog application that you need to upgrade:

-   Workspace:

    ```bash
    dkp upgrade appdeployment <app-name> --workspace=my-workspace --to-version=<version.number>
    ```

-   Project:

    ```bash
    dkp upgrade appdeployment <app-name> --workspace=my-workspace --project=my-project --to-version=<version.number>
    ```

For example, the following command upgrades the Kafka Operator application in a workspace to version `0.20.2`:

```bash
dkp upgrade appdeployment kafka-operator --workspace=my-workspace --to-version=0.20.2
```

<p class="message--note"><strong>NOTE: Platform applications cannot be upgraded on a one-off basis, and must be upgraded in a single process for each workspace. If you attempt to upgrade a platform application with these commands, you receive an error and the application is not upgraded.</p>
