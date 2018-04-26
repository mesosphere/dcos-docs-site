---
layout: layout.pug
navigationTitle:  User Management
excerpt: Managing user access
title: User Management
menuWeight: 201
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Users are granted access to DC/OS by another authorized user. A default user is automatically created by the first user that logs in to the DC/OS cluster.

To manage users:

1.  Launch the DC/OS web interface and login with your username (Google, GitHub, and Microsoft) and password.

2.  Click on the **System** -> **Organization** tab and choose your action.

    ### Add users

    From the **Users** tab, click **New User** and fill in the new user email address. New users are automatically sent an email notifying them of access to DC/OS.

    **Tip:** Any user with access to DC/OS can invite more users. Each DC/OS user is an administrator, there is no explicit concept of privileges with DC/OS.

    ![new DC/OS user](/1.11/img/ui-add-user.gif)

    ### Delete users

    1.  From the **Users** tab, select the user name and click **Delete**.
    2.  Click **Delete** to confirm the action.

    ### Switch users

    To switch users, you must log out of the current user and then back in as the new user.

    *   To log out of the DC/OS web interface, click on your username in the upper-left side and select **Sign Out**.

        ![log out](/1.11/img/auth-enable-logout-user.gif)

        You can now log in as another user.

    *   To log out of the DC/OS CLI, enter the command:

        ```bash
        dcos config unset core.dcos_acs_token
        Removed [core.dcos_acs_token]
        ```

        You can now log in as another user.

## Next Steps

For more information on security, check out [Security and Authentication](/1.11/security/oss/)
