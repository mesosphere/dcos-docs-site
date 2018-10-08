---
layout: layout.pug
excerpt:
title: DC/OS Open Source Security
menuWeight: 80
oss: true
---

Ensure the network is setup according to the information for [securing your cluster](/1.10/administering-clusters/securing-your-cluster/).

You can enable authentication in your datacenter with DC/OS [oauth](https://github.com/dcos/dcos-oauth). Authentication is managed through the DC/OS web interface. The Admin Router enforces access control.

Out of the box DC/OS has an OpenID Connect 1.0 endpoint at [dcos.auth0.com](https://dcos.auth0.com/.well-known/openid-configuration) (in cooperation with [Auth0](https://auth0.com/)) with connections to Google, GitHub, and Microsoft to provide basic authentication for DC/OS installations. DC/OS automatically adds the first user that logs in to the DC/OS cluster.

DC/OS uses the JSON Web Token (JWT) format for its authentication tokens. JWT is an open, industry standard ([RFC
7519](https://tools.ietf.org/html/rfc7519)) method for securely representing claims between two parties. JWTs are obtained using
[OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html), which is a simple identity layer built on top of the
[OAuth 2.0](http://oauth.net/2/) protocol.

DC/OS OAuth provides an HTTP API for managing local users in a RESTful fashion.

![Auth0 badge](/1.10/img/a0-badge-light.png)
