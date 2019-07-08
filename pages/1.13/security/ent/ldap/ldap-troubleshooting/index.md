---
layout: layout.pug
navigationTitle:  Troubleshooting LDAP errors
title: Troubleshooting LDAP errors
menuWeight: 5
excerpt: Troubleshooting common authentication and configuration issues for your LDAP directory
enterprise: true
render: mustache
model: /1.13/data.yml
---
The Lightweight Directory Access Protocol (LDAP) provides a lightweight client-server protocol for accessing directory services. The protocol provides a standards-based method for defining objects and their attributes for X.500-based directory services. LDAP runs over TCP/IP or other connection-oriented transfer services.

# Common issues when using Microsoft Active Directory
Microsoft Windows Server Active Directory is the LDAP-based identity store for Windows forests and domains. Active Directory stores details about users, groups, computers, roles, and organizations in LDAP-compliant objects and attributes and returns the information you search for using LDAP queries in the same format as other LDAP services such as OpenLDAP.

Because integrating Active Directory authentication into a multi-platform environment can present challenges that you are less likely to encounter when you use ApacheDS, OpenLDAP, or other LDAP services, the most common issues with LDAP authentication and configuration involve communication with the Active Directory domain controllers or replication across Active Directory domains.

# Cannot connect to the directory backend
If you attempt to retrieve information from Active Directory but the connection fails, you might see the following error message:

![Cannot connect to the directory](/1.13/img/ldap-cannot-open-connection-error.png)

Figure 1. Connection error message: timeout

If you see an error message indicating the connection to the backend directory failed, the problem is most often caused by one of the following issues:

- A required port is closed to all traffic or protected by firewall rules.

    Specific port requirements depend on the version of Active Directory you are using and the type of communication traffic. For example, most LDAP traffic requires port 389 for TCP or UDP connections to handle directory and replication services, user and computer authentication, and group policy distribution. 

    To handle the same type of traffic over a secure communications channel, LDAP requires port 636 for TCP connections to deliver encrypted messages over a secure socket layer (SSL).

- DNS cannot resolve the name or IP address for the Active Directory domain controller.

If you encounter this error, check whether the computer where you saw the error has the correct IP address for the network interface and the domain controller. You can check the current IP address and network settings for domain connections using the DHCP server role or manually in the network adapter settings. For example, you can retrieve the current network settings for the computer using `ipconfig` or a similar operating system command to display network configuration details.

If there is a problem with the port number, host name, or host IP address, edit the values in the LDAP directory settings to specify the correct port, host name, or host IP address.

To edit the LDAP directory settings:

1. Log in to the DC/OS web-based console.

1. Click **Settings**, then click **LDAP Directory**.

1. Click **Edit Directory**.

1. Modify the host name, host IP address, or LDAP port.

1. Click **Save Configuration**.

# Transport layer security (SSL/TLS) connection errors
If you attempt to connect to Active Directory and the connection fails because there is a problem communicating with the server using transport layer security (SSL/TLS), you might see the following error message:

![SSL connection error](/1.13/img/ldap-tsl-ssl-socket-error.png)

Figure 2. Connection error: socket SSL wrapping error

For example, you might see this error if the LDAP server is not configured to accept SSL/TLS connections or if the certificate used to secure the channel is invalid.

If you have a problem connecting to Active Directory when using secure socket layer (SSL) connections, you should:
- Check that LDAP over SSL (LDAPS) is enabled for the Active Directory LDAP server role and that you have imported a valid CA certificate to allow SSL/TLS connections.
- Check how you have configured the appropriate corresponding LDAP SSL/TLS setting for the directory in the DC/OS cluster.

If the Active Directory LDAP server role is not configured to allow SSL/TLS connections, you should verify that the DC/OS cluster is configured to allow unencrypted communication.

To change how DC/OS handles SSL/TLS connection errors:
1. Log in to the DC/OS web-based console.

1. Click **Settings**, then click **LDAP Directory**.

1. Click **Edit Directory**.

1. Under **Select SSL/TLS setting**, select another option.

    ![SSL/TLS setting option](/1.13/img/ldap-ssl-options.png)

    Figure 3. SSL/TLS setting options

    For example, if you have configured the Select SSL/TLS setting to **Use SSL/TLS for all connections**, you might want to change the setting to **Attempt StartTLS, proceed unencrypted if it fails**.

1. Click **Save Configuration**.

# SSL/TLS is enforced but the connection fails
If you have configured connections to the LDAP server to abort if unable to use transport layer security (SSL/TLS), you might see the following error message:

