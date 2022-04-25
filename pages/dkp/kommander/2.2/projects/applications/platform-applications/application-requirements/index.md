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

Platform applications require more resources than solely deploying or attaching clusters into a project. Your cluster must have sufficient resources when deploying or attaching to ensure that the applications are installed successfully.

The following table describes all the platform applications that are available to the clusters in a project, minimum resource and persistent storage requirements, and whether they are enabled by default.

| Name | Minimum Resources Suggested | Minimum Persistent Storage Required | Deployed by Default |
| --- | --- | --- | --- |
| project-grafana-logging| cpu: 200m<br />memory: 100Mi |  | No |
| project-grafana-loki |  | # of PVs: 3<br />PV sizes: 10Gi x 3 (total: 30Gi) | No |
| project-logging |  |  | No |
