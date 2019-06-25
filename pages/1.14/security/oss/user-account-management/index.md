---
layout: layout.pug
navigationTitle:  User Account Management
title: User Account Management
menuWeight: 10
excerpt: Managing DC/OS user accounts
render: mustache
model: /data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS is designed as a multi-user system.

Open DC/OS can handle three types of user accounts:

* **External user accounts**: External user accounts exist for users who want to use their Google, GitHub, or Microsoft credentials. DC/OS never receives or stores the passwords of external users.
* **Local user accounts**: Local user accounts exist for users who want to create a user account within DC/OS. Usernames and password hashes are stored in IAM database.
* **Service accounts**: A machine interacting with DC/OS should always go through a service account login for obtaining an authentication token. Do not use a username/password-based login in that case.

User accounts can be managed by any authorized user. To bootstrap this process, in Open DC/OS an external user is automatically created by the first user who logs in via the web interface.

<p class="message--note"><strong>NOTE: </strong>Any user with access to DC/OS can create more user accounts. Each user account in DC/OS is an authorized administrator account, there is no explicit concept of privileges with Open DC/OS.</p>