![Aborted SSL/TLS connections](/1.13/img/ldap-enforced-TLS-error.png)

Figure 4. Connection error message: TLS error

To change how DC/OS handles SSL/TLS connection errors:
1. Log in to the DC/OS web-based console.

1. Click **Settings**, then click **LDAP Directory**.

1. Click **Edit Directory**.

1. Under **Select SSL/TLS setting**, select another option.

    ![SSL/TLS setting option](/1.13/img/ldap-ssl-options.png)

    Figure 5. SSL/TLS setting option

    For example, if you want to continue to connect to the LDAP server when secure communication is not available, you can set the Select SSL/TLS setting to **Attempt StartTLS, proceed unencrypted if it fails**.

1. Click **Save Configuration**.

# Service account credential issues
If the connection to the LDAP server is successful, but the authentication credentials for the service account are incorrect, you might see the following error message:

![LDAP authentication error](/1.13/img/ldap-lookup-DN-error.png)

Figure 6. LDAP authentication error

To address this issue:
1. Log in to the DC/OS web-based console.

1. Click **Settings**, then click **LDAP Directory**.

1. Click **Edit Directory**.

1. Click **Authentication**.

1. Correct the **Lookup DN** and the **Lookup Password**.

    ![Modify authentication information](/1.13/img/ldap-lookup-dn.png)

    Figure 7. Modify authentication information

1. Click **Save Configuration**.

# Cannot find user
If the connection to the LDAP server is successful and the service account credentials are correct, but the user is not found, you might see the following error message: 

![LDAP user not found](/1.13/img/ldap-user-error.png)

Figure 8. LDAP user not found

In most cases, you will see this error if a specified user or service account is not within the scope of the user search base you have defined or if there is a problem with the distinguished name (DN) or distinguished name (DN) template used to bind to the LDAP server. If you see this error, you should verify the following settings:
- The type of bind operation and authentication method you are using to connect to the LDAP server.
- The scope defined for the user search base.
- The user distinguished name (DN) template you are using.
- The user search filter template you are using.

## Specifying a user distinguished name (DN) template
If you are using **simple** authentication to bind to the LDAP server, be sure that you have specified a valid User DN Template. In most cases, the distinguished name template includes the runtime variable placeholder `cn=%(username)s` that is replaced in lookup requests with an actual account name value. 

## Specifying a user search base and filter template
If you are using **search** authentication to bind to the LDAP server, be sure that you have specified a valid User Search Base and User Search Filter Template.

The user search base should be broad enough to include the appropriate containers, organizational units, and domains you from which you want to return results.

When defining a search filter template, you should keep in mind the following:
- The `%(username)s` runtime variable is a placeholder that is replaced in lookup requests with an actual account name value.
- For OpenLDAP deployments, account lookup requests typically use the UID attribute so the search template placeholder is typically defined using `(uid=%(username)s))`. 
- For Active Directory deployments, account lookup requests typically use the `sAMAccountName` attribute so the search template placeholder is typically defined using `(sAMAccountName=%(username)s))`. In most cases, the sAMAccountName attribute is the account name users enter to log on to computers in the Windows domain. 

## Verifying Active Directory user account names
If you are using the LDAP server to access Active Directory accounts for Windows users, you can find the sAMAccountName attribute and other account information using Active Directory Users and Computers or Windows PowerShell. 

To look up the account information using Active Directory Users and Computers:
1. Log on to a Windows computer using an account with administrative privileges.
1. Open the Control Panel for **Administrative Tools**.
1. Open **Active Directory Users and Computers**.
1. Select the user account.

    ![Selecting a user in Active Directory Users and Computers](/1.13/img/ldap-aduc.png)

    Figure 9. Active Directory selections

1. Right-click, then select **Properties**.
1. Click the **Account** tab and check the **User login name**.

    ![User login account property](/1.13/img/ldap-aduc-account-properties.png)

    Figure 10. User login account

## Checking for alternative account name formats
In some cases, you might want to look up account information using an alternative to the `sAMAccountName`. For example, you might want to look for account information by the `userPrincipalName` that defines unique accounts in a domain with the `user@domain.com` format. 

If you want to use any other valid account name format such as `user@domain.com`, you can find the valid alternatives to replace the `sAMAccountName` by using Active Directory Users and Computers or by running commands using Windows PowerShell.

To look up Active Directory user information using Window PowerShell:
1. Open the Windows PowerShell administrator console.

