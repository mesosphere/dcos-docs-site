---
layout: layout.pug
navigationTitle: Project Platform Application Configuration Requirements
title: Project Platform Application Configuration Requirements
menuWeight: 40
excerpt: Project Platform Application Descriptions and Resource Requirements
enterprise: false
draft: true
---

## Project Platform Application Requirements

Project Platform applications require more resources than solely deploying or attaching clusters into a project. Your cluster must have sufficient resources when deploying or attaching to ensure that the applications are installed successfully.

The following table describes all the project platform applications that are available to the clusters in a project, minimum resource requirements, and whether they are enabled by default.

| NAME                           | APP ID                  | Deployed by default |
| ------------------------------ | ----------------------- | ------------------- |
| project-grafana-logging-6.13.9 | project-grafana-logging | False              |
| project-grafana-loki-0.33.1    | project-grafana-loki    | False               |
| project-logging-1.0.0          | project-logging         | False               |
