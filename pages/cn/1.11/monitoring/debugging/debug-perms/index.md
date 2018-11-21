---
layout: layout.pug
navigationTitle: 授予 dcos 任务执行的访问权限
title: 授予 dcos 任务执行的访问权限
menuWeight: 4
excerpt: 授予调试的访问权限
beta: true
enterprise: true
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

您可以授予用户访问容器以进行调试会话的权限。

**前提条件：**

- 您必须[安装 DC/OS CLI](/cn/1.11/cli/install/) 并以超级用户身份登录。
- [用户帐户](/cn/1.11/security/ent/users-groups/) 将权限分配给

所有 CLI 命令也可通过 [IAM API](/cn/1.11/security/ent/iam-api/) 执行。您可以在 [CLI 命令参考部分](cn/1.11/cli/command-reference/dcos-security/) 看到更多有关 `dcos security org users` 命令的详细信息。

## 禁用

向用户授予以下权限 `uid`。

```bash
 dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
 dcos security org users grant <uid> dcos:adminrouter:ops:slave full
 ```

## 宽容

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
```

## 严格
使用 `strict` 安全模式，您可以控制用户是否可以启动交互式调试会话。您也可以限制用户可以访问哪些容器进行调试。这可以确保用户无法在不与其相关的容器中执行任意命令。

### <a name="debug-without-tty"></a>授予非伪终端调试访问权限

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:container:app_id:/test-group read --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <uid> dcos:mesos:agent:nested_container_session:app_id:/test-group create --description "Grants a user permission to attach to the input of any process running inside of a container in test-group."
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/test-group read --description "Controls access to executors running inside test-group"
dcos security org users grant <uid> dcos:mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/test-group read --description "Controls access to tasks running inside test-group"
```   

### <a name="debug-with-tty"></a>授予伪终端调试访问权限

向用户授予以下权限 `uid`。

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
