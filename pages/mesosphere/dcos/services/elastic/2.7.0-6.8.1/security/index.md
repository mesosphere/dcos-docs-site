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

For a step-by-step guide on deploying a secure Elastic service check out [Deploying a Secure Elastic Service](/mesosphere/dcos/services/elastic/2.7.0-6.8.1/how-to-guides/#deploying-a-security-elastic-service).

## Transport Encryption

#include /mesosphere/dcos/services/include/security-transport-encryption-lead-in.tmpl

#include /mesosphere/dcos/services/include/security-configure-transport-encryption.tmpl

<p class="message--note"><strong>NOTE: </strong> It is possible to enable Transport Encryption after initial installation, but it requires setting <code>service.update_strategy</code> to <code>parallel</code>. After the update is complete, <code>service.update_strategy</code> should be set back to <code>serial</code>.</p>

<p class="message--warning"><strong>WARNING: </strong> Because the update must occur in parallel, the service will be unavailable during the transition. Additionally, clients will need to be reconfigured after the transition.</p>

#include /mesosphere/dcos/services/include/security-transport-encryption-clients.tmpl

### Forwarding DNS and Custom Domain

Every DC/OS cluster has a unique cryptographic ID which can be used to forward DNS queries to that cluster. To securely expose the service outside the cluster, external clients must have an upstream resolver configured to forward DNS queries to the DC/OS cluster of the service as described [here](/mesosphere/dcos/latest/networking/DNS/mesos-dns/expose-mesos-zone/).

With only forwarding configured, DNS entries within the DC/OS cluster will be resolvable at `<task-domain>.autoip.dcos.<cryptographic-id>.dcos.directory`. However, if you configure a DNS alias, you can use a custom domain. For example, `<task-domain>.cluster-1.acmeco.net`. In either case, the DC/OS {{ model.techName }} service will need to be installed with an additional security option:
```json
{
    "service": {
        "security": {
            "custom_domain": "<custom-domain>"
        }
    }
}
```
where `<custom-domain>` is one of `autoip.dcos.<cryptographic-id>.dcos.directory` or your organization's specific domain (e.g., `cluster-1.acmeco.net`).

As a concrete example, using the custom domain of `cluster-1.acmeco.net` the node 0 task would have a host of `node-0-server.<service-name>.cluster-1.acmeco.net`.


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
