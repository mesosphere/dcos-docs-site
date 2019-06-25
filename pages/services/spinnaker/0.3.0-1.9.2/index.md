---
layout: layout.pug
navigationTitle: Spinnaker 0.3.0-1.9.2
title: Spinnaker 0.3.0-1.9.2
menuWeight: 1
excerpt: Documentation for DC/OS Spinnaker 0.3.0-1.9.2
model: /services/spinnaker/data.yml
render: mustache
featureMaturity:
enterprise: true
community: true
---

DC/OS {{ model.techName }} Service is an autonomous service that makes it easy to deploy and operate {{ model.serverName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{ model.techName }}, see the [{{ model.techName }} documentation](https://github.com/spinnaker/spinnaker).

<p class="message--note"><strong>NOTE: </strong>The DC/OS {{ model.techName }} service currently only works with DC/OS Enterprise.</p>

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks
2. One click install
3. Automated failure recovery
4. Automated configuration changes
5. Automated scaling
6. High availability
7. TLS support
8. Strict mode support
9. Rack/Zone awareness

## Main features 
1. Deliver containers to DC/OS and Kubernetes
2. Delivery pipelines
3. Triggers - Dockerhub, Github, Jenkins, ...
4. Notifications - Gmail, Slack, Pagerduty, ...
5. Persistence to S3 compatible store or GCS
6. OAuth2 authentication
