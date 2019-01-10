---
layout: layout.pug
navigationTitle:  >
title: >
  Managing users and groups through the
  web interface
menuWeight: 0
excerpt:
enterprise: true

---


# Overview

DC/OS can manage two types of users:

* **Local**: local user accounts exist only in DC/OS.

* **Remote**: remote user accounts exist primarily within an external LDAP directory server. When the user attempts to login, DC/OS will ask the remote LDAP server to validate the credentials. DC/OS never receives or stores the passwords of remote users. It does store an internal representation of the user to allow the DC/OS administrator to put the user into a group and assign permissions.

**Requirement** The LDAP directory server must support [LDAP 3](https://tools.ietf.org/html/rfc4511).

This topic discusses how to use the DC/OS web interface to manage users and groups. 

To manage users and groups from the DC/OS web interface:

1. Log in as a user with `superuser` privileges.

2. Click into the **System** -> **Organization** -> **Users** tab.

# Adding local users
 
1. From the **System** -> **Organization** -> **Users** tab, click **New User**.

2. If a menu drops down from the button, select **Add Local User**.
        
   ![Add User](/assets/images/auth-enable-add-user.gif)
   
3. Type in the user's full name, username, and password. 

   **Requirement**: DC/OS sends the username in the URL. Therefore, only the following characters are supported: lowercase alphabet, uppercase alphabet, numbers, `@`, `.`, and `-`.
<!-- The full name supports unicode characters. The username supports all alphanumeric characters. Names can contain (A - Z), lowercase, supports Japanese, German, and English chars. --> 

# Adding remote users

## Configuring LDAP authentication
    
Before you can add any remote users, you must give DC/OS the information it needs to connect to the remote LDAP server:

* Address of the server
* Credentials of a user with read access
* TLS/SSL preferences

To set up LDAP authentication:

1.  Click on the **Settings** -> **Organization** -> **External Directory** tab.
        
2.  Click **Add Directory**.
            
   ![LDAP BIND Parameters](/1.11/img/ldap-bind-params.gif)           
 
3.  Type the host name or IP address of the LDAP directory server in the **Host** box. 

    **Tip**: Do not include the protocol prefix or port number. 
            
4.  Type the TCP/IP port number to use in the **Port** box. 

    **Tip**: Port 389 is usually used for normal (including StartTLS) communications. Port 636 is often used for LDAPS connections.
            
5.  Provide a template to use for translating a username to a [distinguished name (DN)](https://www.ldap.com/ldap-dns-and-rdns). Your template  must contain `%(username)s`. DC/OS will replace `%(username)s` with the name provided by the user at log on. The rest of the DN template string depends on your directory setup. A few examples follow.
            
        cn=%(username)s,dc=los-pollos,dc=io
        uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=%(username)s,ou=users,dc=example,dc=com


6.  Provide the credentials of a user with at least read privileges in the **Lookup Username** and **Lookup Password** boxes. 

    **Important**: We recommend using an account with read-only privileges. 

    **Note**: the DN template will be used with this user name.

7.  Select the **Use SSL/TLS for all connections** check box to use [Secure LDAP (LDAPS)](http://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx). 
            
8.  By default, an attempt to upgrade the connectionto TLS is made via [StartTLS](https://tools.ietf.org/html/rfc2830). If this attempt fails, the connection continues in plaintext. Select the **Use StartTLS for all connections** check box if you instead want to abort the connection should the upgrade to TLS fail. 

    **Note**: If the **Use SSL/TLS for all connections** check box is selected, the **Use StartTLS for all connections** check box is ignored.
    
9.  Click **Add**. 

10. Click **Test Connection** to validate your connection. 

11. Provide the credentials of a user in the prompt. 

    **Note**: the DN template will be used with this user name.

    **Tip**: to simulate an actual login as a much as possible, we recommend using the credentials of a user other than the lookup user.

12. You should see this message: `Connection with LDAP server was successful`. If the test fails, read the error message to determine and fix the issue.
  
## Adding remote users via logon attempt

By default, users have no DC/OS permissions. Any attempts to access DC/OS without permissions will fail. However, if you have successfully configured a remote LDAP and the user provides valid credentials, the logon attempt will cause the user's account to be added to DC/OS. 

**Requirement**: The user's name and password must be correct.

Because you will need the user account in DC/OS before you can add any permissions, you may find it easiest to ask each of the users to try to log on to DC/OS. Though their attempts will fail, this will serve to populate DC/OS with their accounts.

## Importing remote users

If you don't want to ask your users to try to log on, you can import their accounts instead. All you need to know is their user name, email, or common name (depending on the DN template of your LDAP configuration).

To import a remote user:

1. In the **System** -> **Organization** -> **Users** tab, click **New User**.

2. Select **Import LDAP User**.

3. Type the user's username in the **Full Name** box.

4. Click **Add**. 

5. When you have finished adding all of your users, click the **Close** button.

# Managing groups

## About managing groups

Groups can make it easier to manage permissions. Instead of assigning permissions to each user account individually, you can assign the permissions to an entire group of users at once.

## Adding a group
    
1.  From the **System** -> **Organization** -> **Groups** tab, click **New Group**.

2.  Type in the group name and click **Create**.

## Adding users to a group
    
1.  Once you have added a group, it will be displayed in the  **System** -> **Organization** -> **Groups** tab. Click the name of the group you want to add users to. 

2.  Click the **Members** tab.

3.  Select the name of the user you want to add to the group from the **Add User** list box.


