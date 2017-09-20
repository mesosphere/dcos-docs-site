---
layout: layout.pug
title: Permissions Reference
menuWeight: 30
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  Permissions Reference
---

You can control DC/OS access by resource and operation.
See [Permission Management](/docs/1.10/security/ent/perms-management/) for details how to control permissions.

This topic provides a reference for each of the available DC/OS permissions.


# Enforcement
The DC/OS permissions are enforced based on your security mode.

| Permission Category                                 | Disabled | Permissive | Strict |
navigationTitle:  Permissions Reference
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

## <a name="admin-router"></a>Admin Router Permissions

|                                                                                                                                 Permission string                                                                                                                                 | full | C | R | U | D |
navigationTitle:  Permissions Reference
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:adminrouter:acs`<br>Controls access to the security and access management features.                                                                                                                                                                                         | x    |   |   |   |   |
| `dcos:adminrouter:ops:ca:ro`<br>Controls access to the read-only endpoints of the [Certificate Authority API](/docs/1.10/networking/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [Enterprise DC/OS CLI](/docs/1.10/cli/enterprise-cli/).                               | x    |   |   |   |   |
| `dcos:adminrouter:ops:ca:rw`<br>Controls user access to all endpoints of the [Certificate Authority API](/docs/1.10/networking/tls-ssl/ca-api/) and the `dcos security cluster ca` commands of the [Enterprise DC/OS CLI](/docs/1.10/cli/enterprise-cli/).                                    | x    |   |   |   |   |
| `dcos:adminrouter:ops:exhibitor`<br> Controls access to the Exhibitor UI and API. This permission allows users to [remove the ZooKeeper state](/docs/1.10/deploying-services/uninstall/#framework-cleaner) after uninstalling a service.                                                | x    |   |   |   |   |
| `dcos:adminrouter:ops:historyservice`<br>Controls access to the [History Service](/docs/1.10/overview/architecture/components/#dcos-history).                                                                                                                                           | x    |   |   |   |   |
| `dcos:adminrouter:ops:mesos-dns`<br> Controls access to the [Mesos DNS API](/docs/1.10/networking/mesos-dns/mesos-dns-api/).                                                                                                                                                           | x    |   |   |   |   |
| `dcos:adminrouter:ops:mesos`<br> Controls access to the Mesos master UI and API.                                                                                                                                                                                                  | x    |   |   |   |   |
| `dcos:adminrouter:ops:metadata` <br>Controls access to the [Metadata endpoint](/docs/1.10/api/master-routes/#metadata).                                                                                                                                                                 | x    |   |   |   |   |
| `dcos:adminrouter:ops:networking`<br> Controls access to [Network Metrics](/docs/1.10/api/master-routes/#network-metrics) endpoint.                                                                                                                                                     | x    |   |   |   |   |
| `dcos:adminrouter:ops:slave`<br>Controls access to the Mesos agent UI and API.                                                                                                                                                                                                    | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-health` <br>Controls access to the [System health API](/docs/1.10/api/master-routes/#system).                                                                                                                                                              | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-logs` <br>Controls access to [System logs API](/docs/1.10/api/master-routes/#system).                                                                                                                                                                      | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-metrics`<br> Controls access to [System metrics API](/docs/1.10/api/master-routes/#system).                                                                                                                                                                | x    |   |   |   |   |
| `dcos:adminrouter:package` <br> Controls access to the [Cosmos API](/docs/1.10/api/master-routes/#cosmos), which provides access to the DC/OS Universe.                                                                                                                                 | x    |   |   |   |   |
| `dcos:adminrouter:service[:<group-name>]:<service-name>`<br> Controls access the UI and API of an installed DC/OS service.                                                                                                                                                                       | x    |   |   |   |   |
| `dcos:adminrouter:service:marathon` <br>Controls access to the native Marathon instance.                                                                                                                                                                                          | x    |   |   |   |   |
| `dcos:adminrouter:service:metronome`<br>  Controls access to [DC/OS Jobs (Metronome)](/docs/1.10/deploying-jobs/).                                                                                                                                                                      | x    |   |   |   |   |

## <a name="mesos"></a>Mesos Permissions

|                                                                                                                                 Permission string                                                                                                                                 | full | C | R | U | D |
navigationTitle:  Permissions Reference
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:mesos:agent:container:app_id[:<service-or-job-group>]`<br> Controls access to the [debugging](/docs/1.10/monitoring/debugging/debug-perms/) features for a specific service or job.                                                                                               |      |   |   | x |   |
| `dcos:mesos:agent:container:role[:<role-name>]`<br>Controls access to the [debugging](/docs/1.10/monitoring/debugging/debug-perms/) features for a specific role.                                                                                                                       |      |   |   | x |   |
| `dcos:mesos:agent:endpoint:path[:<endpoint>]`<br> Controls access to unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/).                                                                                                                         |      |   | x |   |   |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br> Controls view access to service and job [executor information](https://mesos.apache.org/documentation/latest/app-framework-development-guide/).                                                                           |      |   | x |   |   |
| `dcos:mesos:agent:flags`<br> Controls view access to [agent flag](https://mesos.apache.org/documentation/latest/slave/flags/) configurations.                                                                                                                                              |      |   | x |   |   |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br> Controls view access to DC/OS services registered with a particular role.                                                                                                                                                     |      |   | x |   |   |
| `dcos:mesos:agent:log`<br>Controls access to the [agent logs](/docs/1.10/monitoring/logging/).                                                                                                                                                                                          |      |   | x |   |   |
| `dcos:mesos:agent:nested_container_session:app_id[:<service-or-job-group>]`<br> Controls access, by service or job group, to launching a container within a container of a service or job while [debugging](/docs/1.10/monitoring/debugging/).                                          |      | x |   |   |   |
| `dcos:mesos:agent:nested_container_session:role[:<role-name>]`<br> Controls access, by role, to launching a container within a container of a service or job while [debugging](/docs/1.10/monitoring/debugging/).                                                                       |      | x |   |   |   |
| `dcos:mesos:agent:nested_container_session:user[:<linux-user-name>]`<br> Controls access, by Linux user, to launching a container within a container of a service or job while [debugging](/docs/1.10/monitoring/debugging/). The users of both nested containers must be the same.     |      | x |   |   |   |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br> Controls access to the Mesos sandbox.                                                                                                                                                                              |      |   | x |   |   |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br> Controls access to task information.                                                                                                                                                                                  |      |   | x |   |   |
| `dcos:mesos:master:endpoint:path[:<path>]`<br> Controls access to these unprotected [Mesos endpoints](https://mesos.apache.org/documentation/latest/authorization/): `logging/toggle`, `/metrics/snapshot`, and `/files/debug`.                                                           |      |   | x |   |   |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br> Controls access to [executor](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) service and job groups.                                                                                    |      |   | x |   |   |
| `dcos:mesos:master:flags`<br> Controls view access to [master flag](https://mesos.apache.org/documentation/latest/endpoints/master/flags/) configurations.                                                                                                                        |      |   | x |   |   |
| `dcos:mesos:master:framework:principal[:<service-account-id>]`<br> Controls access, by service account ID, to the Mesos [tear down](https://mesos.apache.org/documentation/latest/endpoints/master/teardown/) endpoint, which allows you to uninstall a DC/OS service.            |      |   |   |   | x |
| `dcos:mesos:master:framework:role[:<role-name>]` <br> Controls access, by role, to register as a framework with [Mesos](https://mesos.apache.org/documentation/latest/roles/).                                                                                                    |      | x |   |   |   |
| `dcos:mesos:master:log`<br> Controls access to the Mesos [master logs](/docs/1.10/monitoring/logging/).                                                                                                                                                                                 |      |   | x |   |   |
| `dcos:mesos:master:quota:role[:<role-name>]` <br> Controls access, by role, to the [resource quota](https://mesos.apache.org/documentation/latest/quota/).                                                                                                                         |      |   | x | x |   |
| `dcos:mesos:master:reservation:principal[:<service-account-id>]`<br> Controls access, by user or service account, to unreserve [resources](https://mesos.apache.org/documentation/latest/reservation/).                                                                           |      |   |   |   | x |
| `dcos:mesos:master:reservation:role[:<role-name>]`<br> Controls access, by role, to reserve [resources](https://apache.mesos.org/documentation/latest/reservation/).                                                                                                              |      | x |   |   |   |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br> Controls access to run tasks.                                                                                                                                                                                        |      | x |   |   |   |
| `dcos:mesos:master:task:user[:<linux-user-name>]`<br> Controls access to run tasks as a specific Linux user.                                                                                                                                                                      |      | x |   |   |   |
| `dcos:mesos:master:volume:principal[:<service-account-id>]`<br> Controls access to destroy a volume.                                                                                                                                                                              |      |   |   |   | x |
| `dcos:mesos:master:volume:role[:<role-name>]`<br> Controls access to create a volume for the given Mesos role.                                                                                                                                                                    |      | x |   |   |   |
| `dcos:mesos:master:weight:role[:<role-name>]`<br> Control access to the [weight](https://mesos.apache.org/documentation/latest/weights/) for a given Mesos role.                                                                                                                  |      |   | x | x |   |

## <a name="marathon-metronome"></a>Marathon and Metronome Permissions

|                                                                                                                                 Permission string                                                                                                                                 | full | C | R | U | D |
navigationTitle:  Permissions Reference
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:service:marathon:marathon:admin:config`<br>  Controls access to the [GET /v2/info Marathon endpoint](/docs/1.10/deploying-services/marathon-api/#!/info).                                                                                                                         |      |   | x |   |   |
| `dcos:service:marathon:marathon:admin:events` <br>Controls view access to the Marathon events endpoints [GET v2/events](/docs/1.10/deploying-services/marathon-api/#!/events) and [GET/POST/DELETE /v2/eventSubscriptions](/docs/1.10/deploying-services/marathon-api/#!/eventSubscriptions). |      |   | x |   |   |
| `dcos:service:marathon:marathon:admin:leader` <br> Controls access to the [GET/DELETE /v2/leader](/docs/1.10/deploying-services/marathon-api/#!/leader) endpoint.                                                                                                                       | x    |   | x | x |   |
| `dcos:service:marathon:marathon:services:/[<service-group]` Controls access to [DC/OS services](/docs/1.10/deploying-services) launched by the native Marathon instance.                                                                                                                | x    | x | x | x | x |
| `dcos:service:metronome:metronome:jobs[:<job-group>]`<br>  Controls access to [jobs and job groups](/docs/1.10/deploying-jobs/).                                                                                                                                                        | x    | x | x | x | x |


## <a name="secrets"></a>Secret Store Permissions

|                                                                                                                                 Permission string                                                                                                                                 | full | C | R | U | D |
navigationTitle:  Permissions Reference
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:secrets:default:[<path-name>/]<secret-name>`<br> Controls access to individual [secrets](/docs/1.10/security/ent/secrets/).                                                                                                                                                           | x    | x | x | x | x |
| `dcos:secrets:list:default:/[<path>]`<br> Controls view access to the names of [secrets](/docs/1.10/security/ent/secrets/).                                                                                                                                                                 |      |   | x |   |   |

## <a name="superuser"></a>Superuser Permissions

|                                                                                                                                 Permission string                                                                                                                                 | full | C | R | U | D |
navigationTitle:  Permissions Reference
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|---|---|---|---|
| `dcos:superuser`<br> Controls complete access to the DC/OS cluster.                                                                                                                                                                                                               | x    |   |   |   |   |

