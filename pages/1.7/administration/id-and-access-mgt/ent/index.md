---
layout: layout.pug
title: Identity and Access Management in DC/OS Enterprise
menuWeight: 20 
excerpt:
enterprise: true

---






During installation, DC/OS creates an initial user account with `superuser` privileges. The person installing DC/OS sets the name and password of this account. At least one account with `superuser` privileges is required at all times.

Super users can manage DC/OS users, groups, permissions, and LDAP configuration settings using either a graphical user interface or a RESTful API.

You can define permissions using access control lists (ACLs). Permissions consist of users or groups of users and the services they are permitted to access. For Marathon services, you can further specify create, read, or delete permissions.
