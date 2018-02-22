---
layout: layout.pug
navigationTitle:  Permissions Reference
title: Permissions Reference
menuWeight: 40
excerpt:

enterprise: true
---

You can control DC/OS access by resource and operation.
See [Permissions Management](/1.10/security/ent/perms-management/) for details how to control permissions.

This topic provides a reference for each of the available DC/OS permissions.


# Enforcement
The DC/OS permissions are enforced based on your security mode.

| Permission Category                                 | Disabled | Permissive | Strict |
|-----------------------------------------------------|:--------:|:----------:|:------:|
| [Admin Router permissions](#admin-router) (`dcos:adminrouter`)       |     x    |      x     |    x   |
| [Mesos permissions](#mesos) (`dcos:mesos`)                    |          |            |    x   |
| [Marathon and Metronome permissions](#marathon-metronome) (`dcos:service`) |          |      x     |    x   |
| [Secret store permissions](#secrets) (`dcos:secrets`)           |     x    |      x     |    x   |
| [Superuser permissions](#superuser) (`dcos:superuser`)            |     x    |      x     |    x   |

# Permissions

The available actions are `create`, `read`, `update`, `delete`, and `full`.
By convention, `full` indicates that the permission supports all other action identifiers.
`full` may include actions not supported by any other action identifier.

Many resource identifiers include optional sections in square brackets that may be filled in to further narrow the granted permission.
If optional sections are omitted the resource identifier refers to all possible values.
For example, the resource identifier `dcos:mesos:agent:framework:role` controls view access to DC/OS services registered with any [Mesos role](/1.10/overview/concepts/#mesos-role), whereas the resource identifier `dcos:mesos:agent:framework:role:slave_public` controls view access to DC/OS services registered with the role `slave_public`.

## <a name="admin-router"></a>Admin Router Permissions

In each of these cases the principal is the client performing the HTTP
request. The principal is authenticated using the DC/OS Authentication Token it
presents in the `Authorization` HTTP header. Once authenticated, Admin Router
checks that the principal has been assigned the necessary permission to perform
the action (e.g., `full`) on the resource (e.g., `dcos:adminrouter:acs`).

|                                                                                                                                 Resource identifier                                                                                                                                 | full | C | R | U | D |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:adminrouter:acs`<br>Controls access to the security and access management features.                                                                                                                                                                                         | x    |   |   |   |   |
| `dcos:adminrouter:ops:ca:ro`<br>Controls access to the read-only endpoints of the [Certificate Authority API](/1.10/security/ent/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/).                               | x    |   |   |   |   |
| `dcos:adminrouter:ops:ca:rw`<br>Controls user access to all endpoints of the [Certificate Authority API](/1.10/security/ent/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/).                                    | x    |   |   |   |   |
| `dcos:adminrouter:ops:exhibitor`<br> Controls access to the Exhibitor UI and API. This permission allows users to [remove the ZooKeeper state](/1.10/deploying-services/uninstall/#framework-cleaner) after uninstalling a service.                                                | x    |   |   |   |   |
| `dcos:adminrouter:ops:historyservice`<br>Controls access to the [History Service](/1.10/overview/architecture/components/#dcos-history).                                                                                                                                           | x    |   |   |   |   |
| `dcos:adminrouter:ops:mesos-dns`<br> Controls access to the [Mesos DNS API](/1.10/networking/mesos-dns/mesos-dns-api/).                                                                                                                                                           | x    |   |   |   |   |
| `dcos:adminrouter:ops:mesos`<br> Controls access to the Mesos master UI and API.                                                                                                                                                                                                  | x    |   |   |   |   |
| `dcos:adminrouter:ops:metadata` <br>Controls access to the [Metadata endpoint](/1.10/api/master-routes/#metadata).                                                                                                                                                                 | x    |   |   |   |   |
| `dcos:adminrouter:ops:networking`<br> Controls access to [Network Metrics](/1.10/api/master-routes/#network-metrics) endpoint.                                                                                                                                                     | x    |   |   |   |   |
| `dcos:adminrouter:ops:slave`<br>Controls access to the Mesos agent UI and API.                                                                                                                                                                                                    | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-health` <br>Controls access to the [System health API](/1.10/api/master-routes/#system).                                                                                                                                                              | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-logs` <br>Controls access to [System logs API](/1.10/api/master-routes/#system).                                                                                                                                                                      | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-metrics`<br> Controls access to [System metrics API](/1.10/api/master-routes/#system).                                                                                                                                                                | x    |   |   |   |   |
| `dcos:adminrouter:package` <br> Controls access to the [Cosmos API](/1.10/api/master-routes/#cosmos), which provides access to the DC/OS Universe.                                                                                                                                 | x    |   |   |   |   |
| `dcos:adminrouter:service[:<group-name>]:<service-name>`<br> Controls access the UI and API of an installed DC/OS service.                                                                                                                                                                       | x    |   |   |   |   |
| `dcos:adminrouter:service:marathon` <br>Controls access to the native Marathon instance.                                                                                                                                                                                          | x    |   |   |   |   |
| `dcos:adminrouter:service:metronome`<br>  Controls access to [DC/OS Jobs (Metronome)](/1.10/deploying-jobs/).                                                                                                                                                                      | x    |   |   |   |   |

## <a name="mesos"></a>Mesos Permissions

The required permissions must be assigned to the principal that issues the
command to Mesos. This is not always the DC/OS user that is logged into the UI
or CLI. For example, when a DC/OS user uses the CLI or UI to launch a Marathon
application the Marathon framework performs its own authorization of that user
before deciding to create the application. Once Marathon has determined that
the DC/OS user is permitted to create the application, Marathon uses its own
DC/OS service account user called `dcos_marathon` to instruct Mesos to launch
the actual Mesos tasks. At that point, Mesos will check that the
`dcos_marathon` service account (and not the end user) is authorized to perform
a `create` action on the `dcos:mesos:master:task:app_id` resource.

Applications launched with Root Marathon can only receive offers for resources reserved for the `slave_public` or `*` [Mesos roles](/1.10/overview/concepts/#mesos-role).

|                                                                                                                                 Resource identifier                                                                                                                                 | full | C | R | U | D |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:mesos:agent:container:app_id[:<service-or-job-group>]`<br> Controls access to the [debugging](/1.10/monitoring/debugging/debug-perms/) features for a specific service or job.                                                                                               |      |   |   | x |   |
| `dcos:mesos:agent:container:role[:<role-name>]`<br>Controls access to the [debugging](/1.10/monitoring/debugging/debug-perms/) features for the given [Mesos role](/1.10/overview/concepts/#mesos-role).                                                                                                                       |      |   |   | x |   |
| `dcos:mesos:agent:endpoint:path[:<endpoint>]`<br> Controls access to unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/).                                                                                                                         |      |   | x |   |   |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br> Controls view access to service and job [executor information](https://mesos.apache.org/documentation/latest/app-framework-development-guide/).                                                                           |      |   | x |   |   |
| `dcos:mesos:agent:flags`<br> Controls view access to [agent flag](https://mesos.apache.org/documentation/latest/slave/flags/) configurations.                                                                                                                                              |      |   | x |   |   |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br> Controls view access to DC/OS services registered with the given [Mesos role](/1.10/overview/concepts/#mesos-role).                                                                                                                                                     |      |   | x |   |   |
| `dcos:mesos:agent:log`<br>Controls access to the [agent logs](/1.10/monitoring/logging/).                                                                                                                                                                                          |      |   | x |   |   |
| `dcos:mesos:agent:nested_container_session:app_id[:<service-or-job-group>]`<br> Controls access, by service or job group, to launching a container within a container of a service or job while [debugging](/1.10/monitoring/debugging/).                                          |      | x |   |   |   |
| `dcos:mesos:agent:nested_container_session:role[:<role-name>]`<br> Controls access, by [Mesos role](/1.10/overview/concepts/#mesos-role), to launching a container within a container of a service or job while [debugging](/1.10/monitoring/debugging/).                                                                       |      | x |   |   |   |
| `dcos:mesos:agent:nested_container_session:user[:<linux-user-name>]`<br> Controls access, by Linux user, to launching a container within a container of a service or job while [debugging](/1.10/monitoring/debugging/). The users of both nested containers must be the same.     |      | x |   |   |   |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br> Controls access to the Mesos sandbox.                                                                                                                                                                              |      |   | x |   |   |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br> Controls access to task information.                                                                                                                                                                                  |      |   | x |   |   |
| `dcos:mesos:master:endpoint:path[:<path>]`<br> Controls access to these unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/): `logging/toggle`, `/metrics/snapshot`, and `/files/debug`.                                                           |      |   | x |   |   |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br> Controls access to [executor](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) service and job groups.                                                                                    |      |   | x |   |   |
| `dcos:mesos:master:flags`<br> Controls view access to [master flag](https://mesos.apache.org/documentation/latest/endpoints/master/flags/) configurations.                                                                                                                        |      |   | x |   |   |
| `dcos:mesos:master:framework:principal[:<service-account-id>]`<br> Controls access, by service account ID, to the Mesos [tear down](https://mesos.apache.org/documentation/latest/endpoints/master/teardown/) endpoint, which allows you to uninstall a DC/OS service.            |      |   |   |   | x |
| `dcos:mesos:master:framework:role[:<role-name>]` <br> Controls access, by [Mesos role](/1.10/overview/concepts/#mesos-role), to register as a framework with [Mesos](https://mesos.apache.org/documentation/latest/roles/).                                                                                                    |      | x | x |   |   |
| `dcos:mesos:master:log`<br> Controls access to the Mesos [master logs](/1.10/monitoring/logging/).                                                                                                                                                                                 |      |   | x |   |   |
| `dcos:mesos:master:quota:role[:<role-name>]` <br> Controls access, by [Mesos role](/1.10/overview/concepts/#mesos-role), to the [resource quota](https://mesos.apache.org/documentation/latest/quota/).                                                                                                                         |      |   | x | x |   |
| `dcos:mesos:master:reservation:principal[:<service-account-id>]`<br> Controls access, by user or service account, to unreserve [resources](https://mesos.apache.org/documentation/latest/reservation/).                                                                           |      |   |   |   | x |
| `dcos:mesos:master:reservation:role[:<role-name>]`<br> Controls access, by [Mesos role](/1.10/overview/concepts/#mesos-role), to reserve [resources](https://mesos.apache.org/documentation/latest/reservation/).                                                                                                              |      | x |   |   |   |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br> Controls access to run tasks.                                                                                                                                                                                        |      | x |   |   |   |
| `dcos:mesos:master:task:user[:<linux-user-name>]`<br> Controls access to run tasks as a specific Linux user.                                                                                                                                                                      |      | x |   |   |   |
| `dcos:mesos:master:volume:principal[:<service-account-id>]`<br> Controls access to destroy a volume.                                                                                                                                                                              |      |   |   |   | x |
| `dcos:mesos:master:volume:role[:<role-name>]`<br> Controls access to create a volume for the given [Mesos role](/1.10/overview/concepts/#mesos-role).                                                                                                                                                                    |      | x |   |   |   |
| `dcos:mesos:master:weight:role[:<role-name>]`<br> Control access to the [weight](https://mesos.apache.org/documentation/latest/weights/) for the given [Mesos roles](/1.10/overview/concepts/#mesos-role).                                                                                                                  |      |   | x | x |   |

## <a name="marathon-metronome"></a>Marathon and Metronome Permissions

In each of these cases the principal is the client performing the HTTP request
to the Marathon or Metronome API. The principal is authenticated using the
DC/OS Authentication Token it presents in the `Authorization` HTTP header. Once
the principal has been authenticated Marathon or Metronome checks that the
principal has been assigned permission to perform the action (e.g., `read`) on
the resource (e.g., `dcos:service:marathon:marathon:admin:config`).

|                                                                                                                                 Resource identifier                                                                                                                                 | full | C | R | U | D |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:service:marathon:marathon:admin:config`<br>  Controls access to the [GET /v2/info Marathon endpoint](/1.10/deploying-services/marathon-api/#/info).                                                                                                                         |      |   | x |   |   |
| `dcos:service:marathon:marathon:admin:events` <br>Controls view access to the Marathon events endpoint [GET v2/events](/1.10/deploying-services/marathon-api/#/events).                                                                                                           |      |   | x |   |   |
| `dcos:service:marathon:marathon:admin:leader` <br> Controls access to the [GET/DELETE /v2/leader](/1.10/deploying-services/marathon-api/#/leader) endpoint.                                                                                                                       | x    |   | x | x |   |
| `dcos:service:marathon:marathon:services:/[<service-group>]` Controls access to [DC/OS services](/1.10/deploying-services) launched by the native Marathon instance.                                                                                                                | x    | x | x | x | x |
| `dcos:service:metronome:metronome:jobs[:<job-group>]`<br>  Controls access to [jobs and job groups](/1.10/deploying-jobs/).                                                                                                                                                        | x    | x | x | x | x |


## <a name="secrets"></a>Secret Store Permissions

These permissions control access to the [Secrets API](/1.10/security/ent/secrets/secrets-api/). A Mesos framework must have
permission granted to its DC/OS service account in order to access a given secret. If you are looking for information on how to launch
Marathon applications using secrets see [Configuring services and pods to use secrets](/1.10/security/ent/secrets/use-secrets/).

|                                                                                                                                 Resource identifier                                                                                                                                 | full | C | R | U | D |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:secrets:default:[<path-name>/]<secret-name>`<br> Controls access to individual [secrets](/1.10/security/ent/secrets/).                                                                                                                                                           | x    | x | x | x | x |
| `dcos:secrets:list:default:/[<path>]`<br> Controls view access to the names of [secrets](/1.10/security/ent/secrets/).                                                                                                                                                                 |      |   | x |   |   |

## <a name="superuser"></a>Superuser Permissions

Similar to the Windows `Administrator` or Linux `root` accounts, DC/OS has the
concept of the `superuser`. A user with permission to perform any action on the `dcos:superuser` resource has complete, unrestricted access to any operation
throughout DC/OS. This is extremely powerful and this permission should be
granted sparingly.

|                                                                                                                                 Resource identifier                                                                                                                                 | full | C | R | U | D |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:superuser`<br> Controls complete access to the DC/OS cluster.                                                                                                                                                                                                               | x    | x | x | x | x |
