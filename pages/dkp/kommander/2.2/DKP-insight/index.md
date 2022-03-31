---
layout: layout.pug
beta: false
navigationTitle: DKP Insight
title: DKP Insight
excerpt: Use DKP Insights to monitor and tune your environment
menuWeight: 55
beta: true
enterprise: false
---

<p class="message--note"><strong>NOTE:</strong> Insights capability is offered with this release as a Technical preview only. </p>

We designed DKP Insights to assist Kubernetes Administrators with daily tasks, such as ensuring your clusters are secure, debugging, monitoring, and anticipating issues. DKP Insights collects logs, events, and metrics from the DKP Management cluster and managed or attached Kubernetes clusters. It then generates rules-based insights on potential problems of varying critical levels so that you can quickly identify and resolve them yourself.

DKP Insights works seamlessly within networked or air-gapped environments. It collects metrics, logs, and events from multiple data sources and uses rule-based heuristics to detect issues from the data and generate insight items for the users.

You can filter the Insights summary cards using one or more categories for a selected cluster and project:

- All Insights
- Availability
- Best Practices
- Configuration
- Cost
- Performance
- Security
- Upgrade
- Environment
