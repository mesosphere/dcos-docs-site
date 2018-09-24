---
layout: layout.pug
navigationTitle: Spinnaker 0.3.0-1.9.2
title: Spinnaker 0.3.0-1.9.2
menuWeight: 50
excerpt: Documentation for DC/OS Spinnaker 0.3.0-1.9.2
model: /services/spinnaker/data.yml
render: mustache
featureMaturity:
enterprise: false
---

DC/OS {{ model.techName }} Service is an autonomous service that makes it easy to deploy and operate {{ model.serverName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Spinnaker, see the [Spinnaker documentation](https://github.com/spinnaker/spinnaker).

**Note:** The DC/OS Spinnaker service currently only works with **DC/OS Enterprise**.

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the battle-proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks
2. One click install
3. Automated failure recovery
4. Automated configuration changes
5. Automated scaling
6. High availability
7. TLS support
8. Rack/Zone awareness

## DC/OS {{ model.techName }}'s main features are:
1. Delivery to DC/OS and Kubernetes
2. Delivery pipelines
3. Persistence to S3 compatible store (Minio is configured by default) or GCS
4. Triggers - dockerhub, github, jenkins, ...
5. Notifications - gmail, slack, pagerduty, ...
6. Oauth2 authentication
