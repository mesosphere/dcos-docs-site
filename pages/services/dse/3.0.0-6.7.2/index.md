---
layout: layout.pug
navigationTitle: DSE 3.0.0-6.7.2
title: DSE 3.0.0-6.7.2
menuWeight: 1
excerpt: Build and run cloud-native applications
model: /services/dse/data.yml
render: mustache
enterprise: true
---

{{ model.techName }} ({{ model.techShortName }}) Service is an automated service that makes it easy to deploy and manage {{ model.techName }} clusters on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a DataStax cluster. {{ model.techName }} helps customers of all sizes build and run cloud-native applications at epic scale.  Our customers have been using our technology to build personalization, IoT, and Customer 360 type applications, just to name a few.  Inside {{ model.techName }}, you will find Solr to power our search capability, Spark for analytics, and a graph database for highly connected data sets. Multiple {{ model.techShortName }} clusters can be installed on DC/OS and managed independently, so you can offer {{ model.techName }} as a managed service to your organization.

## Features

- Auto-configured OpsCenter (datastax-ops package) or point to external OpsCenter.
- Multiple instances sharing the same physical systems (requires custom port configuration).
- Vertical (resource) and horizontal (node count) scaling.
- Easy redeployment to new systems upon scheduled or unscheduled outages.
- Consistent DNS addresses regardless of where nodes are located in the cluster.
- Node placement may be customized via Placement Constraints.


## Terms of Use

- Customers will be at their own risk if any failure arises when using non-default {{ model.shortTechName }} package settings without a service engagement with DataStax.
- This integration is DataStax licensed and for {{ model.techName }} customers only.
