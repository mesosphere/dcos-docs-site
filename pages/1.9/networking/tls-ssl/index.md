---
layout: layout.pug
navigationTitle:  Securing communication with TLS
title: Securing communication with TLS
menuWeight: 7
excerpt:

enterprise: false
---

In DC/OS open source, you can set up secure HTTPS communication using a custom server certificate with your DC/OS cluster by [setting up a proxy](/1.9/networking/tls-ssl/haproxy-adminrouter/) between the Admin Router and user agent requests coming in from outside of the cluster.

In DC/OS Enterprise `permissive` and `strict` security modes, your DC/OS Certificate Authority signs the TLS certificates and provisions them to systemd-started services during the bootstrap sequence. This accomplishes encrypted communications with no manual intervention. Each DC/OS cluster has its own DC/OS Certificate Authority and a unique root certificate to protect DC/OS clusters from each other. 

Because your DC/OS Certificate Authority does not appear in any lists of trusted certificate authorities, requests coming in from outside the cluster, such as from a browser or curl, will result in warning messages. 

To establish trusted communications with your DC/OS cluster and stop the warning messages:

1. [Obtain the root certificate of your DC/OS CA](/1.9/networking/tls-ssl/get-cert/).

1. Perform one of the following.
   
     - Manually add your DC/OS Certificate Authority as a trusted authority in [browser](/1.9/networking/tls-ssl/ca-trust-browser/), [DC/OS CLI](/1.9/networking/tls-ssl/ca-trust-cli/), [curl commands](/1.9/networking/tls-ssl/ca-trust-curl/), and other clients.

     - [Set up a proxy](/1.9/networking/tls-ssl/haproxy-adminrouter/) between the Admin Router and user agent requests coming in from outside of the cluster. 
