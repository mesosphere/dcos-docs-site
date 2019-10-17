---
layout: layout.pug
excerpt: Managing security in your datacenter using DC/OS Open Source
title: DC/OS Open Source Security
render: mustache
model: /mesosphere/dcos/1.14/data.yml
menuWeight: 80
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

Ensure the network is set up according to the information for [securing your cluster](/mesosphere/dcos/1.14/administering-clusters/securing-your-cluster/).

All access management in DC/OS is done via the DC/OS Identity and Access Manager (IAM). This includes user account management, login, and authentication token distribution. The IAM provides an HTTP API for managing user accounts in a RESTful fashion.

Authentication tokens can be obtained using [OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html), which is an identity layer built on top of the [OAuth 2.0](http://oauth.net/2/) protocol.

Local user and service accounts can be configured for logging in without external dependencies and for automating authentication against the cluster in a secure manner.

# Further reading

- [Let’s encrypt DC/OS!](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/):
  a blog post about using [Let's Encrypt](https://letsencrypt.org/) with
  services running on DC/OS.

# Future work

We are looking forward to working with the DC/OS community on improving existing
security features as well as on introducing new ones in the coming releases.

# Next Steps

- [Understand DC/OS security](/mesosphere/dcos/1.14/administering-clusters/)
- [Learn how to monitor a DC/OS cluster](/mesosphere/dcos/1.14/monitoring/)
