---
layout: layout.pug
navigationTitle: Project Application Dependencies
title: Project Application Dependencies
menuWeight: 8
excerpt: Dependencies between project applications
---

There are many dependencies between the applications that are deployed to a project's attached clusters. It is important to note these dependencies when customizing the project applications to ensure that your services are properly deployed to the clusters. For more information on how to customize project applications, see [Project Application Deployment](../application-deployment/#deploy-an-application-with-a-custom-configuration).

## Application Dependencies

When deploying or troubleshooting applications, it helps to understand how applications interact and may require other applications as dependencies.

If an application’s dependency does not successfully deploy, the application requiring that dependency does not successfully deploy.

The following sections detail information about the project applications.

### Logging

Collects logs over time from Kubernetes pods deployed in the project namespace. Also provides the ability to visualize and query the aggregated logs.

- [project-logging](https://grafana.com/oss/grafana/): Defines resources for the Logging Operator which uses them to direct the project's logs to its respective Grafana Loki application.
- [project-grafana-loki](https://grafana.com/oss/loki/): A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.
- [project-grafana-logging](https://grafana.com/oss/grafana/): Logging dashboard used to view logs aggregated to Grafana Loki.

<p class="message--important"><strong>IMPORTANT: </strong> The project logging applications depend on the <a href="../../../workspaces/workspace-platform-services/platform-service-dependencies/">workspace logging applications</a> being deployed.</p>

| **Application**         | **Dependencies**                                                        |
| ----------------------- | ----------------------------------------------------------------------- |
| project-logging         | logging-operator (workspace)                             |
| project-grafana-loki    | project-logging, grafana-loki (workspace), logging-operator (workspace) |
| project-grafana-logging | project-grafana-loki                                                    |
