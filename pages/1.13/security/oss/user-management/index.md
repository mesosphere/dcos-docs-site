---
layout: layout.pug
navigationTitle:  User Access Management
excerpt: Managing user access in DC/OS Open Source deployments
title: User Access Management
menuWeight: 10
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Users can be granted access to DC/OS by another authorized user. A default user is automatically created by the first user who logs in to the DC/OS cluster. Users can be added from the web interface or from the CLI.

## Add users from the web interface

1.  Launch the DC/OS web interface and log in with your username (Google, GitHub, and Microsoft) and password.

2.  Click on  **Organization** in the left hand menu. From the **Users** screen, click the plus sign (**+**) in the upper right corner, and fill in the new user email address. New users are automatically sent an email notifying them of access to DC/OS.

![new DC/OS user](/1.13/img/1-11-add-user-to-cluster.png)

Figure 1. Adding a new user

<p class="message--note"><strong>NOTE: </strong>Any user with access to DC/OS can invite more users. Each DC/OS user is an administrator, there is no explicit concept of privileges with DC/OS.</p>

## Add users from the CLI
You can add users to your DC/OS cluster from a terminal by using the `dcos_add_user.py` script. This script is included by default with your DC/OS installation.

**Prerequisites:**

- DC/OS is [installed](/1.13/installing/)

1.  [SSH](/1.13/administering-clusters/sshcluster/) to a master node and run this command, where `<email>` is the user's email:

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

1.  Send the URL of your DC/OS cluster (e.g. `http://<public-master-ip>/`) to the new user. The user specified by `<email>` can now login and access the cluster.

## Delete users
1.  From the **Users** screen, select the user name and click **Delete**.
2.  Click **Delete** to confirm the action.

<img src="/1.12/img/1-11-delete-user.png" alt="delete-user" width="350" height="300" border="2">

 Figure 2. Deleting a user

## Switching users 

To switch users, you must log out of the current user and then back in as the new user.

### From the web interface

1.   To log out of the DC/OS web interface, click on your username in the upper-right side and select **Sign Out**.

![log out](/1.13/img/1-11-user-drop-down-menu.png)


Figure 3. Drop down user menu

You can now log in as another user.

### From the CLI

1.  To log out of the DC/OS CLI, enter the command:

```bash
dcos config unset core.dcos_acs_token
Removed [core.dcos_acs_token]
```

You can now log in as another user.

## Next Steps

For more information on security, check out [Security and Authentication](/1.13/security/oss/)
