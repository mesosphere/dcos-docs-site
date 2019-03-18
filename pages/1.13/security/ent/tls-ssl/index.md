---
layout: layout.pug
navigationTitle:  Securing Communication with TLS
title: Securing Communication with TLS
menuWeight: 120
excerpt: Securing encrypted communications using TLS certificates

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Your DC/OS certificate authority (CA) signs the TLS certificates and provisions them to systemd-started services during the bootstrap sequence. This accomplishes encrypted communications with no manual intervention. Each DC/OS cluster has its own DC/OS CA and a unique root certificate. Because your DC/OS CA does not appear in any lists of trusted certificate authorities, requests coming in from outside the cluster, such as from a browser or `curl`, will result in warning messages. To establish trusted communications with your DC/OS cluster and stop the warning messages:

1. Obtain the [DC/OS CA bundle](/1.13/security/ent/tls-ssl/get-cert/).

1. Perform one of the following:

     - Manually add your DC/OS CA as a trusted authority in [browser](/1.13/security/ent/tls-ssl/ca-trust-browser/), [DC/OS CLI](/1.13/security/ent/tls-ssl/ca-trust-cli/), [curl commands](/1.13/security/ent/tls-ssl/ca-trust-curl/), and other clients.

     - [Set up a proxy](/1.13/security/ent/tls-ssl/haproxy-adminrouter/) between Admin Router and user agent requests coming in from outside of the cluster.
