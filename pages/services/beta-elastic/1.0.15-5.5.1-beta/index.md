---
layout: layout.pug
navigationTitle:  Beta Elastic 1.0.15-5.5.1-beta
title: Beta Elastic 1.0.15-5.5.1-beta
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>Warning: Beta Software</b></p>
<p>There may be bugs, incomplete features, incorrect documentation, or other discrepancies. Contact Mesosphere before deploying a beta candidate service. Product support is available to approved participants in the beta test program.</p>
<p style="margin:0;">Contact <a href="mailto:support@mesosphere.io">support@mesosphere.io</a> for information about participation.</p>
</div>

DC/OS Elastic Service is an automated service that makes it easy to deploy and manage Elastic on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing an Elasticsearch cluster. Elasticsearch is a distributed, multitenant-capable, full-text search engine with an HTTP web interface and schema-free JSON documents. Elasticsearch clusters are highly available, fault tolerant, and durable. For more information on Elasticsearch, visit the [Elastic](https://www.elastic.co/) site. Multiple Elasticsearch clusters can be installed on DC/OS and managed independently, so you can offer Elasticsearch as a managed service to your organization with or without the commercial X-Pack capabilities.

# Benefits

DC/OS Elastic offers the following benefits of a semi-managed service:

*   Easy installation
*   Elastic scaling of nodes
*   Replication for high availability
*   Elasticsearch cluster and node monitoring

# Features

DC/OS Elastic provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple clusters for multiple tenancy with DC/OS
*   High availability runtime configuration and software updates
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
*   Automatic reporting of Elasticsearch metrics to DC/OS statsd collector
