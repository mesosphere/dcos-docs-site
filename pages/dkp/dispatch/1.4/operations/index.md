---
layout: layout.pug
navigationTitle: Operations
title: Operations
menuWeight: 50
beta: false
excerpt: Operational Day Two processes for D2iQ Dispatch.
---
This section covers garbage collection, logging, monitoring, and scaling your Dispatch deployment.

# Logging

Dispatch uses Kibana to [review logs](logging/) using standard query syntax.

# Pipelinerun Artifacts

You can configure pipelines to store the artifacts and view them via CLI/GUI.

# Airgapped Deployments

How to deploy and operate Dispatch in an [airgapped](airgap-support/) or non-internet connected environment.

# Garbage Collection

Configure the age at which resources are [garbage collected](garbage-collection/).

# Monitoring

[Monitor Dispatch](monitoring/) using Prometheus for metrics.

# Resource Management

You can configure tolerations, affinity, nodeSelector, etc. on pods launched from pipelineruns by creating a Tekton [pod template](https://github.com/tektoncd/pipeline/blob/v0.14.2/docs/podtemplates.md) and configuring the repository to use it. [Follow the guide here.](resource-management/)
