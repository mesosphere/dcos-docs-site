---
layout: layout.pug
navigationTitle: Synchronization
title: LDAP Synchronization 
menuWeight: 4
excerpt: LDAP Synchronization
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
# Background

DC/OS Enterprise supports [directory-based authentication via LDAP](/1.13/security/ent/ldap/). Users and user groups can be imported from the external directory into the DC/OS IAM. See [managing users and groups](/1.13/security/ent/users-groups/).

In earlier versions of DC/OS Enterprise, LDAP Group Import and LDAP User Import were oneshot operations. If a user was removed from the external directory, that user would not be automatically removed from the DC/OS IAM. Similarly, if an “Engineers” user group was imported from the directory, any new user added to that group would have to be added explicitly to the DC/OS IAM. Keeping imported users and user groups synchronized between the DC/OS IAM and the directory was a laborious task for administrators of large organizations.

In DC/OS Enterprise v1.12 we added automatic LDAP synchronization. This feature is enabled by default and runs every 30 minutes. This feature is designed to keep IAM users, IAM user groups and the relations between them synchronized with their counterparts in the external directory.

**A quick note on security:** LDAP synchronization occurs periodically. There are cases where you modify the external directory, e.g. to perform a permission revocation through modification of group membership or removal of user accounts. In some cases, these changes must be reflected in the DC/OS IAM within seconds, not minutes and therefore waiting for the next LDAP synchronization event is not an option. For these scenarios you will have to make the equivalent changes to the DC/OS IAM instead of waiting for the next LDAP synchronization event.

# The LDAP synchronization procedure
LDAP synchronization only regards IAM users and user groups that were imported from the external directory. The intent of LDAP synchronization is to have imported users and user groups mirror their counterparts in the external directory.

The LDAP synchronization procedure collects the set of users, user groups and group membership details from the IAM then queries the external directory via LDAP for the corresponding entities. Next, it determines which operations need to be performed against the DC/OS IAM in order to synchronize the two datasets.

The procedure’s logic follows:
- An imported IAM group that can no longer be found in the external directory will be removed from the IAM. Any users that were part of that group will remain in the DC/OS IAM independently.
- An imported IAM user that can no longer be found in the external directory will be removed from the IAM.
- If a user ‘Alice’ is added to an imported ‘Engineers’ group in the external directory, then a new ‘Alice’ user will be created in the IAM and be added as a member of the existing ‘Engineers’ user group. If the ‘Alice’ user was imported previously, and therefore already exists in the IAM, it is simply added to the ‘Engineers’ user group.
- If a user ‘Alice’ was a member of the imported ‘Engineers’ group and is then removed in the external directory, then that user is removed from the ‘Engineers’ group in the IAM. The user is not removed from the IAM.

**Note:** The strategy by which user groups in the IAM are linked to their counterparts in the external directory relies on their names. Therefore, renaming a user group in the external directory is equivalent to removing that user group and creating a new one with the same set of members. Be careful when renaming user groups in your external directory!

# Operational details
The LDAP synchronization procedure is performed by a DC/OS component present on every master node. It runs as a systemd service called `dcos-iam-ldap-sync.service` which is triggered periodically by a `dcos-iam-ldap-sync.timer` systemd timer unit.

This procedure runs on the DC/OS master node which corresponds to the current Mesos leader. Should that master node fail and thereby trigger a Mesos leader re-election, the LDAP synchronization procedure will be performed on the master node corresponding to the newly elected Mesos leader.

Every run of the LDAP synchronization logs detailed logic to the `systemd` journal. These logs may be inspected by checking the logs on the DC/OS master node corresponding to the Mesos leader.

The exact period is configurable on installation. See the [configuration reference](/1.13/installing/production/advanced-configuration/configuration-reference/) under [advanced configuration](/1.13/installing/production/advanced-configuration/). 
