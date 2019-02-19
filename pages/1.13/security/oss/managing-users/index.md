---
layout: layout.pug
navigationTitle:  Managing users
title: Managing users
menuWeight: 0
excerpt: Managing users
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS can manage two types of users:

* **External**: DC/OS never receives or stores the passwords of external users. Instead, it delegates the verification of the user’s credentials to the Auth0 identity provider instance managed by Mesosphere. Only the user ID of one of the three available login providers Google, GitHub or Microsoft is stored inside DC/OS.
* **Local**: Local user accounts exist inside the DC/OS cluster.

Users can be added via the web interface, [DC/OS CLI](/1.13/cli) or via the [IAM API](/1.13/security/oss/iam-api/) depending on the user type.
For backwards compatibility reasons a command line script for adding external users is shipped with every DC/OS cluster.

Users can be granted access to DC/OS by another authorized user. To bootstrap this process a default external user is automatically created by the first user who logs in to the DC/OS cluster via the web interface.

<p class="message--note"><strong>NOTE: </strong>Any user with access to DC/OS can invite more users. Each DC/OS user is an administrator, there is no explicit concept of privileges with DC/OS.</p>
