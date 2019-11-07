---
layout: layout.pug
navigationTitle:  排除 LDAP 错误
title: 排除 LDAP 错误
menuWeight: 5
excerpt: 排除 LDAP 目录的常见身份验证和配置问题
enterprise: true
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---
轻量目录访问协议 (LDAP) 为访问目录服务提供一个轻量客户端-服务器协议。协议提供基于标准的方法，为基于 X.500 的目录服务定义对象及其属性。LDAP 通过 TCP/IP 或其他以连接为导向的传输服务运行。

# 使用 Microsoft Active Directory 时的常见问题
Microsoft Windows Server Active Directory 是 Windows 森林和域的基于 LDAP 的身份存储。Active Directory 在与 LDAP 兼容的对象和属性中存储有关用户、组、计算机、角色和组织的详细信息，并以与其他 LDAP 服务（如 OpenLDAP）相同的格式返回您使用 LDAP 查询搜索的信息。

由于将 Active Directory 身份验证集成到多平台环境中可能会带来使用 ApacheDS、OpenLDAP 或其他 LDAP 服务时不太可能遇到的挑战，LDAP 身份验证和配置中最常见的问题会涉及与 Active Directory 域控制器的通信或跨 Active Directory 域的复制。

# 无法连接到目录后端
如果尝试从 Active Directory 检索信息，但连接失败，那么您可能会看到以下错误消息：

![无法连接到目录](/mesosphere/dcos/1.13/img/ldap-cannot-open-connection-error.png)

图 1. 连接错误消息：超时

如果看到错误消息，指示与后端目录的连接失败，那么这通常是由以下问题引起的：

- 所需的端口拒绝所有流量或受防火墙规则保护。

    具体端口要求取决于您使用的 Active Directory 版本和通信流量的类型。例如，大多数 LDAP 流量需要 TCP 或 UDP 连接的端口 389，以处理目录和复制服务、用户和计算机身份验证以及组策略分发。

    为了在安全通信通道上处理相同类型的流量，LDAP 需要 TCP 连接的端口 636，才能通过安全套接字层 (SSL) 传递加密消息。

- DNS 无法解析 Active Directory 域控制器的名称或 IP 地址。

如果遇到此错误，请检查错误所在的计算机是否具有用于网络接口和域控制器的正确 IP 地址。您可以使用 DHCP 服务器角色或手动在网络适配器设置中检查域连接的当前 IP 地址和网络设置。例如，您可以使用 `ipconfig` 或类似的操作系统命令来检索当前的网络设置，以显示网络配置详细信息。

如果端口号、主机名或主机 IP 地址存在问题，请编辑 LDAP 目录设置中的值，以指定正确的端口、主机名或主机 IP 地址。

要编辑 LDAP 目录设置：

1. 登录到 DC/OS 基于 Web 的控制台。

1. 单击 **设置**，然后单击 **LDAP 目录**。

1. 单击 **编辑目录**。

1. 修改主机名、主机 IP 地址或 LDAP 端口。

1. 单击 **保存配置**。

# 传输层安全 (SSL/TLS) 连接错误
如果您尝试连接到 Active Directory，并且由于使用传输层安全 (SSL/TLS) 与服务器通信时出现问题而导致连接失败，那么您可能会看到以下错误消息：

![SSL 连接错误](/mesosphere/dcos/1.13/img/ldap-tsl-ssl-socket-error.png)

图 2. 连接错误：套接字 SSL 包装错误

例如，如果未将 LDAP 服务器配置为接受 SSL/TLS 连接，或者用于保护通道的证书无效，则可能会看到此错误。

如果在使用安全套接字层 (SSL) 连接来连接到 Active Directory 时出现问题，您应该：
- 检查是否为 Active Directory LDAP 服务器角色启用了 SSL 上的 LDAP (LDAPS)，并且您已导入有效的 CA 证书以允许 SSL/TLS 连接。
- 检查您如何为 DC/OS 群集中的目录配置适当的相应 LDAP SSL/TLS 设置。

如果未将 Active Directory LDAP 服务器角色配置为允许 SSL/TLS 连接，则应验证 DC/OS 群集已配置为允许未加密的通信。

要更改 DC/OS 处理 SSL/TLS 连接错误的方式：
1. 登录到 DC/OS 基于 Web 的控制台。

1. 单击 **设置**，然后单击 **LDAP 目录**。

1. 单击 **编辑目录**。

1. 在 **选择 SSL/TLS 设置** 下，选择另一个选项。

    ![SSL/TLS 设置选项](/mesosphere/dcos/1.13/img/ldap-ssl-options.png)

    图 3. SSL/TLS 设置选项

    例如，如果您已将“选择 SSL/TLS 设置”配置为“对所有连接都使用 SSL/TLS”，那么可能需要将设置更改为“尝试 StartTLS，如果失败，则不进行加密”。

1. 单击 **保存配置**。

# 强制执行 SSL/TLS，但连接失败
如果您已将与 LDAP 服务器的连接配置为“在无法使用传输层安全 (SSL/TLS) 时中止连接”，您可能会看到以下错误消息：

![已中止 SSL/TLS 连接](/mesosphere/dcos/1.13/img/ldap-enforced-TLS-error.png)

图 4. 连接错误消息：TLS 错误

要更改 DC/OS 处理 SSL/TLS 连接错误的方式：
1. 登录到 DC/OS 基于 Web 的控制台。

1. 单击 **设置**，然后单击 **LDAP 目录**。

1. 单击 **编辑目录**。

1. 在 **选择 SSL/TLS 设置** 下，选择另一个选项。

    ![SSL/TLS 设置选项](/mesosphere/dcos/1.13/img/ldap-ssl-options.png)

    图 5. SSL/TLS 设置选项

    例如，如果您想在安全通信不可用时继续连接到 LDAP 服务器，则可以将“选择 SSL/TLS 设置”配置为 **尝试 StartTLS，如果失败，则不进行加密**。

