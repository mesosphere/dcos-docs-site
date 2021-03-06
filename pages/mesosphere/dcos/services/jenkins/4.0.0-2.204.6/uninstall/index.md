---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 70
excerpt: Jenkins for DC/OS can be uninstalled using either the web interface or the CLI. 
beta: false
enterprise: false
---
# Uninstalling DC/OS Jenkins Service

Jenkins for DC/OS can be uninstalled using either the web interface or the CLI.

**Note:** This process does not delete the data stored on either the pinned agent or the shared file system. You must delete this data manually.

## Using the web interface

1. Select the **Universe** tab.
1. Selet **Installed** to view your installed services.
1. Hover over the Jenkins instance that you wish to uninstall. A red **Uninstall** link will appear on the far right.
1. Select **Uninstall**.

## Using the CLI

From the CLI, you can uninstall with the following command.

```bash
dcos package uninstall jenkins
```
