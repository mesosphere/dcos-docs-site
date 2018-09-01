---
layout: layout.pug
navigationTitle:
excerpt:
title: Configuration
menuWeight: 20
model: /services/couchbase/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl

## Configuring for Production
In a production deployment each couchbase server service personality (data, index, query, full text search, eventing, and analytics) runs in its own container. In the respective service personality configuration sections you select the count you want. The following sample shows 2 data, 1 index, 1 query, 1 fts, 1 eventing, and 1 analytics service.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_1.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_1.png)

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_2.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_prod_conf_2.png)

Since all couchbase service nodes require the same ports you will in the former sample have to have a DC/OS cluster with 7 private agents.

Higher `density` can be achieved by using `virtual networking` where each container get its own IP. In combination with `placement constraints` you can then also colocate services on the same DC/OS agent as fits your specific needs.

## Configuring for Development
In a development deployment data nodes have all couchbase server service personalities (data, index, query, full text search, eventing, and analytics).

The following configuration steps are necessary.

In the `data service` configuration section `check` the following.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_1.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_1.png)

In the `data, index, fts, eventing , and analytics` service configuration section set `mem usable` so that the sum of them all is no more then 80% of `mem` congigured for data services. More on couchbase server memory management can be found [here](https://developer.couchbase.com/documentation/server/current/understanding-couchbase/buckets-memory-and-storage/memory.html).

The `service counts` for `index, fts, eventing , and analytics` should stay `0`.

Since now all couchbase service personalities run on the `data service nodes` their `cpu count` should be increased.

The following shows the deployment of 2 data nodes that have all the couchbase service personalities.

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_2.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_2.png)

[<img src="/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_3.png" alt="Couchbase Install"/>](/services/couchbase/0.2.0-5.5.0/img/couch_dev_conf_3.png)