1. Import the Active Directory module by using Import menu option or the Import-Module cmdlet. For example, in the PowerShell console you can run the `import-module` cmdlet like this: PS C:\Users\Administrator> import-module activedirectory

1. Run the Get-ADUser cmdlet to retrieve the Active Directory properties for a specified user. For example: PS C:\Users\Administrator> Get-ADUser rmcdonald -properties *

This cmdlet returns all of the properties for the user with the `SAMAccountName` rmcdonald.

```
AccountExpirationDate : 
accountExpires : 9223372036854775807
AccountLockoutTime : 
AccountNotDelegated : False
AllowReversiblePasswordEncryption : False
BadLogonCount : 1
badPasswordTime : 131896358930929294
badPwdCount : 1 
CannotChangePassword : False
CanonicalName : example.com/Users/Ronald McDonald
Certificates : {} 
City : 
CN : Ronald McDonald 
codePage : 0 
Company : 
Country : 
countryCode : 0 
Created : 12/17/2018 2:27:43 PM 
createTimeStamp : 12/17/2018 2:27:43 PM 
Deleted : 
Department : 
Description : 
DisplayName : Ronald McDonald 
DistinguishedName : CN=Ronald McDonald,CN=Users,DC=example,DC=com
Division : 
DoesNotRequirePreAuth : False 
dSCorePropagationData : {12/31/1600 4:00:00 PM}
EmailAddress : 
EmployeeID : 
EmployeeNumber : 
Enabled : True 
Fax : 
GivenName : Ronald
HomeDirectory : 
HomedirRequired : False 
HomeDrive : 
HomePage : 
HomePhone : 
Initials : 
instanceType : 4
isDeleted : 
LastBadPasswordAttempt : 12/18/2018 11:44:53 AM
LastKnownParent : 
lastLogoff : 0 
lastLogon : 0 
LastLogonDate : 12/17/2018 2:36:30 PM
lastLogonTimestamp : 131895597903404620
LockedOut : False
logonCount : 0 
LogonWorkstations : 
Manager : 
MemberOf : {} 
MNSLogonAccount : False
MobilePhone : 
Modified : 12/17/2018 2:36:30 PM 
modifyTimeStamp : 12/17/2018 2:36:30 PM
msDS-User-Account-Control-Computed : 0 
Name : Ronald McDonald 
nTSecurityDescriptor : System.DirectoryServices.ActiveDirectorySecurity
ObjectCategory : CN=Person,CN=Schema,CN=Configuration,DC=example,DC=com 
ObjectClass : user 
ObjectGUID : 8a372fe3-b879-4a58-aabd-6001327b2548
objectSid : S-1-5-21-1469461492-1576009741-989685995-1104
Office : 
OfficePhone : 
Organization : 
OtherName : 
PasswordExpired : False 
PasswordLastSet : 12/17/2018 2:27:43 PM
PasswordNeverExpires : True
PasswordNotRequired : False 
POBox : 
PostalCode : 
PrimaryGroup : CN=Domain Users,CN=Users,DC=example,DC=com
primaryGroupID : 513 
ProfilePath : 
ProtectedFromAccidentalDeletion : False
pwdLastSet : 131895592635431368 
SamAccountName : rmcdonald 
sAMAccountType : 805306368 
ScriptPath : 
sDRightsEffective : 15 
ServicePrincipalNames : {} 
SID : S-1-5-21-1469461492-1576009741-989685995-1104
SIDHistory : {} 
SmartcardLogonRequired : False 
sn : McDonald 
State : 
StreetAddress : 
Surname : McDonald 
Title : 
TrustedForDelegation : False
TrustedToAuthForDelegation : False
UseDESKeyOnly : False
userAccountControl : 66048 
userCertificate : {} 
UserPrincipalName : rmcdonald@example.com
uSNChanged : 16787 
uSNCreated : 16781 
whenChanged : 12/17/2018 2:36:30 PM 
whenCreated : 12/17/2018 2:27:43 PM
```

# User with incorrect credentials
If the connection to the LDAP server is successful and the specified user can be found inside the scope of the user search base but the credentials are wrong, you might see the following error message:

![Invalid user credentials](/1.13/img/ldap-wrong-user-credentials.png)

Figure 11. Invalid user credentials

If you see this error, check for the following potential issues that can cause the user credentials to be invalid:
- Verify that the account is not locked or disabled.
- Verify that the account password has not expired.
- Check whether there are login hours or other access control restrictions preventing the user from being authenticated.
