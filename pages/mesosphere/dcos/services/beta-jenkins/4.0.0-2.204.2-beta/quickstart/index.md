---
layout: layout.pug
navigationTitle:  Jenkins for DC/OS Quickstart
title: Jenkins for DC/OS Quickstart
menuWeight: 10
excerpt: Jenkins for DC/OS can be installed using either the web interface or the DC/OS CLI.
beta: true
featureMaturity:
enterprise: false
---
# About installing Jenkins for DC/OS

As a package available in the Universe, Jenkins for DC/OS can be installed using either the web interface or the DC/OS CLI. With its sensible defaults, you can get up and running very quickly.

**Important:** The default installation will use a `/tmp` directory on the local host to store configuration and build data. This configuration will not scale to accommodate multiple Jenkins masters. In addition, it will result in the loss of data when the agent goes down. Before going into production, you must perform a [custom install](../custom-install/index.md) and set up either a shared file system (recommended) or pin to a single agent.

# Prerequisites

DC/OS 2.1 or later

**Note:** If you are on an earlier version and would like to try out Jenkins for DC/OS, contact <a href="mailto:support@mesosphere.io">support@mesosphere.io</a>.

# Installing Jenkins for DC/OS

## Using the web interface


- Click **Universe**.
- Click the **Install Package** button for the Jenkins package.
- To accept the default settings, click **Install Package** on the pop-up. To customize the installation parameters, click **Advanced Installation** instead. Refer to [Customizing your install](../custom-install/index.md) for more information about each option.

## Using the CLI

**Tip:** To install Jenkins using the CLI, you must have the [CLI installed](https://docs.d2iq.com/mesosphere/dcos/latest/cli/install).

From the CLI, type the following command to install Jenkins for DC/OS.

```bash
dcos package install beta-jenkins
```

**Note:** You can use the `--options` flag to pass custom configuration parameters. Refer to [Customizing your install](../custom-install/index.md) for more information.

# Verifying your installation

1. You can use either the web interface or the CLI to verify that Jenkins for DC/OS has installed successfully.
    - From the DC/OS CLI, run the following command to list the installed packages:
      ```bash
      dcos package list
      ```

1. From the web interface, click the **Services** tab and confirm that Jenkins is running at `/#/services`.
    - Launch your browser and navigate to the Jenkins interface at `http://host-name/service/jenkins`.

