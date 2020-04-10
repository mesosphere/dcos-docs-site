---
layout: layout.pug
navigationTitle: Dex Controller API Reference
title: Dex Controller API Reference
menuWeight: 20
excerpt: Dex Controller API Reference
enterprise: false
---

## Table of Contents
* [Connector](#connector)
* [ConnectorList](#connectorlist)
* [ConnectorSpec](#connectorspec)
* [GithubConnectorConfig](#githubconnectorconfig)
* [GithubConnectorConfigOrg](#githubconnectorconfigorg)
* [LDAPConnectorConfig](#ldapconnectorconfig)
* [LDAPConnectorConfigGroupSearch](#ldapconnectorconfiggroupsearch)
* [LDAPConnectorConfigUserSearch](#ldapconnectorconfigusersearch)
* [OIDCConnectorConfig](#oidcconnectorconfig)
* [SAMLConnectorConfig](#samlconnectorconfig)
* [Client](#client)
* [ClientList](#clientlist)
* [ClientSpec](#clientspec)

## Connector

Connector is the Schema for the connectors API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#objectmeta-v1-meta) | false |
| spec |  | [ConnectorSpec](#connectorspec) | false |

[Back to TOC](#table-of-contents)

## ConnectorList

ConnectorList contains a list of Connector

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#listmeta-v1-meta) | false |
| items |  | [][Connector](#connector) | true |

[Back to TOC](#table-of-contents)

## ConnectorSpec

ConnectorSpec defines the desired state of Connector

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| enabled | Whether this Connector is enabled or not. This allows the admin to create the Connector configuration first, and later enable it by toggling this field. | bool | true |
| type | The type of the Connector. | string | true |
| displayName | The display name for the Connector. The display name will be shown in the UI of the login page. | string | true |
| ldap |  | *[LDAPConnectorConfig](#ldapconnectorconfig) | false |
| oidc |  | *[OIDCConnectorConfig](#oidcconnectorconfig) | false |
| github |  | *[GithubConnectorConfig](#githubconnectorconfig) | false |
| saml |  | *[SAMLConnectorConfig](#samlconnectorconfig) | false |

[Back to TOC](#table-of-contents)

## GithubConnectorConfig



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clientSecretRef | Reference to secret that contains the client ID and client secret. The secret should contain two keys `client-id` and `client-secret` like the following: | corev1.LocalObjectReference | true |
| redirectURI | Dex's issuer URL + \"/callback\" | string | true |
| orgs | Optional organizations and teams, communicated through the \"groups\" scope.\n\nNOTE: This is an EXPERIMENTAL config option and will likely change.\n\nDex queries the following organizations for group information if the \"groups\" scope is provided. Group claims are formatted as \"(org):(team)\".  For example if a user is part of the \"engineering\" team of the \"coreos\" org, the group claim would include \"coreos:engineering\".\n\nIf orgs are specified in the config then user MUST be a member of at least one of the specified orgs to authenticate with dex.\n\nIf 'orgs' is not specified in the config and 'loadAllGroups' setting set to true then user authenticate with ALL user's Github groups. Typical use case for this setup: provide read-only access to everyone and give full permissions if user has 'my-organization:admins-team' group claim.\n\nExamples:\n orgs:\n - name: my-organization\n  # Include all teams as claims.\n - name: my-organization-with-teams\n # A white list of teams. Only include group claims for these teams.\n teams:\n - red-team\n - blue-team | [][GithubConnectorConfigOrg](#githubconnectorconfigorg) | false |
| loadAllGroups | Flag which indicates that all user groups and teams should be loaded. | *bool | false |
| teamNameField | Optional choice between 'name' (default), 'slug', or 'both'.\n\nAs an example, group claims for member of 'Site Reliability Engineers' in Acme organization would yield:\n  - ['acme:Site Reliability Engineers'] for 'name'\n  - ['acme:site-reliability-engineers'] for 'slug'\n  - ['acme:Site Reliability Engineers',\n     'acme:site-reliability-engineers'] for 'both' | *string | false |
| useLoginAsID | Flag which will switch from using the internal GitHub id to the users handle (@mention) as the user id. It is possible for a user to change their own user name but it is very rare for them to do so. | *bool | false |
| hostName | Github API host name. Default to \"api.github.com\". | *string | false |
| rootCASecretRef | A secret reference to the root CA that will be used for TLS validation. The secret should have type \"Opaque\" and contain the key \"tls.crt\". If not specified, the root CA of the host will be used. | *corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## GithubConnectorConfigOrg



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| name | Organization name in github (not slug, full name). Only users in this github organization can authenticate. | string | true |
| teams | Names of teams in a github organization. A user will be able to authenticate if they are members of at least one of these teams. Users in the organization can authenticate if this field is omitted from the config file. | []string | false |

[Back to TOC](#table-of-contents)

## LDAPConnectorConfig

This config for LDAP is derived from: https://github.com/dexidp/dex/blob/v2.19.0/connector/ldap/ldap.go#L53

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| host | Host and optional port of the LDAP server in the form \"host:port\". If the port is not supplied, it will be guessed based on `insecureNoSSL`, and `startTLS` fields. 389 for insecure or StartTLS connections, 636 otherwise. | string | true |
| insecureNoSSL | Following field is required if the LDAP host is not using TLS (port 389). Because this option inherently leaks passwords to anyone on the same network as dex, THIS OPTION MAY BE REMOVED WITHOUT WARNING IN A FUTURE RELEASE. | *bool | false |
| insecureSkipVerify | If a custom certificate isn't provide, this option can be used to turn off TLS certificate checks. As noted, it is insecure and shouldn't be used outside of explorative phases. | *bool | false |
| startTLS | Connect to the insecure port then issue a StartTLS command to negotiate a secure connection. If unsupplied secure connections will use the LDAPS protocol. | *bool | false |
| rootCASecretRef | A secret reference to the root CA that will be used for TLS validation. The secret should have type \"Opaque\" and contain the key \"tls.crt\". If not specified, the root CA of the host will be used. | *corev1.LocalObjectReference | false |
| bindDN | The name of the application service account to authenticate with the LDAP server. The connector uses the specified service account search for users and groups. Not required if the LDAP server provides access for anonymous auth. | *string | false |
| bindSecretRef | A secret reference to the password of the application service account to authenticate with the LDAP server. The connector uses the specified service account search for users and groups. Not required if the LDAP server provides access for anonymous auth. The secret should contain the key `password` like the following: | *corev1.LocalObjectReference | false |
| userSearch | User search queries for users. | *[LDAPConnectorConfigUserSearch](#ldapconnectorconfigusersearch) | false |
| groupSearch | Group search queries for groups given a user entry. | *[LDAPConnectorConfigGroupSearch](#ldapconnectorconfiggroupsearch) | false |

[Back to TOC](#table-of-contents)

## LDAPConnectorConfigGroupSearch



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| baseDN | BaseDN to start the search from. It will translate to the query \"(&(objectClass=group)(member=<user uid>))\". | string | true |
| filter | Optional filter to apply when searching the directory. For example \"(objectClass=posixGroup)\" | *string | false |
| scope | Can either be: * \"sub\" - search the whole sub tree * \"one\" - only search one level Default to \"sub\" if not specified. | *string | false |
| userAttr | Following two fields are used to match a user to a group.  It adds an additional requirement to the filter that an attribute in the group match the user's attribute value. For example that the \"members\" attribute of a group matches the \"uid\" of the user. The exact filter being added is:\n  (<groupAttr>=<userAttr value>) | *string | false |
| groupAttr |  | *string | false |
| nameAttr | The attribute of the group that represents its name. | *string | false |

[Back to TOC](#table-of-contents)

## LDAPConnectorConfigUserSearch



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| baseDN | BaseDN to start the search from. It will translate to the query \"(&(objectClass=person)(uid=<username>))\". For example \"cn=users,dc=example,dc=com\" | string | true |
| username | Username attribute used for comparing user entries. This will be translated and combined with the other filter as \"(<attr>=<username>)\". | string | true |
| filter | Optional filter to apply when searching the directory. For example \"(objectClass=person)\" | *string | false |
| scope | Can either be: * \"sub\" - search the whole sub tree * \"one\" - only search one level Default to \"sub\" if not specified. | *string | false |
| idAttr | A mapping of attributes on the user entry to the name claim. Default to \"uid\" if not specified. | *string | false |
| emailAttr | A mapping of attributes on the user entry to the email claim. Default to \"mail\" if not specified. | *string | false |
| nameAttr | Maps to display name of users. | *string | false |
| emailSuffix | If this is set, the email claim of the id token will be constructed from the idAttr and value of emailSuffix. This should not include the @ character. | *string | false |

[Back to TOC](#table-of-contents)

## OIDCConnectorConfig



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| issuer | Canonical URL of the provider, also used for configuration discovery. This value MUST match the value returned in the provider config discovery. See: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig | string | true |
| clientSecretRef | Reference to secret that contains the client ID and client secret. The secret should contain two keys `client-id` and `client-secret` like the following: | corev1.LocalObjectReference | true |
| redirectURI | Dex's issuer URL + \"/callback\" | string | true |
| basicAuthUnsupported | Some providers require passing client secret via POST parameters instead of basic auth, despite the OAuth2 RFC discouraging it. Many of these cases are caught internally, but some may need to uncommented the following field. | *bool | false |
| scopes | List of additional scopes to request in token response. Defaults to \"profile\" and \"email\" | []string | false |
| hostedDomains | Google supports whitelisting allowed domains when using G Suite (Google Apps). The following field can be set to a list of domains that can log in: | []string | false |
| insecureSkipEmailVerified | Some providers return claims without \"email_verified\", when they had no usage of emails verification in enrollment process or if they are acting as a proxy for another IDP (e.g., AWS Cognito with an upstream SAML IDP). This can be overridden with the below option. | *bool | false |
| insecureEnableGroups | Groups claims (like the rest of oidc claims through dex) only refresh when the id token is refreshed meaning the regular refresh flow doesn't update the groups claim. As such by default the oidc connector doesn't allow groups claims. If you are okay with having potentially stale group claims you can use this option to enable groups claims through the oidc connector on a per-connector basis.  This can be overridden with the below option | *bool | false |
| getUserInfo | When enabled, the OpenID Connector will query the UserInfo endpoint for additional claims. UserInfo claims take priority over claims returned by the IDToken. This option should be used when the IDToken doesn't contain all the claims requested. https://openid.net/specs/openid-connect-core-1_0.html#UserInfo | *bool | false |
| userIDKey | Configurable key which contains the user id claim. Default to \"sub\" if not specified. Claims list at https://openid.net/specs/openid-connect-core-1_0.html#Claims | *string | false |
| userNameKey | Configurable key which contains the user name claim. Default to \"name\" if not specified. | *string | false |

[Back to TOC](#table-of-contents)

## SAMLConnectorConfig



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| ssoURL | SSO URL used for POST value. | string | true |
| redirectURI | Dex's callback URI (i.e., Dex's issuer URL + \"/callback\"). If the response assertion status value contains a Destination element, it must match this value exactly. This is also used as the expected audience for AudienceRestriction elements if `entityIssuer` isn't specified. | string | true |
| usernameAttr | Name of attributes in the returned assertions to map to ID token username claim. | string | true |
| emailAttr | Name of attributes in the returned assertions to map to ID token email claim. | string | true |
| groupsAttr | Name of attributes in the returned assertions to map to ID token group claims. | *string | false |
| caSecretRef | A secret reference to the CA to use when validating the signature of the SAML response. The secret should have type \"Opaque\" and contain the key \"tls.crt\". This field must be specified if `insecureSkipSignatureValidation` is not set. | *corev1.LocalObjectReference | false |
| insecureSkipSignatureValidation | To skip signature validation, uncomment the following field. This should only be used during testing and may be removed in the future. | *bool | false |
| entityIssuer | Manually specify dex's Issuer value. When provided dex will include this as the Issuer value during AuthnRequest. It will also override the redirectURI as the required audience when evaluating AudienceRestriction elements in the response. | *string | false |
| ssoIssuer | Issuer value expected in the SAML response. | *string | false |
| groupsDelim | Delimiter for splitting groups returned as a single string. By default, multiple groups are assumed to be represented as multiple attributes with the same name. If \"groupsDelim\" is provided groups are assumed to be represented as a single attribute and the delimiter is used to split the attribute's value into multiple groups. | *string | false |
| nameIDPolicyFormat | Requested format of the NameID. The NameID value is is mapped to the user ID of the user. This can be an abbreviated form of the full URI with just the last component. For example, if this value is set to \"emailAddress\" the format will resolve to:\n  `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`\nIf no value is specified, this value defaults to:\n  `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent` | *string | false |

[Back to TOC](#table-of-contents)

## Client

Client is the Schema for the clients API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#objectmeta-v1-meta) | false |
| spec |  | [ClientSpec](#clientspec) | false |

[Back to TOC](#table-of-contents)

## ClientList

ClientList contains a list of Client

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.17/#listmeta-v1-meta) | false |
| items |  | [][Client](#client) | true |

[Back to TOC](#table-of-contents)

## ClientSpec

ClientSpec defines the desired state of Client OAuth2 Client representation https://github.com/dexidp/dex/blob/4bede5eb80822fc3a7fc9edca0ed2605cd339d17/storage/storage.go#L109-L136

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| displayName | The display name for the Client | string | true |
| clientSecretRef | Reference to a secret that contains the client secret. The secret should contain `client-secret` key like the following: | corev1.LocalObjectReference | true |
| redirectURIs | A registered set of redirect URIs. When redirecting from dex to the client, the URI requested to redirect to MUST match one of these values, unless the client is \"public\". | []string | true |
| trustedPeers | TrustedPeers are a list of peers which can issue tokens on this client's behalf using the dynamic \"oauth2:server:client_id:(client_id)\" scope. If a peer makes such a request, this client's ID will appear as the ID Token's audience.\n\nClients inherently trust themselves. | []string | true |
| public | Public clients must use either use a redirectURL 127.0.0.1:X or \"urn:ietf:wg:oauth:2.0:oob\" | *bool | false |
| logoURL | LogoURL used when displaying this client to the end user. | *string | false |

[Back to TOC](#table-of-contents)
