---
layout: layout.pug
navigationTitle:
excerpt: Configuring Couchbase for production and development
title: Configuration
menuWeight: 20
model: /services/couchbase/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl

## Configuring for Production
In a production deployment, each {{ model.serverName }} service type (`data`, `index`, `query`, `full text search`, `eventing`, and `analytics`) runs in its own container. In the respective service type configuration sections, you select the count you want. The following sample shows {{ model.configure.nodeDescription }} in the DC/OS dashboard and the {{ model.techName }} dashboard.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_1.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_1.png)

Figure 1. Sample configuration in DC/OS dashboard

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_2.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_2.png)

Figure 2. Sample configuration in {{ model.techName }} dashboard

Since all {{ model.techName }} service nodes require the same ports, in the former sample you must have a DC/OS cluster with 7 private agents. Higher density can be achieved by using virtual networking where each container get its own IP. In combination with placement constraints, you can then also co-locate services on the same DC/OS agent, as fits your specific needs.

## Configuring for Development
In a development deployment, data nodes have all {{ model.serverName }} service types (`data`, `index`, `query`, `full text search`, `eventing`, and `analytics`).

1. In the Data Service configuration section, check the `all services enabled` box:

    [<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_1.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_1.png)

    Figure 3. Enabling all services

2. In the `data`, `index`, `fts`, `eventing` , and `analytics` service configuration section, set `mem usable` so that the sum of them all is no more then 80% of `mem` configured for data services. More on {{ model.serverName }} memory management can be found [here](https://developer.couchbase.com/documentation/server/current/understanding-couchbase/buckets-memory-and-storage/memory.html).

3. The `service counts` for `index`, `fts`, `eventing`, and `analytics` should stay at `0`. Since now all {{ model.serverName }} types run on the Data Service nodes, their `cpu count` should be increased.

The following images show the deployment of two data nodes that have all the {{ model.techName }} service types.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_2.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_2.png)

Figure 4. Data node configuration shown on DC/OS dashboard

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_3.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_3.png)

Figure 5. Data node configuration shown on {{ model.techName }} dashboard
