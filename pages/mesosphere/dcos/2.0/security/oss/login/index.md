---
layout: layout.pug
navigationTitle: Login
title: Login
excerpt: Logging in to your DC/OS cluster
menuWeight: 20
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# User login

With DC/OS, login is the process of exchanging user credentials for a [DC/OS Authentication token](/mesosphere/dcos/2.0/security/oss/authentication/authentication-token/).

Users must obtain a DC/OS Authentication to use a DC/OS cluster. In DC/OS the lifetime of an Authentication token is limited to five days. Once the Authentication token expires, the user must log in again.

DC/OS handles multiple user types. User accounts can be managed via the [IAM API](/mesosphere/dcos/2.0/security/oss/iam-api/); see [User Management](/mesosphere/dcos/2.0/security/oss/user-management/).

Different login methods exist for different user types, but each one yields a DC/OS authentication token:

* **External user login**: External user accounts can only log in via single sign-on through Auth0 (using their Google, GitHub, or Microsoft credentials).
* **Local user login**: A local user logs in by entering a password which is compared to the password hash stored inside DC/OS.
* **Service login**: A service logs in by entering a short-lived "service login token", whose signature is verified using the service account public key stored inside DC/OS.

# User logout

Users cannot be actively logged out of DC/OS. As long as an issued DC/OS Authentication token exists and is valid, the user that it was issued for can operate the DC/OS cluster. However, a user can decide to delete any valid DC/OS Authentication token in their possession. The DC/OS CLI [auth logout](/mesosphere/dcos/2.0/cli/command-reference/dcos-auth/dcos-auth-logout/) command does exactly that.

<p class="message--note"><strong>NOTE: </strong>There is no way to revoke access to a DC/OS cluster other than to wait until the authentication token expires.</p>
