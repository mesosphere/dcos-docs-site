---
layout: layout.pug
title: Restricting Access to DC/OS Service Groups
navigationTitle: Restricting Access to DC/OS Service Groups
menuWeight: 90
excerpt: Using the DC/OS web interface to achieve multi-tenancy in permissive mode

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

In this section you will see how to use the DC/OS web interface to achieve multi-tenancy in permissive mode.

This tutorial demonstrates how to implement user permissions for DC/OS services in the permissive [security mode](/1.11/security/ent/#security-modes). When you are done you will have multi-tenancy by using DC/OS permissions.

**Prerequisites:**

- DC/OS Enterprise is [installed](/1.11/installing/) in permissive [mode](/1.11/security/ent/#security-modes).

## Create users and groups

1.  Create service groups from the **Services > Services > Create Group**.

    ![Services Create Group](/1.11/img/service-group1.png)

    Figure 1. Create Group page

    In this example a group called `prod-a` and a group called `prod-b` are created. After the groups are created you should see two folders. This is where you will deploy services for the user groups and set the permissions for each unit.

    ![Group folders](/1.11/img/service-group2.png)

    Figure 2. New groups folders

1.  Create your users and groups and define the required permissions for each group.

    1.  Select **Organization > Users** and create a new user.  In this example, two users are created (`Cory` and `Nick`).

        ![Create user Cory](/1.11/img/service-group3.png)

        Figure 3. Creating a new user

        When you are finished, you should see the two users.

        ![All users](/1.11/img/service-group4.png)

        Figure 4. New users in Users page

        Next we will create the groups and assign permissions to the DC/OS services.

    1.  Create user groups from the **Organization > Groups**.

    1.  Select **New Group**. In this example, two groups are created:

        - `prod-a-group` for managing the DC/OS services for user Cory.
        - `prod-b-group` for managing the DC/OS services for user Nick.

        ![prod-a group](/1.11/img/service-group5.png)

        Figure 5. Creating a new group

## Define the permissions

1.  Select **Organization > Groups**.

1.  Select the **prod-a-group** and select **ADD PERMISSION**.  In this example, permissions are assigned to prod-a to allow users to create their own services!

1.  Select the **INSERT PERMISSION STRING** toggle to enter using the string format. Strings are case sensitive.

    All of the required permissions for each group are added here. These permissions will allow users to have access to the DC/OS cluster and deploy their own services. These permissions will also restrict each group so that they can only see their own DC/OS services.

1.  Add each of these permissions for the prod-a-group and click **Close**.

    ```
    dcos:adminrouter:service:marathon full
    dcos:adminrouter:service:nginx full
    dcos:service:marathon:marathon:services:/prod-a full
    dcos:adminrouter:ops:slave full
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:package full
    ```

    ![prod-a-group](/1.11/img/service-group7.png)

    Figure 6. Adding permissions for 'prod-a-group'

    Here is what the permissions view should look like after adding:

    ![prod-a-group](/1.11/img/service-group8.png)

    Figure 7. Group permissions added

1.  Add each of these permissions for the prod-b-group and click **Close**.

    ```
    dcos:adminrouter:service:marathon full
    dcos:adminrouter:service:nginx full
    dcos:service:marathon:marathon:services:/prod-b full
    dcos:adminrouter:ops:slave full
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:package full
    ```

    Now that the permissions are assigned to groups, you can add users to the groups to inherit the permissions.

1.  Select **Organization > Users** and select **Cory**.

1.  Select **Group Membership** and then type `prod-agroup` in the search box, then click to select.

    ![prod-a-group](/1.11/img/service-group9.png)

    Figure 8. Add user to group

1.  Select **Organization > Users** and select **Nick**.

1.  Select **Group Membership** and then type `prod-bgroup` in the search box, then click to select.


## Log in to the DC/OS web interface as user

1.  Log in as Cory to the DC/OS web interface. You can see that user Cory only has access to the **Services** and **Universe** tabs. Also, Cory can only see the **prod-a** services.


    ![prod-a-group](/1.11/img/service-group10.png)

    Figure 9. Restricted view

    **Note:** To log out of the current user, click on the cluster name in the top-left and select **Sign Out**.

    We will deploy an NGINX service to `prod-a-group`.

1.  Select **Services > Services** and the click the plus sign (**+**) to deploy a service.

    1.  Select **JSON Configuration** and paste in the following app definition:

        ```json
        {
          "id": "/prod-a/nginx",
          "cmd": "rm -rf /usr/share/nginx/html && ln -s /mnt/mesos/sandbox/hello-nginx-master/ /usr/share/nginx/html && nginx -g 'daemon off;'",
          "instances": 1,
          "cpus": 1,
          "mem": 1024,
          "disk": 0,
          "gpus": 0,
          "fetch": [
            {
              "uri": "https://github.com/mesosphere/hello-nginx/archive/master.zip",
              "extract": true,
              "executable": false,
              "cache": false
            }
          ],
          "backoffSeconds": 1,
          "backoffFactor": 1.15,
          "maxLaunchDelaySeconds": 3600,
          "container": {
            "type": "DOCKER",
            "docker": {
              "image": "nginx:1.8.1",
              "network": "BRIDGE",
              "portMappings": [
                {
                  "hostPort": 0,
                  "containerPort": 80,
                  "protocol": "tcp",
                  "servicePort": 10000
                },
                {
                  "hostPort": 0,
                  "containerPort": 443,
                  "protocol": "tcp",
                  "servicePort": 10001
                }
              ],
              "privileged": false,
              "forcePullImage": false
            }
          },
          "healthChecks": [
            {
              "gracePeriodSeconds": 300,
              "intervalSeconds": 60,
              "timeoutSeconds": 20,
              "maxConsecutiveFailures": 3,
              "protocol": "COMMAND",
              "command": {
                "value": "service nginx status | grep -q 'nginx is running.'"
              }
            }
          ],
          "upgradeStrategy": {
            "minimumHealthCapacity": 1,
            "maximumOverCapacity": 1
          },
          "unreachableStrategy": {
            "inactiveAfterSeconds": 900,
            "expungeAfterSeconds": 604800
          },
          "killSelection": "youngest_first",
          "acceptedResourceRoles": [
            "*"
          ],
          "requirePorts": false,
          "labels": {
            "DCOS_PACKAGE_RELEASE": "1",
            "DCOS_SERVICE_SCHEME": "http",
            "DCOS_PACKAGE_SOURCE": "https://universe.mesosphere.com/repo",
            "DCOS_PACKAGE_METADATA": "eyJwYWNrYWdpbmdWZXJzaW9uIjoiMi4wIiwibmFtZSI6Im5naW54IiwidmVyc2lvbiI6IjEuOC4xIiwibWFpbnRhaW5lciI6InN1cHBvcnRAbmdpbnguY29tIiwiZGVzY3JpcHRpb24iOiJOZ2lueCBwYWNrYWdlIiwidGFncyI6WyJwcm94eSIsIndlYi1zZXJ2ZXIiLCJjYWNoZSJdLCJzY20iOiJodHRwOi8vaGcubmdpbngub3JnL25naW54LyIsInByZUluc3RhbGxOb3RlcyI6IlByZXBhcmluZyB0byBpbnN0YWxsIG5naW54LiIsInBvc3RJbnN0YWxsTm90ZXMiOiJOZ2lueCBoYXMgYmVlbiBpbnN0YWxsZWQuIiwicG9zdFVuaW5zdGFsbE5vdGVzIjoiTmdpbnggd2FzIHVuaW5zdGFsbGVkIHN1Y2Nlc3NmdWxseS4iLCJsaWNlbnNlcyI6W3sibmFtZSI6IkJTRCBsaWtlIiwidXJsIjoiaHR0cDovL25naW54Lm9yZy9MSUNFTlNFIn1dLCJpbWFnZXMiOnsiaWNvbi1zbWFsbCI6Imh0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81Njc3NzQ4NDQzMjI3MTM2MDAvdFlvVmp1MzEucG5nIiwiaWNvbi1tZWRpdW0iOiJodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTY3Nzc0ODQ0MzIyNzEzNjAwL3RZb1ZqdTMxLnBuZyIsImljb24tbGFyZ2UiOiJodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTY3Nzc0ODQ0MzIyNzEzNjAwL3RZb1ZqdTMxLnBuZyJ9fQ==",
            "DCOS_PACKAGE_REGISTRY_VERSION": "2.0",
            "DCOS_SERVICE_NAME": "nginx",
            "DCOS_SERVICE_PORT_INDEX": "0",
            "DCOS_PACKAGE_VERSION": "1.8.1",
            "DCOS_PACKAGE_NAME": "nginx",
            "DCOS_PACKAGE_IS_FRAMEWORK": "false"
          }
        }
        ```

        ![JSON view](/1.11/img/service-group15.png)

        Figure 10. View of JSON file


    1.  Click **REVIEW & RUN** and then **RUN SERVICE**.

1.  Repeat the previous steps for Nick. Be sure to specify `"id": "/prod-b/nginx",` for example:

    ```json
    {
      "id": "/prod-b/nginx",
      "cmd": "rm -rf /usr/share/nginx/html && ln -s /mnt/mesos/sandbox/hello-nginx-master/ /usr/share/nginx/html && nginx -g 'daemon off;'",
      "instances": 1,
      "cpus": 1,
      "mem": 1024,
      "disk": 0,
      "gpus": 0,
      "fetch": [
      ...
    }
    ```

1.  While logged in as Cory or Nick, click on the NGINX launch icon to view the confirmation message.

    ![NGINX](/1.11/img/service-group-nginx.png)

    Figure 11. Confirmation screen

Now we will look at the **Services** tab from the superuser view.


## Monitor user accounts in the DC/OS web interface as superuser

1.  Log out of the current user and then back in as a user with [superuser](/1.11/security/ent/perms-reference/#superuser) permission. You will see that both services are running in the prod-a and prod-b-groups.

    ![prod-a-group](/1.11/img/service-group14.png)

    Figure 12. Superuser view
