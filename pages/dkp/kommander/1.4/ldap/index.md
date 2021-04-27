---
layout: layout.pug
beta: false
navigationTitle: LDAP Directory
title: External LDAP Identity Provider
menuWeight: 10
excerpt: Use your LDAP Identity Provider with Konvoy and Kommander
enterprise: false
---

## Introduction

Authentication is verifying the identity of a user and this is typically handled outside of Kubernetes. You can use an external Lightweight Directory Access Protocol (LDAP) directory for authentication into Konvoy. LDAP directories are created in organizations as a central location for authentication information for users and groups of users. By connecting your LDAP directory into Konvoy, you can authenticate into Konvoy with your companys' already trusted directory. The following procedures show you how to configure and connect your existing LDAP directory to Konvoy:

## Related Information

- [Connect your LDAP directory to Konvoy using the CLI](/dkp/konvoy/1.4/security/external-idps/howto-dex-ldap-connector/)

- [Configure your LDAP directory using the CLI](/dkp/konvoy/1.4/security/external-idps/rbac/)
- [Connect and configure your LDAP directory to Konvoy using Kommander](./setup-ldap)

- [Troubleshoot your LDAP access by creating a kubectl token](./gen-kubectl-token)
