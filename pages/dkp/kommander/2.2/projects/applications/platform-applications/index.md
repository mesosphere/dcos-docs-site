---
layout: layout.pug
navigationTitle: Platform Applications
title: Platform Applications
menuWeight: 10
excerpt: How Platform applications work
---

The following table describes the list of applications that can be deployed to attached clusters within a project.

<!-- # This page not yet updated
Review the [project application service resource requirements](./platform-application-requirements/) to ensure that the attached clusters have sufficient resources.
-->

When deploying and upgrading applications, platform applications come as a bundle; they are tested as a single unit and you must deploy or upgrade them in a single process, for each workspace. This means all clusters in a workspace have the same set and versions of platform applications deployed.

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
| project-grafana-logging-6.16.14 | project-grafana-logging | False               |
| project-grafana-loki-0.33.1    | project-grafana-loki    | False               |
| project-logging-1.0.0          | project-logging         | False               |

## Upgrade Platform applications from the CLI

The [DKP upgrade](../../../dkp-upgrade) process deploys and upgrades Platform applications as a bundle for each cluster or workspace. For the management cluster or workspace, DKP upgrade handles all Platform applications; no other steps are necessary to upgrade the Platform application bundle. However, for managed or attached clusters or workspaces, you MUST manually upgrade the Platform applications bundle with the following command.

<p class="message--warning"><strong>WARNING: </strong>If you are upgrading your Platform applications as part of the <a href="../../../dkp-upgrade">DKP upgrade</a>, upgrade your Platform applications on any additional Workspaces before proceeding with the Konvoy upgrade. Some applications in the previous release are not compatible with the <a href="../../../release-notes/">Kubernetes version</a> of this release, and upgrading Kubernetes is part of the DKP Konvoy upgrade process.
</p>

Upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster:

```bash
dkp upgrade workspace WORKSPACE_NAME [--dry-run] [flags]
```
