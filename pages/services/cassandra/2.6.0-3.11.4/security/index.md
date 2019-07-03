---
layout: layout.pug
navigationTitle: Security
excerpt: Securing your service
title: DC/OS Cassandra security
menuWeight: 50
model: /services/cassandra/data.yml
render: mustache
enterprise: true
---

# DC/OS {{ model.techName }} Security

- The DC/OS {{ model.techName }} service allows you to create a service account to configure access for {{ model.techName }}. The service allows you to create and assign permissions as required for access.  

- The DC/OS {{ model.techName }} service supports {{ model.techName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of the following features.

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>


#include /services/include/service-account.tmpl

#include /services/include/security-create-permissions.tmpl

# <a name="transport_encryption"></a> Transport Encryption

#include /services/include/security-transport-encryption-lead-in.tmpl

#include /services/include/security-configure-transport-encryption.tmpl

<p class="message--note"><strong>NOTE: </strong>It is possible to update a running DC/OS Apache Cassandra service to enable transport encryption after initial installation, but the service may be unavailable during the transition. Additionally, your clients will need to be reconfigured unless <tt>service.security.transport_encryption.allow_plaintext</tt> is set to <tt>true</tt>.</p>

#include /services/include/security-transport-encryption-clients.tmpl

# <a name="Forwarding DNS and Custom Domain"></a> Forwarding DNS and Custom Domain

Every DC/OS cluster has a unique cryptographic ID which can be used to forward DNS queries to that cluster. To securely expose the service outside the cluster, external clients must have an upstream resolver configured to forward DNS queries to the DC/OS cluster of the service as described [here](https://docs.mesosphere.com/latest/networking/DNS/mesos-dns/expose-mesos-zone/).

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

