---
layout: layout.pug
navigationTitle:  Granting Access to dcos task exec
title: Granting Access to dcos task exec
menuWeight: 4
excerpt: Granting access for debugging
beta: true
enterprise: true
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

You can grant users access to containers for debugging sessions.  

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.
- A [user account](/1.13/security/ent/users-groups/) to assign permissions to

All CLI commands can also be executed via the [IAM API](/1.13/security/ent/iam-api/). You can see more detail about the `dcos security org users` commands in the [CLI Command Reference section](/1.13/cli/command-reference/dcos-security/).

## Permissive

Grant the following privileges to the user `uid`.

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
```

## Strict
With `strict` security mode, you can control whether a user can launch an interactive debugging session or not. You can also restrict which containers a user can access for debugging. This ensures that users cannot execute arbitrary commands in containers that do not pertain to them.

### <a name="debug-without-tty"></a>Granting non-pseudo terminal debug access

Grant the following privileges to the user `uid`.

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:container:app_id:/test-group read --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <uid> dcos:mesos:agent:nested_container_session:app_id:/test-group create --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/test-group read --description "Controls access to executors running inside test-group"
dcos security org users grant <uid> dcos:mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/test-group read --description "Controls access to tasks running inside test-group"
```   

### <a name="debug-with-tty"></a>Granting pseudo terminal debug access

Grant the following privileges to the user `uid`.

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:container:app_id:/test-group read --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <uid> dcos:mesos:agent:container:app_id:/test-group update
dcos security org users grant <uid> dcos:mesos:agent:nested_container_session:app_id:/test-group create --description "Grants a user permission to launch a container inside a container in test-group."
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/test-group read --description "Controls access to executors running inside test-group"
dcos security org users grant <uid> dcos:mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/test-group read --description "Controls access to tasks running inside test-group"
```
