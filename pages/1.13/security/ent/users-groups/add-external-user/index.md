---
layout: layout.pug
navigationTitle:  Adding external users
title: Adding external users
menuWeight: 20
excerpt: Adding an external user to DC/OS

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

After you have configured a directory service or an identity provider, you can add the users to DC/OS so that you can assign permissions.

# Prerequisites

- An external [LDAP directory](/1.13/security/ent/ldap/).
- An [OpenID Connect or SAML provider](/1.13/security/ent/sso/).

# Adding external users via logon attempt
By default, users have no DC/OS permissions. Any attempts to access DC/OS without permissions will fail. However, if you have successfully configured an LDAP directory or an identity provider and the user provides valid credentials, the logon attempt will cause the user's account to be added to DC/OS.

**Requirement**: The user's name and password must be correct.

Because you will need the user account in DC/OS before you can add any permissions, you may find it easiest to ask each of the users to try to log on to DC/OS. Though their attempts will fail, this will serve to populate DC/OS with their accounts.

# Importing external LDAP users individually from the web interface

To import an external user:

1. Select **Organization > Users** and create a new user.

2. Select **Import LDAP User**.

3. Type the user's user name or ID in the **User Name** box.

4. Click **Add**.

5. When you have finished adding all of your users, click the **Close** button.


# Importing groups of LDAP users

## About importing LDAP groups

You can import existing LDAP user groups into DC/OS. Starting in DC/OS Enterprise 1.12, imported LDAP groups are supported by LDAP sync. DC/OS periodically synchronizes the external LDAP directory, by default this is set to every 1800 seconds (30 mins). 

**Requirement:** Group entries in the LDAP directory must list their members with the `member`, `uniquemember`, or `memberuid` attribute.

Group size is limited to 100 users. To increase this limit, contact Mesosphere customer support. If the user name matches an existing user, it is not reimported. You can check the logs to determine if this has occurred.

## Configuring LDAP group import

1. Open the **Settings** -> **LDAP Directories** tab.

2. Click **ADD DIRECTORY**.

3. Click **Group Import (Optional)**.

4. Provide the DN for the subset of the directory tree that should be searched in the **GROUP SEARCH BASE** field. Example: `(cn=Users,dc=mesosphere,dc=com)`.

5. Provide a template to be used to translate a group name to a valid LDAP search filter in the **GROUP SEARCH FILTER TEMPLATE** field. The string must contain `%(groupname)`. Example: `(&(objectclass=group)(sAMAccountName=%(groupname)s))`.

6. When completed, your dialog should look something like the following.

   ![LDAP Group Import Configuration](/1.13/img/1-11-ldap-group-import.png)

   Figure 1. LDAP group import configuration

7. Click **ADD DIRECTORY**.

## Importing LDAP groups using the web interface

1. In the **Organization** -> **Groups** tab, click the **+** icon in the top right and select **Import LDAP Group**.

1. Type the LDAP group name in the **Name** box. The group name must not match the name of an existing group.

1. Click **Add Group**. This creates a user group in DC/OS with the same name as the LDAP group and imports all of the users in the LDAP group into DC/OS.

1. When you have finished adding all of your groups, click the **Close** button.


## Importing LDAP groups using the API

You can import a group of LDAP users by using the `/ldap/importuser` [IAM API](/1.13/security/ent/iam-api/) endpoint.

**Prerequisites:**

- The `group-search` configuration key must be set, as discussed in [Configuring LDAP group import](#Configuring-LDAP-group-import).
- The existing group entries must list their members by using the `member`, `uniquemember`, or `memberuid` attribute.
- You must follow the steps in [Obtaining the root certificate of your DC/OS CA](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

In this example a group named `johngroup` is imported.

1.  Log in to the CLI to ensure that you can reference the cluster URL as shown in the following code samples.

1.  Initiate import with this command:

    ```bash
    curl -i -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" --data '{"groupname": "johngroup"}' --header "Content-Type: application/json" $(dcos config show core.dcos_url)/acs/api/v1/ldap/importgroup
    ```

1.  Confirm that `johngroup` is added:

    ```bash
    curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/groups/johngroup
    ```

    ```bash
    curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/groups/johngroup/users
    ```
