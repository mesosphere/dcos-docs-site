---
layout: layout.pug
navigationTitle: Couchbase 0.3.0-5.5.3
title: Couchbase 0.3.0-5.5.3
menuWeight: 1
excerpt: Documentation for DC/OS Couchbase 0.3.0-5.5.3
model: /mesosphere/dcos/services/couchbase/data.yml
render: mustache
featureMaturity:
community: true
---

DC/OS {{ model.techName }} Service is an autonomous service that makes it easy to deploy and operate {{ model.serverName }} and the {{ model.syncGatewayName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Couchbase, see the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/introduction/intro.html).

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks
2. Supports {{ model.serverName }}
3. Supports {{ model.syncGatewayName }}
4. Supports multiple deployment modes
6. Automated failure recovery
7. Automated configuration changes
8. Automated scaling
9. Persistent volumes
10. Rack/Zone awareness
11. Centralized monitoring
12. Backup and restore using AWS S3 as backing store

DC/OS {{ model.techName }}'s main features are:
1. NoSQL document-oriented engagement database
2. First class support of mobile and IoT use cases
3. Multi dimensional scaling
4. High availability
5. [N1QL](https://www.couchbase.com/products/n1ql?_bt=253510071816&_bk=n1ql&_bm=e&_bn=g&gclid=EAIaIQobChMI-b-Z6MnC3QIVjvhkCh1qRQpYEAAYASABEgKAhPD_BwE)
6. Full text search
7. Built-in eventing and analytics
8. Enterprise grade security
