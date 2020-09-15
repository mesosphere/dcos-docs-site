---
layout: layout.pug
navigationTitle: Access and Authentication
title: Access and Authentication
menuWeight: 10
excerpt: Manage cluster security, authentication, and authorization for the Konvoy cluster
enterprise: false
---

As Konvoy uses the [Kubernetes security mechanisms].
This includes role-based access control (RBAC) for determining which resources a user can access.

The OpenID Connect interface identifies users. This interface supports login using multiple connectors, including GitHub, Google, and LDAP.

[Kubernetes security mechanisms]: https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
