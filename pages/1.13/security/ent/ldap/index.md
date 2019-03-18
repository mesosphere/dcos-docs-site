---
layout: layout.pug
navigationTitle:  LDAP authentication
title: LDAP authentication
menuWeight: 50
excerpt: Setting up a directory-based authentication server via LDAP
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


If your organization has user records stored in a directory server supporting LDAP, you can configure DC/OS Enterprise to check user credentials against it. This allows you to avoid having to recreate your user accounts within DC/OS. In versions 1.12 and later, DCOS [synchronizes with your LDAP](/1.13/security/ent/ldap/ldap-sync/) periodically, making it even easier to keep your groups and users up to date. 

When a user attempts to log in, DC/OS will ask the remote LDAP server to validate the credentials. DC/OS never receives or stores the passwords of remote users. For this reason, if DC/OS cannot connect to the remote LDAP, such as if someone has changed or deleted the LDAP configuration, the user's login will fail. DC/OS does store an internal representation of the user to allow the DC/OS administrator to put the user into a group and assign permissions.

If your LDAP user name is in the [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns), you can use a simple bind to connect to the LDAP directory. Otherwise, a search/bind connection should cover all other cases. 

Review the DC/OS user ID requirements in [Managing users and groups](/1.13/security/ent/users-groups/).

**Requirement** The directory server must support [LDAP 3](https://tools.ietf.org/html/rfc4511).

To set up an LDAP connection:

1. [Configure your connection](/1.13/security/ent/ldap/ldap-conn/).

2. [Configure your authentication](/1.13/security/ent/ldap/ldap-auth/).

3. [Verify the connection](/1.13/security/ent/ldap/ldap-verify/).
