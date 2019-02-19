---
layout: layout.pug
navigationTitle: External users
title: External users
excerpt: Managing external DC/OS users
menuWeight: 10
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

An external user is automatically created for the first user who logs in to the DC/OS cluster via a single sign-on flow through Auth0.

# Log in external users via the web interface

1.  Launch the DC/OS web interface.

2.  Log in through a single sign-on flow using the identity provider of your choice (Google, GitHub, and Microsoft).

**NOTE**: Additional users must be added by another authorized user before they can log in to DC/OS.


# Log in external users via the DC/OS CLI

1.  To log in to the DC/OS CLI, enter the [auth login](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/) command:

```bash
dcos auth login --provider dcos-oidc-auth0
If your browser didn't open, please go to the following link:

    http://172.17.0.2/login?redirect_uri=urn:ietf:wg:oauth:2.0:oob

Enter OpenID Connect ID Token: 
>
```

2. Follow the displayed instructions to trigger the browser login flow.

3. Copy the `OpenID Connect ID token` from the modal dialog that appears in the browser.

4. Paste the `OpenID Connect ID token` into the DC/OS CLI for login completion.

**NOTE**: The `--provider` argument is set to `dcos-oidc-auth0` by default.

# Add external users from the web interface

1.  Log in to the web interface with your username (Google, GitHub, and Microsoft) and password.

2.  Click on  **Organization** in the left hand menu. From the **Users** screen, click the plus sign (**+**) in the upper right corner, and fill in the new user email address. New users are automatically sent an email notifying them of access to DC/OS.

![new DC/OS user](/1.13/img/1-11-add-user-to-cluster.png)

Figure 1. Adding a new user

# Add external users from the CLI
You can add external users to your DC/OS cluster from a terminal by using the `dcos_add_user.py` script. This script is included by default with your DC/OS installation.

**Prerequisites:**

- DC/OS is [installed](/1.13/installing/)

1.  [SSH](/1.13/administering-clusters/sshcluster/) to a master node and run this command, where `<email>` is the user's email:

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

2.  Send the URL of your DC/OS cluster (e.g. `http://<public-master-ip>/`) to the new user. The user specified by `<email>` can now login and access the cluster.

# Delete users
1.  From the **Users** screen, select the user name and click **Delete**.
2.  Click **Delete** to confirm the action.

<img src="/1.12/img/1-11-delete-user.png" alt="delete-user" width="350" height="300" border="2">

 Figure 2. Deleting a user

# Switch users 

To switch users, you must log out of the current user and then back in as the new user.

## From the web interface

1.   To log out of the DC/OS web interface, click on your username in the upper-right side and select **Sign Out**.

![log out](/1.13/img/1-11-user-drop-down-menu.png)

Figure 3. Drop down user menu

You can now log in as another user.

## From the DC/OS CLI

4.  To log out of the DC/OS CLI, enter the command:

```bash
dcos config unset core.dcos_acs_token
Removed [core.dcos_acs_token]
```

You can now log in as another user.

# Next Steps

For more information on security, check out [Security and Authentication](/1.13/security/oss/)
