---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 70
excerpt:
featureMaturity:
enterprise: false
---
# Uninstalling DC/OS Jenkins Service

Jenkins for DC/OS can be uninstalled using either the web interface or the CLI.

**Note:** This process does not delete the data stored on either the pinned agent or the shared file system. You must delete this data manually.

## Using the web interface

1. Click the **Universe** tab.
1. Click **Installed** to view your installed services.
1. Hover over the Jenkins instance that you wish to uninstall. A red **Uninstall** link will appear on the far right.
1. Click **Uninstall**.

## Using the CLI

From the CLI, you can uninstall with the following command.

```bash
dcos package uninstall beta-jenkins
```
