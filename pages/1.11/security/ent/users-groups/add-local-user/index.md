---
layout: layout.pug
navigationTitle:  Adding local users
title: Adding local users
menuWeight: 10
excerpt: Adding a local user with the web interface or CLI

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


# Adding local users by using the GUI

1. Log in as a user with the `superuser` permission.

   ![Login](/1.11/img/gui-installer-login-ee.gif)

1. Select **Organization > Users** and create a new user. Type in the user's full name, username, and password.

   ![Create user Cory](/1.11/img/service-group3.png)


# Adding local users by using the CLI

**Prerequisite:**
- [DC/OS Enterprise CLI](/1.11/cli/enterprise-cli/)


1.  Create a user group named `services` with this command.

    ```bash
    dcos security org groups create services
    ```

1.  Add user `cory` to the `services` group with this command.

    ```bash
    dcos security org groups add_user dcos-services cory
    ```

1.  Verify that the user is added to your cluster with this command.

    ```bash
    dcos security org users show
    ```

    The output should resemble this:

    ```bash
    dcos security org users show
    bootstrapuser:
        description: Bootstrap superuser
        is_remote: false
        is_service: false
    cory:
        description: Cory
        is_remote: false
        is_service: false
    ```
