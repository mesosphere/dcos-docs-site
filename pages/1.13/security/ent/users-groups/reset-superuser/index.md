---
layout: layout.pug
navigationTitle:  Resetting the Superuser
title: Resetting the Superuser
menuWeight: 30
excerpt: Reset an existing user or create a new user with the DC/OS reset superuser script

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can reset an existing user or create a new user with the DC/OS reset superuser script. This is helpful if the superuser account becomes locked or invalid.

**Prerequisite:** You must have SSH access to the DC/OS cluster.

1.  [SSH](/1.13/administering-clusters/sshcluster/) to the master node using the method of your choice.

    For example:

    ```bash
    dcos node ssh --master-proxy --leader
    ```

1.  Navigate to `/opt/mesosphere/active/bouncer/bouncer/bin/` and run the `reset-superuser` script with the username (`<username>`) specified.

    ```bash
    sudo /opt/mesosphere/bin/dcos-shell /opt/mesosphere/active/bouncer/bouncer/bin/reset-superuser <username>
    ```

1.  Enter the new password for the user and follow the prompts to complete the procedure.

    ```bash
    Type superuser password:
    Retype superuser password:
    ```

    For an existing user, the output should resemble:

    ```bash
    170518-22:11:11.630 INFO: Attempt to create user with uid `<username>`.
    170518-22:11:12.111 INFO: User already exists.
    170518-22:11:12.111 INFO: Update password for user with uid `<username>`.
    170518-22:11:12.597 INFO: Password updated.
    170518-22:11:12.597 INFO: Attempt to create ACL with rid `dcos:superuser`.
    170518-22:11:12.668 INFO: ACL already exists.
    170518-22:11:12.668 INFO: Attempt to create group with gid `superusers`.
    170518-22:11:12.735 INFO: Group already exists.
    170518-22:11:12.735 INFO: Attempt to assign superuser privileges to the superusers group.
    170518-22:11:12.803 INFO: Permission is already set.
    170518-22:11:12.803 INFO: Attempt to put uid `<username>` into the superusers group.
    170518-22:11:12.877 INFO: User added to group.
    170518-22:11:12.877 INFO: Done.
    ```
