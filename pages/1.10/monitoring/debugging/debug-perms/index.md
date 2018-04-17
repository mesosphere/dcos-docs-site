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

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.
- A [user account](/1.10/security/ent/users-groups/) to assign permissions to.

All CLI commands can also be executed via the [IAM API](/1.10/security/ent/iam-api/).

## Disabled

Grant the permission to a user (`<user-name>`).

```bash
 dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Controls access to task details"
 dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Controls access to task details such as logs"
 ```

## Permissive

Grant the permission to a user (`<user-name>`).

```bash
dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Controls access to task details"
dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Controls access to task details such as logs"
```

## Strict
With `strict` security mode, you can control whether a user can launch an interactive debugging session or not. You can also restrict which containers a user can access for debugging. This ensures that users cannot execute arbitrary commands in containers that do not pertain to them. 

### <a name="debug-without-tty"></a>Granting Non-Pseudo Terminal Debug Access

Grant the permission to a user (`<user-name>`).
    
```bash
dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Controls access to task details"
dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Controls access to task details such as logs"
dcos security org users grant <user-name> dcos:mesos:agent:container:app_id:/test-group read --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <user-name> dcos:mesos:agent:nested_container_session:app_id:/test-group create --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <user-name> dcos:mesos:master:executor:app_id:/test-group read --description "Controls access to executors running inside test-group"
dcos security org users grant <user-name> dcos:mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <user-name> dcos:mesos:master:task:app_id:/test-group read --description "Controls access to tasks running inside test-group"
```   
    
### <a name="debug-with-tty"></a>Granting Pseudo Terminal Debug Access

Grant the permission to a user (`<user-name>`).

```bash
dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Controls access to task details"
dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Controls access to task details such as logs"
dcos security org users grant <user-name> dcos:mesos:agent:container:app_id:/test-group read --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <user-name> dcos:mesos:agent:container:app_id:/test-group update
dcos security org users grant <user-name> dcos:mesos:agent:nested_container_session:app_id:/test-group create --description "Grants a user permission to launch a container inside a container in test-group."
dcos security org users grant <user-name> dcos:mesos:master:executor:app_id:/test-group read --description "Controls access to executors running inside test-group"
dcos security org users grant <user-name> dcos:mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <user-name> dcos:mesos:master:task:app_id:/test-group read --description "Controls access to tasks running inside test-group"
```
