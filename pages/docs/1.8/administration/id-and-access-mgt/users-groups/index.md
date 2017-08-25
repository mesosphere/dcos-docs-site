---
layout: layout.pug
title: Managing users and groups
menuWeight: 0
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Managing users and groups
---




Enterprise DC/OS can manage two types of users:

* **Local**: local user accounts exist only in DC/OS.

* **External**: DC/OS stores only the user's ID or user name, along with other DC/OS-specific information, such as permissions and group membership. DC/OS never receives or stores the passwords of external users. Instead, it delegates the verification of the user's credentials to one of the following: LDAP directory, SAML, or OpenID Connect.

All users must have a unique identifier, i.e., a user ID or user name. Because DC/OS needs to pass the user's name or ID in URLs, it cannot contain any spaces or commas. Only the following characters are supported: lowercase alphabet, uppercase alphabet, numbers, `@`, `.`, `\`, `_`, and `-`.

Enterprise DC/OS also allows you to create groups of users and import groups of users from LDAP. Groups can make it easier to manage permissions. Instead of assigning permissions to each user account individually, you can assign the permissions to an entire group of users at once. 

Importing groups from LDAP makes it easier to add external users.
