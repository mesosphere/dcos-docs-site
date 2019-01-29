---
layout: layout.pug
navigationTitle:  Permissions Reference
title: Permissions Reference
menuWeight: 40
excerpt: Understanding DC/OS access and permissions references

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can control DC/OS access by resource and operation. See [Permissions Management](/1.12/security/ent/perms-management/) for details on how to control permissions. This page provides a reference for each of the available DC/OS permissions.

# Enforcement

DC/OS permissions are enforced based on your security mode.

| Permission Category                                                        | Permissive   | Strict   |
| -----------------------------------------------------                      | :----------: | :------: |
| [Admin Router permissions](#admin-router) (`dcos:adminrouter`)             | x            | x        |
| [Mesos permissions](#mesos) (`dcos:mesos`)                                 |              | x        |
| [Marathon and Metronome permissions](#marathon-metronome) (`dcos:service`) | x            | x        |
| [Secret store permissions](#secrets) (`dcos:secrets`)                      | x            | x        |
| [Cluster linker permissions](#cluster-linker) (`dcos:cluster:linker`)      | x            | x        |
| [Superuser permissions](#superuser) (`dcos:superuser`)                     | x            | x        |

# Permissions

The available actions are `create`, `read`, `update`, `delete`, and `full`. By convention, `full` indicates that the permission supports all other action identifiers. The action `full` may include actions not supported by any other action identifier.

Many resource identifiers include optional sections in square brackets that may be filled in to further narrow the granted permission. If optional sections are omitted the resource identifier refers to all possible values. For example, the resource identifier `dcos:mesos:agent:framework:role` controls view access to DC/OS services registered with any [Mesos role](/1.12/overview/concepts/#mesos-role), whereas the resource identifier `dcos:mesos:agent:framework:role:slave_public` controls view access to DC/OS services registered with the role `slave_public`.

Most HTTP requests sent to DC/OS components require authentication proof. These
include operations launched by the DC/OS CLI, the DC/OS UI, the DC/OS API and
internally between DC/OS components. HTTP requests to some endpoints require
additional authorization. Many DC/OS components are issued with DC/OS service
account users and are individually granted necessary permissions when the
cluster is first installed.

There are several components of DC/OS that perform authorization of requests,
for example, Admin Router, Mesos, Marathon, and so forth. They are called **authorizers** in this
context. All the authorizers follow the DC/OS authorization procedure. A
high-level description of the DC/OS authorization procedure follows.

When a HTTP request to a protected resource is received by an authorizer, the
authorizer inspects the `Authorization` HTTP request header to obtain the DC/OS
authentication token. The DC/OS authentication token is validated and evaluated
by the authorizer. After the `uid` is extracted from the DC/OS authentication
token, the authorizer checks that the corresponding DC/OS user has been granted
the necessary privilege to perform the requested operation. For example, the
DC/OS user identified by `uid` must have `full` access to the protected
resource `dcos:adminrouter:package` in order to be able to access the DC/OS
package API through Admin Router.


## <a name="admin-router"></a>Admin Router permissions

#include /include/permissions-inheritance-disclaimer.tmpl


Most HTTP requests made to a DC/OS cluster pass through Admin Router. For many
HTTP endpoints the Admin Router performs authorization itself. For example, the DC/OS
user identified by `uid` must have `full` access to the protected resource
`dcos:adminrouter:package` in order to be able to access the DC/OS package API
through Admin Router.

| Resource identifier                                                                                                                                                                                                                                                                                     | full   | C   | R   | U   | D   |
| -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                     | ------ | --- | --- | --- | --- |
| `dcos:adminrouter:acs`<br>Controls access to the security and access management features.                                                                                                                                                                                                               | x      |     |     |     |     |
| `dcos:adminrouter:ops:ca:ro`<br>Controls access to the read-only endpoints of the [Certificate Authority API](/1.12/security/ent/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [Enterprise DC/OS CLI](/1.12/cli/enterprise-cli/).                                                 | x      |     |     |     |     |
| `dcos:adminrouter:ops:ca:rw`<br>Controls user access to all endpoints of the [Certificate Authority API](/1.12/security/ent/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [Enterprise DC/OS CLI](/1.12/cli/enterprise-cli/).                                                      | x      |     |     |     |     |
| `dcos:adminrouter:ops:cockroachdb`<br> Controls access to the [CockroachDB UI](https://www.cockroachlabs.com/docs/v1.1/admin-ui-overview-dashboard.html).                                                                                                                                               | x      |     |     |     |     |
| `dcos:adminrouter:ops:exhibitor`<br> Controls access to the Exhibitor UI and API. This permission allows users to [remove the ZooKeeper state](/1.12/deploying-services/uninstall/#framework-cleaner) after uninstalling a service.                                                                     | x      |     |     |     |     |
| `dcos:adminrouter:ops:historyservice`<br>Controls access to the [History Service](/1.12/overview/architecture/components/#dcos-history). This includes access to potentially sensitive data from Mesos such as the names of all frameworks, its used resources, and the number of tasks in each status. | x      |     |     |     |     |
| `dcos:adminrouter:ops:mesos-dns`<br> Controls access to the [Mesos DNS API](/1.12/networking/mesos-dns/mesos-dns-api/).                                                                                                                                                                                 | x      |     |     |     |     |
| `dcos:adminrouter:ops:mesos`<br> Controls access to the Mesos master UI and API.                                                                                                                                                                                                                        | x      |     |     |     |     |
| `dcos:adminrouter:ops:metadata` <br>Controls access to the [Metadata endpoint](/1.12/api/master-routes/#metadata).                                                                                                                                                                                      | x      |     |     |     |     |
| `dcos:adminrouter:ops:networking`<br> Controls access to [Network Metrics](/1.12/api/master-routes/#network-metrics) endpoint.                                                                                                                                                                          | x      |     |     |     |     |
| `dcos:adminrouter:ops:slave`<br>Controls access to the Mesos agent UI and API.                                                                                                                                                                                                                          | x      |     |     |     |     |
| `dcos:adminrouter:ops:system-health` <br>Controls access to the [System health API](/1.12/api/master-routes/#system).                                                                                                                                                                                   | x      |     |     |     |     |
| `dcos:adminrouter:ops:system-logs` <br>Controls access to [System logs API](/1.12/api/master-routes/#system).                                                                                                                                                                                           | x      |     |     |     |     |
| `dcos:adminrouter:ops:system-metrics`<br> Controls access to [System metrics API](/1.12/api/master-routes/#system).                                                                                                                                                                                     | x      |     |     |     |     |
| `dcos:adminrouter:licensing` <br> Controls access to the Licensing API.                                                                                                                                                                                                                                 | x      |     |     |     |     |
| `dcos:adminrouter:package` <br> Controls access to the [Cosmos API](/1.12/api/master-routes/#cosmos), which provides access to the DC/OS Universe.                                                                                                                                                      | x      |     |     |     |     |
| `dcos:adminrouter:service[:<group-name>]/<service-name>`<br> Controls access the UI and API of an installed DC/OS service.                                                                                                                                                                              | x      |     |     |     |     |
| `dcos:adminrouter:service:marathon` <br>Controls access to the native Marathon instance.                                                                                                                                                                                                                | x      |     |     |     |     |
| `dcos:adminrouter:service:metronome`<br>  Controls access to [DC/OS Jobs (Metronome)](/1.12/deploying-jobs/).                                                                                                                                                                                           | x      |     |     |     |     |

## <a name="mesos"></a>Mesos permissions

Many Mesos operations require authorization.
The necessary privileges must be assigned to the DC/OS user who issues the HTTP request to Mesos.
This is not always the same DC/OS user who is logged into the UI or CLI.
For example, when Alice uses the UI to create a Marathon application, Marathon performs
authorization of the HTTP request and checks that the `alice` DC/OS user has
`create` access to the `dcos:service:marathon:marathon:services:/` resource.
If so, it uses **its own** DC/OS user, a DC/OS service account with a `uid` of `dcos_marathon`, to authenticate an HTTP request to Mesos with instruction to launch the new Mesos tasks.
At that point, Mesos will perform the DC/OS authorization procedure and check that the `dcos_marathon` DC/OS user has been granted the `create` action on the `dcos:mesos:master:task:app_id` resource.

Applications launched with Root Marathon can only receive offers for resources reserved for the `slave_public` or `*` [Mesos roles](/1.12/overview/concepts/#mesos-role).

| Resource identifier                                                                                                                                                                                                                                                                 | full   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:mesos:agent:container:app_id[:<service-or-job-group>]`<br> Controls access to the [debugging](/1.12/monitoring/debugging/debug-perms/) features for a specific service or job.                                                                                                |        |     |     | x   |     |
| `dcos:mesos:agent:container:role[:<role-name>]`<br>Controls access to the [debugging](/1.12/monitoring/debugging/debug-perms/) features for the given [Mesos role](/1.12/overview/concepts/#mesos-role).                                                                            |        |     |     | x   |     |
| `dcos:mesos:agent:endpoint:path[:<endpoint>]`<br> Controls access to unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/).                                                                                                                   |        |     | x   |     |     |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br> Controls view access to service and job [executor information](https://mesos.apache.org/documentation/latest/app-framework-development-guide/).                                                                     |        |     | x   |     |     |
| `dcos:mesos:agent:flags`<br> Controls view access to [agent flag](https://mesos.apache.org/documentation/latest/slave/flags/) configurations.                                                                                                                                       |        |     | x   |     |     |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br> Controls view access to DC/OS services registered with the given [Mesos role](/1.12/overview/concepts/#mesos-role).                                                                                                             |        |     | x   |     |     |
| `dcos:mesos:agent:log`<br>Controls access to the [agent logs](/1.12/monitoring/logging/).                                                                                                                                                                                           |        |     | x   |     |     |
| `dcos:mesos:agent:nested_container_session:app_id[:<service-or-job-group>]`<br> Controls access, by service or job group, to launching a container within a container of a service or job while [debugging](/1.12/monitoring/debugging/).                                           |        | x   |     |     |     |
| `dcos:mesos:agent:nested_container_session:role[:<role-name>]`<br> Controls access, by [Mesos role](/1.12/overview/concepts/#mesos-role), to launching a container within a container of a service or job while [debugging](/1.12/monitoring/debugging/).                           |        | x   |     |     |     |
| `dcos:mesos:agent:nested_container_session:user[:<linux-user-name>]`<br> Controls access, by Linux user, to launching a container within a container of a service or job while [debugging](/1.12/monitoring/debugging/). The users of both nested containers must be the same.      |        | x   |     |     |     |
| `dcos:mesos:agent:resource_provider`<br> Controls view access to per-agent resource provider information.                                                                                                                                                                           |        |     | x   |     |     |
| `dcos:mesos:agent:resource_provider_config`<br> Controls access to changes of per-agent resource provider configurations.                                                                                                                                                           |        | x   |     | x   | x   |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br> Controls access to the Mesos sandbox.                                                                                                                                                                                |        |     | x   |     |     |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br> Controls access to task information.                                                                                                                                                                                    |        |     | x   |     |     |
| `dcos:mesos:master:block_disk`<br> Controls access to create and destroy block disks.                                                                                                                                                                                               |        | x   |     |     | x   |
| `dcos:mesos:master:endpoint:path[:<path>]`<br> Controls access to these unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/): `logging/toggle`, `/metrics/snapshot`, and `/files/debug`.                                                     |        |     | x   |     |     |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br> Controls access to [executor](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) service and job groups.                                                                              |        |     | x   |     |     |
| `dcos:mesos:master:flags`<br> Controls view access to [master flag](https://mesos.apache.org/documentation/latest/endpoints/master/flags/) configurations.                                                                                                                          |        |     | x   |     |     |
| `dcos:mesos:master:framework:principal[:<service-account-id>]`<br> Controls access, by service account ID, to the Mesos [tear down](https://mesos.apache.org/documentation/latest/endpoints/master/teardown/) endpoint, which allows you to uninstall a DC/OS service.              |        |     |     |     | x   |
| `dcos:mesos:master:framework:role[:<role-name>]` <br> Controls access, by [Mesos role](/1.12/overview/concepts/#mesos-role), to register as a framework with [Mesos](https://mesos.apache.org/documentation/latest/roles/).                                                         |        | x   |     |     |     |
| `dcos:mesos:master:log`<br> Controls access to the Mesos [master logs](/1.12/monitoring/logging/).                                                                                                                                                                                  |        |     | x   |     |     |
| `dcos:mesos:master:mount_disk`<br> Controls access to create and destroy mount disks.                                                                                                                                                                                               |        | x   |     |     | x   |
| `dcos:mesos:master:quota:role[:<role-name>]` <br> Controls access, by [Mesos role](/1.12/overview/concepts/#mesos-role), to the [resource quota](https://mesos.apache.org/documentation/latest/quota/).                                                                             |        |     | x   | x   |     |
| `dcos:mesos:master:reservation:principal[:<service-account-id>]`<br> Controls access, by user or service account, to unreserve [resources](https://mesos.apache.org/documentation/latest/reservation/).                                                                             |        |     |     |     | x   |
| `dcos:mesos:master:reservation:role[:<role-name>]`<br> Controls access, by [Mesos role](/1.12/overview/concepts/#mesos-role), to reserve [resources](https://mesos.apache.org/documentation/latest/reservation/).                                                                   |        | x   |     |     |     |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br> Controls access to run tasks.                                                                                                                                                                                          |        | x   |     |     |     |
| `dcos:mesos:master:task:user[:<linux-user-name>]`<br> Controls access to run tasks as a specific Linux user.                                                                                                                                                                        |        | x   |     |     |     |
| `dcos:mesos:master:volume:principal[:<service-account-id>]`<br> Controls access to destroy a volume.                                                                                                                                                                                |        |     |     |     | x   |
| `dcos:mesos:master:volume:role[:<role-name>]`<br> Controls access to create a volume for the given [Mesos role](/1.12/overview/concepts/#mesos-role).                                                                                                                               |        | x   |     |     |     |
| `dcos:mesos:master:weight:role[:<role-name>]`<br> Control access to the [weight](https://mesos.apache.org/documentation/latest/weights/) for the given [Mesos role](/1.12/overview/concepts/#mesos-role).                                                                           |        |     | x   | x   |     |

## <a name="marathon-metronome"></a>Marathon and Metronome permissions

Marathon and Metronome require that HTTP requests made to certain protected resources must be authorized. For example, a DC/OS user must be granted the `create` action on the `dcos:service:marathon:marathon:services:/dev` resource in order to create a new Marathon app in the `/dev` service group.

| Resource identifier                                                                                                                                                                                                                                                                 | full   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:service:marathon:marathon:admin:config`<br>  Controls access to the [GET /v2/info Marathon endpoint](/1.12/deploying-services/marathon-api/#/info/).                                                                                                                           |        |     | x   |     |     |
| `dcos:service:marathon:marathon:admin:events` <br>Controls view access to the Marathon events endpoint [GET /v2/events](/1.12/deploying-services/marathon-api/#/events/).                                                                                                            | x      |     | x   |     |     |
| `dcos:service:marathon:marathon:admin:leader` <br> Controls access to the [GET/DELETE /v2/leader](/1.12/deploying-services/marathon-api/#/leader/) endpoint.                                                                                                                         | x      |     | x   | x   |     |
| `dcos:service:marathon:marathon:services:/[<service-group>]` <br> Controls access to [DC/OS services](/1.12/deploying-services/) launched by the native Marathon instance. <br> [POST /v2/group](/1.12/deploying-services/marathon-api/#/groups/) requires the `full` action.         | x      | x   | x   | x   | x   |
| `dcos:service:metronome:metronome:jobs[:<job-group>]`<br>  Controls access to [jobs and job groups](/1.12/deploying-jobs/).                                                                                                                                                         | x      | x   | x   | x   | x   |


## <a name="secrets"></a>Secret Store permissions

These permissions control access to the [Secrets API](/1.12/security/ent/secrets/secrets-api/). A Mesos framework must have
permission granted to its DC/OS service account in order to access a given secret. If you are looking for information on how to launch
Marathon applications using secrets see [Configuring services and pods to use secrets](/1.12/security/ent/secrets/use-secrets/).

| Resource identifier                                                                                                                                                                                                                                                                 | full   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:secrets:default:[/<path-name>/]<secret-name>`<br> Controls access to individual [secrets](/1.12/security/ent/secrets/).                                                                                                                                                       | x      | x   | x   | x   | x   |
| `dcos:secrets:list:default:/[<path>]`<br> Controls view access to the names of [secrets](/1.12/security/ent/secrets/).                                                                                                                                                              |        |     | x   |     |     |

## <a name="cluster-linker"></a> Cluster Linker permissions

A DC/OS user requires permission to link clusters.

| Resource identifier                                                                                                                                                                                                                                                                 | full   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:cluster:linker:<cluster-id>`<br> Controls access to individual [cluster links](/1.12/administering-clusters/multiple-clusters/cluster-links/).                                                                                                                                |        |     | x   |     |     |
| `dcos:cluster:linker:*`<br> Controls access to [cluster links](/1.12/administering-clusters/multiple-clusters/cluster-links/).                                                                                                                                                      |        | x   | x   | x   | x   |


## <a name="superuser"></a>Superuser permissions

Similar to the Windows `Administrator` or Linux `root` accounts, DC/OS has the
concept of the `superuser`. A user with at least one permission out of `create`, `read`, `update`, `delete` or `full` on the `dcos:superuser` resource has complete, unrestricted access to any operation
throughout DC/OS. This is extremely powerful and this permission should be
granted sparingly.

| Resource identifier                                                                                                                                                                                                                                                                 | full   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:superuser`<br> Controls complete access to the DC/OS cluster.                                                                                                                                                                                                                 | x      | x   | x   | x   | x   |
