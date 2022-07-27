---
layout: layout.pug
navigationTitle: Project Platform Applications
title: Project Platform Applications
menuWeight: 10
excerpt: How project Platform applications work
---

The following table describes the list of applications that can be deployed to attached clusters within a project.

Review the [project application service resource requirements](./application-requirements/) to ensure that the attached clusters in the project have sufficient resources.

<p class="message--important"><strong>IMPORTANT: </strong>From within a project, you can enable applications to deploy. Verify that an application has successfully deployed <a href="../platform-applications/application-deployment#verify-applications">via the CLI</a>.</p>

## Enable applications in a project using the DKP UI

1.  From the top menu bar, select your target workspace.

1.  Select **Projects** from the sidebar menu.

1.  Select your project from the list.

1.  Select the **Applications** tab to browse the available applications.

1.  Select the three dot button from the bottom-right corner of the desired application tile, and then select **Enable**.

1.  To override the default configuration values, copy your values content into the text editor under **Configure Service** or just upload your yaml file that contains the values:

      ```yaml
      someField: someValue
      ```

1.  Select the **Enable** button.

To use the CLI to enable or disable applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="application-dependencies/">in this topic</a>. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Platform applications

| NAME                           | APP ID                  | Deployed by default |
| ------------------------------ | ----------------------- | ------------------- |
| project-grafana-logging-6.28.0 | project-grafana-logging | False              |
| project-grafana-loki-0.48.3    | project-grafana-loki    | False               |
| project-logging-1.0.0          | project-logging         | False               |

## Upgrade Platform applications from the CLI

Platform Applications within a Project are automatically upgraded when the Workspace that a Project belongs to is upgraded. See [Upgrade Kommander][upgrade_workspaces] for more information on how to upgrade these applications.

[upgrade_workspaces]: ../../../dkp-upgrade/upgrade-kommander/
