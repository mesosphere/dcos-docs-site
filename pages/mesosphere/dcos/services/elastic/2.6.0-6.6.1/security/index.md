---
layout: layout.pug
navigationTitle: Security
excerpt: Security features of DC/OS Elastic service
title: Security
menuWeight: 50
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techName }}'s X-Pack transport encryption mechanisms. The service provides automation and orchestration to simplify the use of these important features. At this time, X-Pack's authentication and authorization features are not supported.

A good overview of X-Pack can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/6.3/setup-xpack.html).

<p class="message--note"><strong>NOTE: </strong> These security features are only available on DC/OS Enterprise 1.10 and later.</p>

## Transport Encryption

#include /mesosphere/dcos/services/include/security-transport-encryption-lead-in.tmpl

#include /mesosphere/dcos/services/include/security-configure-transport-encryption.tmpl

<p class="message--note"><strong>NOTE: </strong> It is possible to enable Transport Encryption after initial installation, but it requires setting <code>service.update_strategy</code> to <code>parallel</code>. After the update is complete, <code>service.update_strategy</code> should be set back to <code>serial</code>.</p>

<p class="message--warning"><strong>WARNING: </strong> Because the update must occur in parallel, the service will be unavailable during the transition. Additionally, clients will need to be reconfigured after the transition.</p>

#include /mesosphere/dcos/services/include/security-transport-encryption-clients.tmpl


#### Kibana

To use the DC/OS Kibana service in tandem with DC/OS {{ model.techName }} when the latter has Transport Encryption enabled, install (or update) Kibana with the following options in addition to your own:

```json
{
    "kibana": {
        "elasticsearch_tls": true,
        "elasticsearch_url": "https://<elastic-coordinator-vip>"
    }
}
```
This configures the Kibana service to connect securely to the DC/OS {{ model.techName }} Service.

<p class="message--note"><strong>NOTE: </strong>Currently, the Kibana service does not support Transport Encryption for its own clients.</p>
