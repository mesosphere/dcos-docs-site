---
layout: layout.pug
navigationTitle: Management cluster application requirements
title: Management cluster application requirements
menuWeight: 40
excerpt: Management cluster application minimum resources and storage requirements
beta: false
enterprise: true
---
This section details requirements for management cluster-specific applications. For the list of all available platform applications, see [Platform Application Configuration Requirements](../../workspaces/applications/platform-applications/platform-application-requirements/).

This table describes the workspace platform applications specific to the management cluster, minimum resource requirements, and minimum persistent storage requirements.

| Name                          | Minimum Resources Suggested     | Minimum Persistent Storage Required | Deployed by Default |
| ----------------------------- | ------------------------------- | ----------------------------------- | ------------------- |
| centralized-grafana           |                                 |                                     |                     |
| centralized-kubecostcert      |                                 |                                     | Yes                 |
| chartmuseum                   |                                 |                                     | Yes                 |
| dkp-insights-managementtraefi | cpu: 500m                       |                                     | Yes                 |
| gitea                         |                                 |                                     |                     |
| karma                         |                                 |                                     |                     |
| kubefed                       |                                 |                                     |                     |
| thanos                        |                                 |                                     |                     |
| traefik-forward-auth          | cpu: 100m<br />memory: 128Mi  |                                     | Yes                 |
