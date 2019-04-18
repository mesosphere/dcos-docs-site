---
layout: layout.pug
navigationTitle:  Troubleshooting LDAP errors
title: Troubleshooting LDAP errors
menuWeight: 5
excerpt: Troubleshooting common authentication and configuration issues for your LDAP directory
enterprise: true
---
The Lightweight Directory Access Protocol (LDAP) provides a lightweight client-server protocol for accessing directory services. The protocol provides a standards-based method for defining objects and their attributes for X.500-based directory services. LDAP runs over TCP/IP or other connection-oriented transfer services.

# Common issues when using Microsoft Active Directory
Microsoft Windows Server Active Directory is the LDAP-based identity store for Windows forests and domains. Active Directory stores details about users, groups, computers, roles, and organizations in LDAP-compliant objects and attributes and returns the information you search for using LDAP queries in the same format as other LDAP services such as OpenLDAP.

## Error: Cannot connect to Active Directory
If you attempt to retrieve information from Active Directory, but the connection fails and you see this error message, the problem is most often caused by one of the following issues:

- A required port is closed to all traffic or protected by firewall rules.

Specific port requirements depend on the version of Active Directory you are using and the type of communication traffic. For example, most LDAP traffic requires port 389 for TCP or UDP connections to handle directory and replication services, user and computer authentication, and group policy distribution. 

To handle the same type of traffic over a secure communications chaneel, LDAP requires port 636 for TCP connections to deliver encrypted messages over a secure socket layer (SSL).

- DNS cannot resolve the name or IP address for the Active Directory domain controller.

If you encounter this error, check whether the computer where you saw the error has the correct IP address for the network interface and the domain controller. You can check the current IP address and network settings for domain connections using the DHCP server role or manually in the network adapter settings. For example, you can retrieve the current network settings for the computer using `ipconfig` or a similar operating system command to display network configuration details.

If there is a problem with the port number, host name, or host IP address, edit the values in the Connection tab to specify the correct port, host name, or host IP address.

## Error: Transport layer security (TLS) setting
If you have a problem connecting to Active Directory when using secure socket layer (SSL) connections, check whether the LDAP server is configured to allow SSL/TLS connections. Edit the Select SSL/TLS setting section and select another option.

## Error: SSL/TLS is enforced but the connection fails
Attempt to connect via SSL/TLS but the option to abort on failure is selected.

## Error: Service account credential issues
Connection to LDAP was successful, but the authentication credentials for the service account is incorrect. On the Authentication tab, correct the Lookup DN and the Lookup Password and perform the test again.

## Error: Cannot find user
Connection to the LDAP server is working, the service account for lookup is correct but cannot find the user. Verify the Authentication Method along with the User Search Base / User DN Template and the User Search Filter Template. Most often issue is that the user login being tested is NOT inside the User Search Base.

Another common issue is that the User Search Filter Template / User DN Template is incorrect. Note that the %(username)s is the place holder in which the input username from the test or the actual login is replaced with a real value. 

For OpenLDAP deployments, most of the time the UID is used (for example, (uid=%(username)s)). For Active Directory deployments, the sAMAccountName is the one most commonly used by users to login to their Windows machine. Clicking Properties on the user on the Active Directory Users and Computers application, under the Account tab it should be the one called User logon name.

If you want to use any other valid logon account format, for example, `user@domain.com`, the parameters to replace `sAMAccountName` can be found by using Windows PowerShell.

1. Open the Windows PowerShell admininstrator console.

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

The property most commonly used as an alternative to the sAMAccountName attribute is the `UserPrincipalName`.

## Error: User found but incorrect credentials
This error message indicates that a specified user can be found inside the User Search Base but the credentials are wrong.

If you see this error, check for the following potential issues that can cause the user credentials to be invalid.

- Verify that the account is not locked or disabled.
- Verify that the password has not expired.
- Check whether there are logon hours or other access control restrictions preventing the user from being authenticated. 

