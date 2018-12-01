---
layout: layout.pug
navigationTitle:  Granting Access to dcos task exec
title: Granting Access to dcos task exec
menuWeight: 4
excerpt:
preview: true
enterprise: true
---

You can grant users access to containers for debugging sessions.  

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- A [user account](/1.9/security/ent/users-groups/) to assign permissions to.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command. 
- When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

## Disabled

1.  Create the permission.

    ```bash
    curl -X PUT -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Controls access to task details"}'
    curl -X PUT -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Controls access to task details such as logs"}'
    ```  

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
    ```

## Permissive

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Controls access to task details"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Controls access to task details such as logs"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
    ```

## Strict
With `strict` security mode, you can control whether a user can launch an interactive debugging session or not. You can also restrict which containers a user can access for debugging. This ensures that users cannot execute arbitrary commands in containers that do not pertain to them. 

### <a name="debug-without-tty"></a>Granting Non-Pseudo Terminal Debug Access

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Controls access to task details"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Controls access to task details such as logs"
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:container:app_id:%252Ftest-group \
    -d '{"description":"Grants a user permission to attach to the input of any process running inside of a container in test-group."}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:nested_container_session:app_id:%252Ftest-group \
    -d '{"description":"Grants a user permission to launch a container inside a container in test-group."}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Ftest-group \
    -d '{"description":"Controls access to executors running inside test-group"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* \
    -d '{"description":"Controls access to frameworks registered with the Mesos default role"}' 
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Ftest-group \
    -d '{"description":"Controls access to tasks running inside test-group"}'
    ```

1.  Grant the permission to a user (`<user-name>`).
    
    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:container:app_id:%252Ftest-group/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:nested_container_session:app_id:%252Ftest-group/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Ftest-group/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Ftest-group/users/<user-name>/read
    ```   
    
### <a name="debug-with-tty"></a>Granting Pseudo Terminal Debug Access

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Controls access to task details"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Controls access to task details such as logs"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:container:app_id:%252Ftest-group \
    -d '{"description":"Grants a user permission to attach to the input of any process running inside of a container in test-group."}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:nested_container_session:app_id:%252Ftest-group \
    -d '{"description":"Grants a user permission to launch a container inside a container in test-group."}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Ftest-group \
    -d '{"description":"Controls access to executors running inside test-group"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* \
    -d '{"description":"Controls access to frameworks registered with the Mesos default role"}' 
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Ftest-group \
    -d '{"description":"Controls access to tasks running inside test-group"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:container:app_id:%252Ftest-group/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:container:app_id:%252Ftest-group/users/<user-name>/update
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:nested_container_session:app_id:%252Ftest-group/users/<user-name>/create
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Ftest-group/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<user-name>/read
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Ftest-group/users/<user-name>/read
    ```
