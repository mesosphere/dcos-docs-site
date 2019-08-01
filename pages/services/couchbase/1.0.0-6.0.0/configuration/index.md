---
layout: layout.pug
navigationTitle:
excerpt: Configuring Couchbase for production and development
title: Configuration
menuWeight: 20
model: /services/couchbase/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/configuration-install-with-options.tmpl
#include /mesosphere/dcos/services/include/configuration-service-settings.tmpl

## Configuring for Production
In a production deployment, each {{ model.serverName }} service type (`data`, `index`, `query`, `full text search`, `eventing`, and `analytics`) runs in its own container. In the respective service type configuration sections, you select the count you want. The following sample shows {{ model.configure.nodeDescription }} in the {{ model.productName }} dashboard and the {{ model.techName }} dashboard.

[<img src="/services/couchbase/1.0.0-6.0.0/img/couch_prod_conf_1.png" alt="Couchbase Install"/>](/mesosphere/dcos/services/couchbase/1.0.0-6.0.0/img/couch_prod_conf_1.png)

Figure 1. Sample configuration in {{ model.productName }} dashboard

[<img src="/services/couchbase/1.0.0-6.0.0/img/couch_prod_conf_2.png" alt="Couchbase Install"/>](/mesosphere/dcos/services/couchbase/1.0.0-6.0.0/img/couch_prod_conf_2.png)

Figure 2. Sample configuration in {{ model.techName }} dashboard

Since all {{ model.techName }} service nodes require the same ports, in the Figure 2, you must have a {{ model.productName }} cluster with 7 private agents. Higher density can be achieved by using virtual networking where each container get its own IP. In combination with placement constraints, you can then also co-locate services on the same {{ model.productName }} agent, as fits your specific needs.

## Configuring for Development
In a development deployment, data nodes have all {{ model.serverName }} service types (`data`, `index`, `query`, `full text search`, `eventing`, and `analytics`).

In the Data Service configuration section, check the `all services enabled` box:

[<img src="/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_1.png" alt="Couchbase Install"/>](/mesosphere/dcos/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_1.png)

Figure 3. Enabling all services

The following images show the deployment of two data nodes that have all the {{ model.techName }} service types.

[<img src="/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_2.png" alt="Couchbase Install"/>](/mesosphere/dcos/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_2.png)

Figure 4. Data node configuration shown on {{ model.productName }} dashboard

[<img src="/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_3.png" alt="Couchbase Install"/>](/mesosphere/dcos/services/couchbase/1.0.0-6.0.0/img/couch_dev_conf_3.png)

Figure 5. Data node configuration shown on {{ model.techName }} dashboard

<p class="message--note"><strong>NOTE: </strong> In the <code>data</code>, <code>index</code>, <code>fts</code>, <code>eventing</code>, and <code>analytics</code> service configuration sections, set <code>mem usable</code> so that the sum of them all is no more then 80% of <code>mem</code> configured for data services. More on {{ model.serverName }} memory management can be found <a href="https://developer.couchbase.com/documentation/server/current/understanding-couchbase/buckets-memory-and-storage/memory.html">here</a>. Also the <code>service counts</code> for <code>index</code>, <code>fts</code>, <code>eventing</code>, and <code>analytics</code> should stay at 0. Since now all {{ model.serverName }} types run on the Data Service nodes, their <code>cpu count</code> should be increased.</p>
