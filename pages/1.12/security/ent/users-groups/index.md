---
layout: layout.pug
navigationTitle:  Managing users and groups
title: Managing Users and Groups
menuWeight: 0
excerpt: Managing users and groups

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS Enterprise can manage two types of users:

* **Local**: Local user accounts exist only in DC/OS.

* **External**: DC/OS stores only the user's ID or user name, along with other DC/OS-specific information, such as permissions and group membership. DC/OS never receives or stores the passwords of external users. Instead, it delegates the verification of the user's credentials to one of the following: LDAP directory, SAML, or OpenID Connect.

DC/OS Enterprise also allows you to create groups of users and import groups of users from LDAP. Groups can make it easier to manage permissions. Instead of assigning permissions to each user account individually, you can assign the permissions to an entire group of users at once.

Importing groups from LDAP makes it easier to add external users.
