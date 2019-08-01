---
layout: layout.pug
navigationTitle: External User Accounts
title: External User Account Management
excerpt: Managing external user accounts
render: mustache
model: /1.14/data.yml
menuWeight: 10
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

<p class="message--note"><strong>NOTE: </strong>An external user is automatically created for the first user who logs in to the DC/OS cluster via the web interface.</p>

# Add an external user account

## Using the web interface

1.  Log in to the web interface.

2.  Click on  **Organization** in the left hand menu. From the **Users** screen, click the plus sign (**+**) in the upper right corner, and fill in the new user email address.

![new DC/OS user](/mesosphere/dcos/1.14/img/1-11-add-user-to-cluster.png)

Figure 1. Adding a new user

## Using the command line

You can add external users to your DC/OS cluster from a terminal by using the `dcos_add_user.py` script.

**Prerequisites:**

- DC/OS is [installed](/mesosphere/dcos/1.14/installing/)

1.  [SSH](/mesosphere/dcos/1.14/administering-clusters/sshcluster/) to a master node and run this command, where `<email>` is the user's email:

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

2.  Send the URL of your DC/OS cluster (e.g. `http://<public-master-ip>/`) to the new user. The user specified by `<email>` can now login and access the cluster.

# Remove an external user account

## Using the web interface

1.  From the **Users** screen, select the user name and click **Delete**.
2.  Click **Delete** to confirm the action.

<img src="/1.14/img/1-11-delete-user.png" alt="delete-user" width="350" height="300" border="2">

 Figure 2. Deleting a user
