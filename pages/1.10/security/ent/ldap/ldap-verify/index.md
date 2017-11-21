---
layout: layout.pug
navigationTitle:  Verifying the LDAP connection
title: Verifying the LDAP connection
menuWeight: 3
excerpt: >
  Lastly, verify that the parameters you
  provided allow DC/OS to connect the LDAP
  server.
featureMaturity: preview
enterprise: true
---



1. Click **Test Connection** to validate your connection. 

1. Provide the user name of a user in the external LDAP directory in the **LDAP Username** field.  

    **Note**: The `%(username)s` string in will be replaced with the user ID that you supply.

    **Tip**: to simulate an actual login as a much as possible, we recommend using the credentials of a user other than the lookup user.

1. Type the user's password in the **LDAP Password** field.

1. Click **Test Connection**.

1. You should see this message: `Connection with LDAP server was successful!`. If the test fails, read the error message to determine and fix the issue.


