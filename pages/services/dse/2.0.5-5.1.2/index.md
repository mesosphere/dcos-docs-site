---
layout: layout.pug
navigationTitle:  DSE 2.0.5-5.1.2
title: DSE 2.0.5-5.1.2
menuWeight: -1
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


DataStax Enterprise (DSE) Service is an automated service that makes it easy to deploy and manage DataStax Enterprise clusters on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a DataStax cluster. DataStax Enterprise helps customers of all sizes build and run cloud-native applications at epic scale.  Our customers have been using our technology to build personalization, IoT, Customer 360 type applications, just to name a few.  Inside DataStax Enterprise, you will find Solr to power our Search capability, Spark for Analytics, and a graph database for highly connected data sets. Multiple DataStax clusters can be installed on DC/OS and managed independently, so you can offer DataStax Enterprise as a managed service to your organization.

## Features

- Auto-configured OpsCenter (datastax-ops package) or point to external OpsCenter.
- Multiple instances sharing the same physical systems (requires custom port configuration).
- Vertical (resource) and horizontal (node count) scaling.
- Easy redeployment to new systems upon scheduled or unscheduled outages.
- Consistent DNS addresses regardless of where nodes are located in the cluster.
- Node placement may be customized via Placement Constraints.
