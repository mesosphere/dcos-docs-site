---
layout: layout.pug
navigationTitle:  Directory-based authentication via LDAP
title: Directory-based authentication via LDAP
menuWeight: 50
excerpt:
preview: true
enterprise: true
---



If your organization has user records stored in a directory server supporting LDAP, you can configure DC/OS Enterprise to check user credentials against it. This allows you to avoid having to recreate your user accounts within DC/OS.

When the user attempts to login, DC/OS will ask the remote LDAP server to validate the credentials. DC/OS never receives or stores the passwords of remote users. For this reason, if DC/OS cannot connect to the remote LDAP, such as because someone has changed or deleted the LDAP configuration, the user's login will fail. DC/OS does store an internal representation of the user to allow the DC/OS administrator to put the user into a group and assign permissions.

If your LDAP user name is in the [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns), you can use a simple bind to connect to the LDAP directory. Otherwise, a search/bind connection should cover all other cases.

**Important:** Review the DC/OS user ID requirements in [Managing users and groups](/1.10/security/ent/users-groups/).

**Requirement** The directory server must support [LDAP 3](https://tools.ietf.org/html/rfc4511).

To set up an LDAP connection:

1. [Configure your connection](/1.10/security/ent/ldap/ldap-conn/).

2. [Configure your authentication](/1.10/security/ent/ldap/ldap-auth/).

3. [Verify the connection](/1.10/security/ent/ldap/ldap-verify/).
