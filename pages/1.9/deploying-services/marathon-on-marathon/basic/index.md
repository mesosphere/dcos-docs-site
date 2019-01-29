---
layout: layout.pug
navigationTitle:  >
title: >
  Deploying Services Using a Custom
  Marathon
menuWeight: 39
excerpt:
preview: true
enterprise: true
---

This topic describes how to deploy a non-native instance of Marathon with isolated roles, reservations, and quotas. 

The basic procedure does not support [secrets](/1.9/security/ent/secrets/) or fine-grained ACLs. If you require these features, you must use the custom non-native Marathon [procedure](/1.9/deploying-services/marathon-on-marathon/advanced/).

**Prerequisites:**

-  DC/OS and DC/OS CLI [installed](/1.9/installing/).
-  [DC/OS Enterprise CLI 0.4.14 or later](/1.9/cli/enterprise-cli/#ent-cli-install).
-  You must be logged in as a superuser.
-  SSH access to the cluster.

# Step 1 - Reserve Resources
In this step, Mesos resources are reserved. Choose the procedure for either [static](#static-reservations) or [dynamic](#dynamic-reservations) reservations.

## Static Reservations
<p class="message--warning"><strong>WARNING: </strong>This procedure kills all running tasks on your node.</p>

1.  [SSH](/1.9/administering-clusters/sshcluster/) to your private agent node.
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
    1.  Reload the systemd configuration.
    
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
In this step, a Marathon Service Account is created. Depending on your [security mode](/1.9/security/ent/#security-modes), a Marathon Service Account is either optional or required. 

| Security Mode | Marathon Service Account |
|---------------|----------------------|
| Disabled | Optional |
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
In this step, permissions are assigned to the Marathon-on-Marathon instance. Permissions are required in strict mode and are ignored in other security modes. 

| Security Mode | Permissions |
|---------------|----------------------|
| Disabled | Not available |
| Permissive | Not available |
| Strict | Required |

The forward-slash (`/`) characters are replaced with `%252F` in the commands. 

**Prerequisite:** You must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

1.  Create the permission for user (`<user-name>`) with the `nobody` Linux user account specified. To use a different user account, replace `nobody` with the name of the user account. 

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody -d '{"description":"Allows Linux user nobody to execute tasks"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:<myrole> -d '{"description":"Controls the ability of <myrole> to register as a framework with the Mesos master"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:<myrole> -d '{"description":"Controls the ability of <myrole> to reserve resources"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:<myrole> -d '{"description":"Controls the ability of <myrole> to access volumes"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<user-name> -d '{"description":"Controls the ability of <user-name> to reserve resources"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F -d '{"description":"Controls the ability to launch tasks"}' -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<user-name> -d '{"description":"Controls the ability of <user-name> to access volumes"}' -H 'Content-Type: application/json'
    ```
    
1.  Grant the permission to user (`<user-name>`) with role specified (`<myrole>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:<myrole>/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:<myrole>/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:<myrole>/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<user-name>/users/<user-name>/delete
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<user-name>/users/<user-name>/delete
    ```

# Step 5 - Grant User Access to Non-Native Marathon
In this step, a user is granted access to the non-native Marathon instance.

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.9/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.9/img/services-tab-user.png)

1.  From the **Permissions** tab click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.9/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.9/security/ent/#security-modes).

    ### Disabled
    
    -   Full access
    
        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```
        
    -  Access to an individual service or group is not supported in disabled security mode.
    
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

    ![Log in DC/OS](/1.9/img/gui-installer-login-ee.gif)
    
    You are done!
    
    ![Marathon on Marathon](/1.9/img/mom-marathon-gui.png)
