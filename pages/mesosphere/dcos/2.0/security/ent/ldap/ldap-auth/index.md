---
layout: layout.pug
navigationTitle:  Specifying Authentication and Parameters
title: Specifying Authentication and Parameters
menuWeight: 2
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: Specifying authentication method and parameters for your LDAP directory
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


In this section you will set up the authentication method and parameters for your LDAP directory. There are two bind types and two authentication methods you can use.

# Bind Types

Bind operations are used to authenticate clients to the directory server, establish an authorization identity that will be used for subsequent operations processed on that connection, and to specify the LDAP protocol version that the client will use.

There are two bind types available to you: 

- Anonymous Bind - Uses a simple bind or a search bind. Anyone can connect to the LDAP server. This bind type does not require a **Lookup DN** or **Lookup Password**. 
- LDAP Credentials - Requires a **Lookup DN** and **Lookup Password**. LDAP credentials must be previously established.

# Authentication methods

There are two authentication methods available to you.

- Simple bind. Authentication by simple bind is the most common way to authenticate an LDAP client, but you can also choose a search bind authentication method. You can either bind Anonymously, or you can provide LDAP credentials such as a lookup DN and lookup password. In either case, you must provide a user DN template. Choose Simple bind if your LDAP user name is part of your [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns).     

- Search bind. While the simple bind connection takes place in a single step, the search/bind operation requires two steps. First the directory is searched for the user name attribute. If located, a bind operation ensues to check the user's credentials against the external directory. You must specify a user search base and a user search filter template. In some methods, you must also specify a lookup DN and lookup password. Choose Search bind if you have an LDAP user name that is **not** a part of the [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns).

## Anonymous Bind with Simple Bind

When you choose Anonymous Bind with Simple Bind, you must provide a **User DN Template**.

1. In the **Add Directory** window, click **Authentication**.
1. Under **Bind Type**, click on **Anonymous Bind**. 
1. Under **Authentication Method**, click on **Simple Bind**.
1. Enter a DN template that the external LDAP directory can use to locate user accounts in the **User DN Template** field. This string must include `%(username)s`, which DC/OS will replace with the user name provided by the user at login. Some examples are:

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1.  When you have completed your entries, the dialog should look like the following.

    ![Simple bind parameters](/mesosphere/dcos/2.0/img/GUI-LDAP-anonymous-simple-bind.png)

    Figure 1. Anonymous Bind with Simple Bind parameters 

1.  Click **Add Directory**.

1.  [Verify your connection](/mesosphere/dcos/2.0/security/ent/ldap/ldap-verify/).

## Anonymous Bind with Search Bind

When you choose Anonymous Bind with Search Bind, you must provide a **User Search Base** and a **User Search Filter Template**.

1. In the **Add Directory** window, click **Authentication**.
1. Under **Bind Type**, click on **Anonymous Bind**. 
1. Under **Authentication Method**, click on **Search Bind**.
1. In the **User Search Base** field, specify where in the directory to begin the search for the LDAP user name. This should be the DN of the [search base object](https://technet.microsoft.com/en-us/library/cc978021.aspx). An example would be:

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1.  Specify the template for translating the LDAP user name to a valid LDAP search filter in the **User Search Filter Template** field. This entry must contain the following placeholder: `%(username)s`. Some examples would be:

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. When you have completed your entries, the dialog should look like the following:

    ![Anonymous Bind with Search](/mesosphere/dcos/2.0/img/GUI-LDAP-anonymous-search-bind.png)

    Figure 2. Anonymous Bind with Search Bind parameters

1.  Click **Add Directory**.
1.  [Verify your connection](/mesosphere/dcos/2.0/security/ent/ldap/ldap-verify/).

## LDAP Credentials with Simple Bind

When you choose **LDAP Credentials** as your bind type, and **Simple Bind** as your Authentication type, you must supply the **Lookup DN**, **Lookup Password**, and **User DN Template**.

1. In the **Add Directory** window, click **Authentication**.
1. Under **Bind Type**, click on **LDAP Credentials**.
1. Under **Authentication Method**, click **Simple bind**.
1. Provide the full DN of the user account you will use to connect to the LDAP server to import users, groups, and check user credentials in the **Lookup DN** field. A few examples are:

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>NOTE: </strong>We recommend a read-only user account.</p>

1. Provide the password of the account in the **Lookup Password** field.

1. Enter a DN template that the external LDAP directory can use to locate user accounts in the **User DN Template** field. This string must include `%(username)s`, which DC/OS will replace with the user name provided by the user at login. Some examples are:

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1.  When you have completed your entries, the dialog should look like the following.

    ![Simple bind parameters](/mesosphere/dcos/2.0/img/GUI-LDAP-credentials-simple.png)

    Figure 3. LDAP Credentials with Simple Bind parameters 

1.  Click **Add Directory**.

1.  [Verify your connection](/mesosphere/dcos/2.0/security/ent/ldap/ldap-verify/).

## LDAP Credentials with Search Bind

When you choose **LDAP Credentials** as your bind type, and **Search Bind** as your Authentication type, you must supply the **Lookup DN**, **Lookup Password**, **User Search Base** and **User Search Filter Template**.

1. In the **Add Directory** window, click **Authentication**.
1. Under **Bind Type**, click on **LDAP Credentials**.
1. Provide the full DN of the user account you will use to connect to the LDAP server to import users, groups, and check user credentials in the **Lookup DN** field. A few examples are:

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>NOTE: </strong>We recommend a read-only user account.</p>

1. Provide the password of the account in the **Lookup Password** field.
1. Under **Authentication Method**, click **Search bind**.
1. In the **User Search Base** field, specify where in the directory to begin the search for the LDAP user name. This should be the DN of the search base object. An example would be:

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1.  Specify the template for translating the LDAP user name to a valid LDAP search filter in the **User Search Filter Template** field. This entry must contain the following placeholder: `%(username)s`. Some examples would be:

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. When you have completed your entries, the dialog should look like the following:

    ![LDAP Credentials with Search](/mesosphere/dcos/2.0/img/GUI-LDAP-credentials-search.png)

    Figure 4. LDAP Credentials with Search Bind parameters

1.  Click **Add Directory**.
1.  [Verify your connection](/mesosphere/dcos/2.0/security/ent/ldap/ldap-verify/).

