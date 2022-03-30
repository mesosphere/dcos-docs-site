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

## Deploy applications in a project

You can select which applications to deploy in a project by going to the **Applications** tab of the project.

To use the CLI to enable or disable applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="application-dependencies/">in this topic</a>. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Platform applications

| NAME                           | APP ID                  | Deployed by default |
| ------------------------------ | ----------------------- | ------------------- |
| project-grafana-logging-6.16.14 | project-grafana-logging | False               |
| project-grafana-loki-0.33.1    | project-grafana-loki    | False               |
| project-logging-1.0.0          | project-logging         | False               |

## Upgrade Platform applications from the CLI

Platform applications are deployed and upgraded as a set for each cluster or workspace. For the management cluster or workspace, Platform applications are automatically upgraded with the [DKP upgrade](../../../dkp-upgrade) procedure; no other steps are necessary for the management cluster or workspace. For attached/managed clusters or workspaces, you MUST manually upgrade Platform applications bundle.

<p class="message--warning"><strong>WARNING: </strong>If you are upgrading your Platform applications as part of the <a href="../../../dkp-upgrade">DKP upgrade</a>, upgrade your Platform applications on any additional Workspaces before proceeding with the Konvoy upgrade. Some applications in the previous release are not compatible with the <a href="../../../release-notes/">Kubernetes version</a> of this release, and upgrading Kubernetes is part of the DKP Konvoy upgrade process.
</p>

Upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster with this command:

```bash
dkp upgrade workspace WORKSPACE_NAME [--dry-run] [flags]
```
