---
layout: layout.pug
navigationTitle:  Verification 
title: Verification 
menuWeight: 3
excerpt: Verifying your connection to the LDAP server
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

In this section, you will verify that the parameters you provided allow DC/OS to connect to the LDAP server.

1. Click **Test Connection** to validate your connection.

1. Enter the user ID of a user in the external LDAP directory in the **LDAP Username** field. The `%(username)s` string will be replaced with the user ID that you supply. 

    To simulate an actual login as closely as possible, we recommend using the credentials of a user other than the lookup user.

1. Type the user's password in the **LDAP Password** field.

1. Click **Test Connection**.

1. You should see this message: `Connection with LDAP server was successful!`. If the test fails, read the error message to determine and fix the issue.
