---
layout: layout.pug
navigationTitle:  Deploying Services Using a Custom Marathon Instance
title: Deploying Services Using a Custom Marathon Instance
menuWeight: 39
excerpt: Using a basic, non-native instance of Marathon
enterprise: true
---

This topic describes how to deploy a non-native instance of Marathon with isolated roles, reservations, and quotas. This  procedure does not support [secrets](/1.12/security/ent/secrets/) or fine-grained ACLs. If you require these features, you must use the custom non-native Marathon [procedure](/1.12/deploying-services/marathon-on-marathon/advanced/).

**Prerequisites:**

-  DC/OS and DC/OS CLI [installed](/1.12/installing/).
-  [DC/OS Enterprise CLI 0.4.14 or later](/1.12/cli/enterprise-cli/#ent-cli-install).
-  You must be logged in as a superuser.
-  SSH access to the cluster.

# Step 1 - Reserve Resources
In this step, Mesos resources are reserved. Choose the procedure for either [static](#static-reservations) or [dynamic](#dynamic-reservations) reservations.

## Static Reservations

<p class="message--warning"><strong>WARNING: </strong> This procedure kills all running tasks on your node.</p> 
</tr> 
</table>


1.  [SSH](/1.12/administering-clusters/sshcluster/) to your private agent node.

   ```bash
   dcos node ssh --master-proxy --mesos-id=<agent-id>
   ```

1.  Navigate to `/var/lib/dcos` and create a file named `mesos-slave-common` with these contents, where `<myrole>` is the name of your role.
    ```bash
    MESOS_DEFAULT_ROLE='<myrole>'
    ```
1.  Stop the private agent node:
    ```bash
    sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
    ```
1.  Add the node back to your cluster.
    1.  Reload the `systemd` configuration.
        ```bash
        ﻿⁠⁠sudo systemctl daemon-reload
        ```
    1.  Remove the `latest` metadata pointer on the agent node:
        ```bash
        ⁠⁠⁠⁠sudo rm /var/lib/mesos/slave/meta/slaves/latest
        ```
    1.  Start your agents with the newly configured attributes and resource specification⁠⁠.
        ```bash
        sudo systemctl start dcos-mesos-slave
        ```

        You can check the status with this command:

        ```bash
        sudo systemctl status dcos-mesos-slave
        ```

1.  Repeat these steps for each additional node.

## Dynamic Reservations
Reserve resources for your non-native Marathon instance with the Mesos ID (`<mesos-id>`), user ID (`<userid>`), role (`<myrole>`), and ports (`<begin-port>` and `<end-port>`) specified.

```bash
curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{
  "type": "RESERVE_RESOURCES",
  "reserve_resources": {
    "agent_id": {
      "value": "<mesos-id>"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 1.0
        }
      },
      {
        "type": "SCALAR",
        "name": "mem",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "ranges": {
          "range": [
            {
              "begin": <begin-port>,
              "end": <end-port>
            }
          ]
        }
      }
    ]
  }
}' \
      -X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

# Step 2 - Install a Non-Native Marathon Instance with Assigned Role
In this step, a non-native Marathon instance is installed on DC/OS with the Mesos role assigned.

1.  Create a custom JSON config file and save as `marathon-config.json`. This file is used to install the custom non-native Marathon instance.
    ```json
    {"marathon": {
     "mesos-role": "<myrole>",
     "role": "<myrole>",
     "default-accepted-resource-roles": "*,<myrole>"
     }
    }
     ```        
1.  Install the Marathon package from Universe with the custom JSON configuration specified (`marathon-config.json`).
    ```bash
    dcos package install --options=marathon-config.json marathon
    ```
# Step 3 - Create a Marathon Service Account
In this step, a Marathon Service Account is created. Depending on your [security mode](/1.12/security/ent/#security-modes), a Marathon Service Account is either optional or required.

| Security Mode | Marathon Service Account |
|---------------|----------------------|
| Permissive | Optional |
| Strict | Required |

1.  Create a 2048-bit RSA public-private key pair (`<private-key>.pem` and `<public-key>.pem`) and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
    ```

1.  Create a new service account called `<service-account-id>`, with the public key specified (`<public-key>.pem`).

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d "Non-native Marathon service account" <service-account-id>
    ```

# Step 4 - Assign Permissions (Strict mode only)
In this step, permissions are assigned to the Marathon-on-Marathon instance. Permissions are required in strict mode and are ignored in permissive security mode.

All CLI commands can also be executed via the [IAM API](/1.12/security/ent/iam-api/).

| Security Mode | Permissions |
|---------------|----------------------|
| Permissive | Not available |
| Strict | Required |


Grant the permission for user `<uid>` to launch Mesos tasks that will execute as Linux user `nobody`.
To allow executing tasks as a different Linux user, replace `nobody` with that user's Linux user ID. For example, to launch tasks as Linux user `bob`, replace `nobody` with `bob` below.
Note that the `nobody` and `root` users exist on all agents by default, but if a custom `bob` user is specified it must have been manually created (using the `adduser` or similar utility) on every agent that tasks can be executed on.

```bash
dcos security org users grant <uid> dcos:mesos:master:task:user:nobody create --description "Tasks can execute as Linux user nobody"
dcos security org users grant <uid> dcos:mesos:master:framework:role:<myrole> create --description "Controls the ability of <myrole> to register as a framework with the Mesos master"
dcos security org users grant <uid> dcos:mesos:master:reservation:role:<myrole> create --description "Controls the ability of <myrole> to reserve resources"
dcos security org users grant <uid> dcos:mesos:master:volume:role:<myrole> create --description "Controls the ability of <myrole> to access volumes"
dcos security org users grant <uid> dcos:mesos:master:reservation:principal:<uid> delete --description "Controls the ability of <uid> to reserve resources"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/ create--description "Controls the ability to launch tasks"
dcos security org users grant <uid> dcos:mesos:master:volume:principal:<uid> delete --description "Controls the ability of <uid> to access volumes"
```

# Step 5 - Grant User Access to Non-Native Marathon
In this step, a user is granted access to the non-native Marathon instance.

1. Log in to the DC/OS web interface as a user with the `superuser` permission.

   ![Login](/1.12/img/LOGIN-EE-Modal_View-1_12.png)

   Figure 1. DC/OS web interface login screen.

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.12/img/GUI-Organization-Users-List_View-1_12.png)

    Figure 2. Select user or group permission

1.  From the **Permissions** tab click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

    Figure 3. Add permissions.

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.12/security/ent/#security-modes).

    ### Permissive

    -  **Full access**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```

    -  **Access to an individual service or group**

       Specify the service or group (`<service-or-group>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`.

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```

    ### Strict

    -  **Full access**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:mesos:agent:executor:app_id:/ read
        dcos:mesos:agent:framework:role:<myrole> read
        dcos:mesos:agent:sandbox:app_id:/ read
        dcos:mesos:agent:task:app_id:/ read
        dcos:mesos:master:executor:app_id:/ read
        dcos:mesos:master:framework:role:<myrole> read
        dcos:mesos:master:task:app_id:/ read
        ```  

    -  **Access to an individual service or group**

       Specify the service or group (`<service-or-group>`), service name (`<service-name>`), role (`<myrole>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`.

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<service-or-group> read
       dcos:mesos:agent:framework:role:<myrole> read
       dcos:mesos:agent:sandbox:app_id:/<service-or-group> read
       dcos:mesos:agent:task:app_id:/<service-or-group> read
       dcos:mesos:master:executor:app_id:/<service-or-group> read
       dcos:mesos:master:framework:role:<myrole> read
       dcos:mesos:master:task:app_id:/<service-or-group> read
       ```

1.  Click **ADD PERMISSIONS** and then **Close**.

# Step 6 - Access the Non-Native Marathon Instance
In this step, you log in as a authorized user to the non-native Marathon DC/OS service.

1.  Launch the non-native Marathon interface at: `http://<master-public-ip>/service/<service-name>/`.

1.  Enter your username and password and click **LOG IN**.

    ![Log in DC/OS](/1.12/img/LOGIN-EE-Modal_View-1_12.png)

    Figure 4. DC/OS log in screen

    You are done!

    ![Marathon on Marathon](/1.12/img/mom-marathon-gui.png)

    Figure 5. Success screen.
