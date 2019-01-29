---
layout: layout.pug
navigationTitle: Security for DSE
excerpt: Security, encryption and authorization for DSE
title: Security
menuWeight: 50
model: /services/dse/data.yml
render: mustache
---

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of these important features.

*Note*: These security features are only available on DC/OS Enterprise 1.10 and above.

## Transport Encryption

#include /services/include/security-transport-encryption-lead-in.tmpl

#include /services/include/security-configure-transport-encryption.tmpl

#include /services/include/security-transport-encryption-clients.tmpl

## DSE Authentication/Authorization Schemes
{{ model.shortTechName }} in DC/OS currently supports both internal and ldap authentication/authorization schemes.  You can configure both schemes and then select the order in which they are used, or you can configure just one, in which case only that scheme will be used.  {{ model.shortTechName }} will try to authenticate with the default scheme first and fall back to the alternate scheme if it has been configured. More information about how {{ model.shortTechName }} handles this can be found in [DataStax's documentation](http://docs.datastax.com/en/dse/5.1/dse-admin/datastax_enterprise/security/secDSEUnifiedAuthAbout.html)

## Enabling {{ model.shortTechName }} Authentication/Authorization
To enable {{ model.shortTechName }} authentication/authorization, follow these steps:
   1. In Advanced Installation wizard, configure the following fields:
      ```
      In "cassandra" tab,
      Set authenticator to com.datastax.bdp.cassandra.auth.DseAuthenticator
      Set authorizer to com.datastax.bdp.cassandra.auth.DseAuthorizer
      Set role_manager to com.datastax.bdp.cassandra.auth.DseRoleManager

      In "dse" tab,
      Check AUTHENTICATION_OPTIONS_ENABLED checkbox
      Set AUTHENTICATION_OPTIONS_DEFAULT_SCHEME to either internal or ldap, depending on which sheme you want as the default
      Set AUTHENTICATION_OPTIONS_OTHER_SCHEMES to either internal or ldap (optional to configure the fallback)
      Set ROLE_MANAGEMENT_OPTIONS_MODE to either internal or ldap, according to your needs
      Check AUTHORIZATION_OPTIONS_ENABLED checkbox (optional to enable authorization)
      ```
   1. If you are using only internal auth, no further configuration is required for {{ model.shortTechName }}. If you are also using ldap, then follow the sections below to configure ldap based on your needs.

## {{ model.shortTechName }} LDAP Configuration
When you enable LDAP authentication in DataStax Enterprise, users and groups that are managed by external LDAP servers can be authenticated by DataStax Enterprise.  To enable LDAP authentication with your {{ model.shortTechName }} cluster, you need to configure the followings:

   1. In Advanced Installation wizard, you need to configure the following fields according to your LDAP settings:
      ```
      In "dse" tab,
      Check ldap's enabled checkbox
      Set server_host to your LDAP server FQDN or IP address
      Set server_port of your LDAP server port (default is 389)
      Set search_dn  ex. cn=admin,dc=example,dc=org
      Set search_password  ex. secret
      Set user_search_base  ex. ou=People,dc=example,dc=org
      Set user_search_filter  ex. (uid={0})
      Set user_memberof_attribute  ex. memberof
      Set group_search_type  ex. memberof_search
      Set group_search_base  ex. ou=Groups,dc=example,dc=org
      Set group_search_filter  ex. (uniquemember={0})
      Set group_name_attribute  (default is 0)
      Set credentials_validity_in_ms  (default is 0)
      Set search_validity_in_seconds  (default is 0)
      Set connection_pool_max_active  (default is 8)
      Set connection_pool_max_idle  (default is 8)
      ```

   1. You will need to run the following CQL statements to grant relevant permission to your LDAP roles
      ```
      cqlsh> CREATE ROLE <role-name> WITH LOGIN = TRUE;  (role-name is the corresponding role inside your LDAP)

      cqlsh> GRANT EXECUTE ON ALL AUTHENTICATION SCHEMES TO <role-name>;  OR
      cqlsh> GRANT EXECUTE ON (INTERNAL|LDAP) SCHEME TO <role-name>;
      ```
      Please refer to [DataStax's documentation](http://docs.datastax.com/en/latest-dse/datastax_enterprise/sec/authLdapConfig.html) for more detailed description of each field above.

## OpsCenter LDAP Configuration
Configure LDAP (Lightweight Directory Access Protocol) for users accessing OpsCenter.

   1. In Advanced Installation wizard, you need to configure the following fields according to your LDAP settings:
      ```
      In "opscenter" tab,
      Check Authentication Configuration's checkbox
      Set login_user to a LDAP user's uid belonging to one or more LDAP groups in "admin_group_name" field below
      Set login_password (the password associated with the login_user field above)
      Set method to LDAP
      Check LDAP Configuration's checkbox
      Set server_host to your LDAP server FQDN or IP address
      Set server_port of your LDAP server port (default is 389)
      Set search_dn  ex. cn=admin,dc=example,dc=org
      Set search_password  ex. secret
      Set user_search_base  ex. ou=People,dc=example,dc=org
      Set user_search_filter  ex. (uid={0})
      Set user_memberof_attribute  ex. memberof
      Set group_search_type  ex. directory_search
      Set group_search_base  ex. ou=Groups,dc=example,dc=org
      Set group_search_filter_with_dn  ex. (member={0})
      Set group_name_attribute  ex. cn
      Set admin_group_name  ex. mygroup, manager, developer
      ```
      Please refer to [DataStax's documentation](https://docs.datastax.com/en/latest-opsc/opsc/configure/opscConfigLDAP.html) for more detailed description of each field above.
      Once your {{ model.shortTechName }} Package service instance is ready, you can use your LDAP account to log in to OpsCenter to manage your {{ model.shortTechName }} cluster.

## OpsCenter Internal Authentication Configuraton

   1. In Advanced Installation wizard, you need to configure the following fields:
      ```
      In "opscenter" tab,
      Check Authentication Configuration's checkbox
      Leave login_user as admin (when you install the package the first time)
      Leave login_password as admin (when you install the package the first time)
      ```
      Once your {{ model.shortTechName }} Package service instance is ready, you can use "admin" and "admin" as the username and the password to log into OpsCenter to start managing your {{ model.shortTechName }} cluster.
