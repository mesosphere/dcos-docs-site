---
layout: layout.pug
navigationTitle:  Operations
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

# Air gapped deployments

How to deploy and operate Dispatch in an [air gapped](airgap-support/) or non-internet connected environment.

# Garbage Collection

Configure the age at which resources are [garbage collected](garbage-collection/).

# Monitoring

[Monitor Dispatch](monitoring/) using Prometheus for metrics.

# Scaling ArgoCD

Recommendations on [scaling ArgoCD](scaling/) for Dispatch.
