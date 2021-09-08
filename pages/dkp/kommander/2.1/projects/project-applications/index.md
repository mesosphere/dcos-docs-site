---
layout: layout.pug
navigationTitle: Project Applications
title: Project Applications
menuWeight: 30
excerpt: How project applications work
---

The following table describes the list of applications that can be deployed to attached clusters within a project.

<!-- # This page not yet updated
Review the [project application service resource requirements](./platform-application-requirements/) to ensure that the attached clusters have sufficient resources.
-->

### Deploy applications in a project

You can select which applications to deploy in a project by going to the **Applications** tab of the project.

To use the CLI to enable or disable applications, see [Application Deployment](./application-deployment)

<p class="message--important"><strong>IMPORTANT: </strong>There may be dependencies between the applications, which are listed <a href="./platform-application-dependencies/">here</a>. Review them carefully prior to customizing to ensure that the applications are deployed successfully.</p>

## Project applications

| NAME                           | APP ID                  | Deployed by default |
| ------------------------------ | ----------------------- | ------------------- |
| project-grafana-logging-6.13.9 | project-grafana-logging | False               |
| project-grafana-loki-0.33.1    | project-grafana-loki    | False               |
| project-logging-1.0.0          | project-logging         | False               |
