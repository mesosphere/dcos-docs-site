---
layout: layout.pug
navigationTitle:  Specifying Authentication and Parameters
title: Specifying Authentication and Parameters
menuWeight: 2
excerpt: Specifying authentication method and parameters for your LDAP directory
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


In this section you will set up the authentication method and parameters for your LDAP directory.

# Selecting the authentication method

1. Once you have finished specifying your connection parameters in the **Connection** tab, click **Authentication**.

1.  Provide the full DN of the user account you will use to connect to the LDAP server to import users, groups, and check user credentials in the **Lookup DN** field. A few examples follow.

        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com

  **Tip:** We recommend a read-only user account.

1. Provide the password of the account in the **Lookup Password** field.

1. Select one of the following.

    - **Simple bind**: if your LDAP user name is part of your [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns).

    - **Search/bind**: if you have an LDAP user name that is not a part of the [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns).

1.  Refer to the section that corresponds to your selection.

    - [Specifying simple bind parameters](#specifying-simple-bind-parameters)

    - [Specifying search/bind parameters](#specifying-searchbind-parameters)

# Specifying simple bind parameters

1.  Type a DN template that the external LDAP directory can use to locate user accounts in the **User DN Template** field. This string must include `%(username)s`, which DC/OS will replace with the user name provided by the user at login. Some examples follow.

        cn=%(username)s,dc=los-pollos,dc=io
        uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=%(username)s,ou=users,dc=example,dc=com

1.  When you have completed your entries, the dialog should look something like the following.

   ![Simple bind parameters](/1.13/img/ldap-add-dir-auth-simple-bind.png)

   Figure 1. Simple bind parameters 

1.  Click **Add Directory**.

1.  [Verify your connection](/1.13/security/ent/ldap/ldap-verify/).


# Specifying search/bind parameters

While the simple bind connection takes place in a single step, the search/bind operation requires two steps. First the directory is searched for the user name attribute. If located, a bind operation ensues to check the user's credentials against the external directory.

1.  In the **User Search Base** field, specify where in the directory to begin the search for the LDAP user name. This should be the DN of the [search base object](https://technet.microsoft.com/en-us/library/cc978021.aspx). Example: `cn=Users,dc=example,dc=com`

1.  Specify the template for translating the LDAP user name to a valid LDAP search filter in the **User Search Filter Template** field. Must contain the following placeholder: `%(username)s` Examples:

    - `(sAMAccountName=%(username)s)`
    - `(uid=%(username)s)`

1.  When you have completed your entries, the dialog should look something like the following.

   ![Search/bind parameters](/1.13/img/ldap-add-dir-auth-search-bind.png)

   Figure 2. Search bind parameters

1.  Click **Add Directory**.

1.  [Verify your connection](/1.13/security/ent/ldap/ldap-verify/).
