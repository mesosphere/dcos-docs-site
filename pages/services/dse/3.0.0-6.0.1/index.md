---
layout: layout.pug
navigationTitle: DSE 3.0.0-6.0.1
title: DSE 3.0.0-6.0.1
menuWeight: 1
excerpt: DataStax Enterprise (DSE) Service is an automated service that makes it easy to deploy and manage DataStax Enterprise clusters on Mesosphere DC/OS.
model: /services/dse/data.yml
render: mustache
---

{{ model.techName }} ({{ model.techShortName }}) Service is an automated service that makes it easy to deploy and manage {{ model.techName }} clusters on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a {{ model.techMidName }} cluster. {{ model.techName }} helps customers of all sizes build and run cloud-native applications at epic scale.  Our customers have been using our technology to build personalization, IoT, and Customer 360 type applications, just to name a few.  Inside {{ model.techName }}, you will find Solr to power our Search capability, Spark for Analytics, and a graph database for highly connected data sets. Multiple {{ model.techMidName }} clusters can be installed on DC/OS and managed independently, so you can offer {{ model.techName }} as a managed service to your organization.

## Features

- Auto-configured {{ model.techOpsName }} ({{ model.opsPackageName }} package) or point to external {{ model.techOpsName }}
- Multiple instances sharing the same physical systems (requires custom port configuration)
- Vertical (resource) and horizontal (node count) scaling
- Easy redeployment to new systems upon scheduled or unscheduled outages
- Consistent DNS addresses regardless of where nodes are located in the cluster
- Node placement may be customized via Placement Constraints


## Terms of Use

- Customers will be at their own risk if any failure arises when using a non-default DSE package settings without a service engagement with {{ model.techMidName }}.
- This integration is {{ model.techMidName }} licensed and for {{ model.techName }} customers only.
