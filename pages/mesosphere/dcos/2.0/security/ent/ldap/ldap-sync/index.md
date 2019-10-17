---
layout: layout.pug
navigationTitle: Synchronization
title: LDAP Synchronization 
menuWeight: 4
excerpt: LDAP Synchronization
enterprise: true
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
# Background

DC/OS Enterprise supports [directory-based authentication through LDAP](/mesosphere/dcos/1.14/security/ent/ldap/). Users and user groups can be imported from the external directory into the DC/OS IAM. See [managing users and groups](/mesosphere/dcos/1.14/security/ent/users-groups/).

In earlier versions of DC/OS Enterprise, LDAP Group Import and LDAP User Import were one-shot operations. If a user was removed from the external directory, that user would not be automatically removed from the DC/OS IAM. Similarly, if an “Engineers” user group was imported from the directory, any new user added to that group would have to be added explicitly to the DC/OS IAM. Keeping imported users and user groups synchronized between the DC/OS IAM and the directory was a laborious task for administrators of large organizations.

In DC/OS Enterprise 1.12 we added automatic LDAP synchronization. This feature is enabled by default and runs every 30 minutes. This feature is designed to keep IAM users, IAM user groups and the relations between them synchronized with their counterparts in the external directory.

<p class="message--note"><strong>NOTE: </strong> LDAP synchronization occurs periodically. There are cases where you modify the external directory, for example, to revoke a permission by modifying the group membership or removing user accounts. In some cases, these changes must be reflected in the DC/OS IAM within seconds, not minutes and therefore waiting for the next LDAP synchronization event is not an option. For these scenarios, you will have to make the equivalent changes to the DC/OS IAM instead of waiting for the next LDAP synchronization event.</p>

# The LDAP synchronization procedure
LDAP synchronization only recognizes IAM users and user groups that were imported from the external directory. The intent of LDAP synchronization is to have imported users and user groups mirror their counterparts in the external directory.

The LDAP synchronization procedure collects the set of users, user groups, and group membership details from the IAM then queries the external directory using LDAP for the corresponding entities. Next, it determines which operations need to be performed against the DC/OS IAM in order to synchronize the two data sets.

The procedure’s logic is as follows:
- An imported IAM group that can no longer be found in the external directory will be removed from the IAM. Any users that were part of that group will remain in the DC/OS IAM independently.
- An imported IAM user that can no longer be found in the external directory will be removed from the IAM.
- If a user ‘Alice’ is added to an imported ‘Engineers’ group in the external directory, then a new ‘Alice’ user will be created in the IAM and be added as a member of the existing ‘Engineers’ user group. If the ‘Alice’ user was imported previously, and therefore already exists in the IAM, it is simply added to the ‘Engineers’ user group.
- If a user ‘Alice’ was a member of the imported ‘Engineers’ group and is then removed in the external directory, then that user is removed from the ‘Engineers’ group in the IAM. The user is not removed from the IAM.

<p class="message--note"><strong>NOTE: </strong> The strategy by which user groups in the IAM are linked to their counterparts in the external directory relies on their names. Therefore, renaming a user group in the external directory is equivalent to removing that user group and creating a new one with the same set of members. Be careful when renaming user groups in your external directory!</p>

# Operational details
The LDAP synchronization procedure is performed by a DC/OS component present on every master node. It runs as a `systemd` service called `dcos-iam-ldap-sync.service` which is triggered periodically by a `dcos-iam-ldap-sync.timer` systemd timer unit.

This procedure runs on the DC/OS master node which corresponds to the current Mesos leader. Should that master node fail and thereby trigger a Mesos leader re-election, the LDAP synchronization procedure will be performed on the master node corresponding to the newly elected Mesos leader.

Every run of the LDAP synchronization logs detailed logic to the `systemd` journal. These logs may be inspected by checking the logs on the DC/OS master node corresponding to the Mesos leader.

The exact period is configurable on installation. See the [configuration reference](/mesosphere/dcos/1.14/installing/production/advanced-configuration/configuration-reference/) under [advanced configuration](/mesosphere/dcos/1.14/installing/production/advanced-configuration/). 

# Importing groups with valid names
If you import LDAP group names to be used as the DC/OS groups, you should keep in mind that the LDAP groups you want to import must have a supported group name format. 

To import an LDAP group, the group name must meet the following requirements:
- The group name must consist of at least one character to a maximum of 64 characters.
- The group name can only contain the supported alphanumeric characters **a** to **z**, **A** to **Z**, **0** to **9**, dashes (-), underscores (*_*), or @.
- The group name must not contain blank spaces or any other special characters.

If you see an error when you attempt to import or synchronize LDAP entries, check whether the group name you have defined in the LDAP identity store includes an invalid character or name format. To avoid LDAP name conflicts, be sure the groups you  want to import and synchronize have valid name formats for DC/OS. 
