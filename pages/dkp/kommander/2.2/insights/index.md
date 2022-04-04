---
layout: layout.pug
navigationTitle: DKP Insights
title: DKP Insights
excerpt: Use DKP Insights to monitor and tune your environment
menuWeight: 55
beta: false
enterprise: false
techPreview: true
---

<p class="message--note"><strong>NOTE:</strong> We are offering DKP Insights with this release as a Technical preview only. </p>

We designed DKP Insights to assist Kubernetes Administrators with daily tasks, such as checking for security issues, monitoring resource usage, verifying that workloads and clusters follow best practices, and resolving common issues. DKP Insights collects logs, events, and metrics from the DKP Management cluster and managed or attached Kubernetes clusters. It then generates rules-based insights on potential problems of varying critical levels so that you can quickly identify and resolve them yourself.

DKP Insights works seamlessly within networked or air-gapped environments. It collects metrics, logs, and events from multiple data sources and uses rule-based heuristics to detect issues from the data and generate insight items for the users.

You can filter the insight items for a selected cluster or project by:

- Project name
- Cluster name
- Description

From the DKP Workspace Dashboard, you can toggle by severity level:

- Critical
- Warning
- Notice/informational

Alternately, the DKP Insights dashboard gives you several different ways to filter and sort insight items. Access the DKP Insights dashboard by selecting Insights from the sidebar menu.

## Architecture

<add diagram & description>