1. 单击 **保存配置**。

# 服务帐户凭据问题
如果 LDAP 服务器的连接成功，但服务帐户的身份验证凭据不正确，您可能会看到以下错误消息：

![LDAP 身份验证错误](/mesosphere/dcos/1.13/img/ldap-lookup-DN-error.png)

图 6. LDAP 身份验证错误

要解决此问题：
1. 登录到 DC/OS 基于 Web 的控制台。

1. 单击 **设置**，然后单击 **LDAP 目录**。

1. 单击 **编辑目录**。

1. 单击 **身份验证**。

1. 修正 **Lookup DN** 和 **Lookup Password**。

    ![修改身份验证信息](/mesosphere/dcos/1.13/img/ldap-lookup-dn.png)

    图 7. 修改身份验证信息

1. 单击 **保存配置**。

# 无法找到用户
如果 LDAP 服务器的连接成功且服务帐户凭据正确，但未找到用户，您可能会看到以下错误消息：

![未找到 LDAP 用户](/mesosphere/dcos/1.13/img/ldap-user-error.png)

图 8. 未找到 LDAP 用户

在大多数情况下，如果指定的用户或服务帐户不在您定义的用户搜索库范围之内，或者用于绑定到 LDAP 服务器的标识名 (DN) 或标识名 (DN) 模板存在问题，您会看到此错误。如果您看到此错误，您应该验证以下设置：
- 用于连接到 LDAP 服务器的绑定操作和身份验证方法的类型。
- 为用户搜索库定义的范围。
- 您正在使用的用户标识名 (DN) 模板。
- 您正在使用的用户搜索筛选模板。

## 指定用户标识名 (DN) 模板
如果您正使用 **简单** 身份验证来绑定到 LDAP 服务器，确保您已指定一个有效的用户 DN 模板。在大多数情况下，标识名模板包括运行时变量占位符 `cn=%(username)s`，该占位符在查找请求中被替换为实际的帐户名值。

## 指定用户搜索库和筛选模板
如果您正使用 **搜索** 身份验证来绑定到 LDAP 服务器，确保您已指定一个有效的用户搜索库和用户搜索筛选模板。

用户搜索库应该足够开阔，以包括要从中返回结果的相应容器、组织单元和域。

定义搜索筛选模板时，您应记住以下内容：
- `%(username)s` 运行时变量是一个占位符，该占位符在查找请求中被替换为实际的帐户名值。
- 对于 OpenLDAP 部署，帐户查找请求通常使用 UID 属性，因此通常使用 `(uid=%(username)s))` 来定义搜索模板占位符。
- 对于 Active Directory 部署，帐户查找请求通常使用 `sAMAccountName` 属性，因此通常使用 `(sAMAccountName=%(username)s))` 来定义搜索模板占位符。在大多数情况下，sAMAccountName 属性是用户为登录 Windows 域中的计算机而输入的帐户名。

## 验证 Active Directory 用户帐户名称
如果您正使用 LDAP 服务器来访问 Windows 用户的 Active Directory 帐户，您可以使用 Active Directory 用户和计算机或 Windows PowerShell 来找到 sAMAccountName 属性和其他帐户信息。

要使用 Active Directory 用户和计算机查找帐户信息：
1. 使用具有管理权限的帐户登录 Windows 计算机。
1. 打开 **管理工具** 的控制面板。
1. 打开 **Active Directory 用户和计算机**。
1. 选择用户帐户。

    ![在 Active Directory 用户和计算机中选择一个用户](/mesosphere/dcos/1.13/img/ldap-aduc.png)

    图 9. Active Directory 选择

1. 右键单击，然后选择 **属性**。
1. 单击 **帐户** 选项卡并勾选 **用户登录名称**。

    ![用户登录帐户属性](/mesosphere/dcos/1.13/img/ldap-aduc-account-properties.png)

    图 10. 用户登录帐户

## 检查替代帐户名称格式
在某些情况下，您可能想使用 `sAMAccountName` 的替代项来查询帐户信息。例如，您可能想通过 `userPrincipalName` 查找帐户信息，它在 `user@domain.com` 格式的域中定义了唯一帐户。

如果您想使用任何其他有效的帐户名称格式，例如 `user@domain.com`，您可以使用 Active Directory 用户和计算机或使用 Windows PowerShell 运行命令来找到有效的替代项来替代 `sAMAccountName`。

要使用 Window PowerShell 查找 Active Directory 用户信息，请执行以下操作：
1. 打开 Windows PowerShell 管理员控制台。

1. 使用导入菜单选项或 Import-Module cmdlet 来导入 Active Directory 模块。例如，在 PowerShell 控制台中，您可以按以下方式运行 `import-module` cmdlet：PS C:\Users\Administrator> import-module activedirectory

1. 运行 Get-ADUser cmdlet，以检索指定用户的 Active Directory 属性。例如：PS C:\Users\Administrator> Get-ADUser rmcdonald -properties *

此 cmdlet 将通过 `SAMAccountName` rmcdonald 返回用户的所有属性。

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

# 带有错误凭据的用户
如果 LDAP 服务器的连接成功，且可以在用户搜索库范围内找到指定用户，但凭据是错误的，您可能会看到以下错误消息：

![无效用户凭据](/mesosphere/dcos/1.13/img/ldap-wrong-user-credentials.png)

图 11. 无效用户凭据

如果您看到此错误，检查以下可能导致用户凭据无效的潜在问题：
- 验证帐户未被锁定或禁用。
- 验证帐户密码未过期。
- 检查是否存在阻止用户身份验证的登录时间或其他访问控制限制。
