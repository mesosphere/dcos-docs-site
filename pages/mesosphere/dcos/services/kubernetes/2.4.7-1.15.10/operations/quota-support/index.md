---
layout: layout.pug
navigationTitle: Quota Support
title: Quota Support
menuWeight: 5
excerpt: This feature requires support for enforceRole on Marathon groups found in Marathon v1.9.73 and Mesos v1.9.0, available starting DC/OS 2.0.
---

# Quota Support

This feature requires support for `enforceRole` on Marathon groups found in Marathon v1.9.73 and Mesos v1.9.0, available starting DC/OS 2.0.
By default, Marathon does not set `enforceRole=true` on group creation, and existing semantics are maintained.

See [Upgrade](/mesosphere/dcos/services/kubernetes/2.4.7-1.15.10/operations/upgrade/) section to upgrade your Kubernetes cluster to most recent version before continuing.

## Strict Mode DC/OS Clusters

For strict mode DC/OS clusters, additional role permissions are required and must be set up before deploying the service.

### New Kubernetes cluster in a group with enforceRole=true

New Kubernetes cluster with the name `/dev/kubernetes-cluster` will need permissions to the `dev` role

```shell
dcos security org users grant <service-account> dcos:mesos:master:reservation:role:dev create
```

### Migrating an existing Kubernetes cluster to a quota enforced role.

Existing service with name `/dev/kubernetes-cluster` will need permissions to both the `dev` and `dev__kubernetes-cluster-role` roles

```shell
dcos security org users grant <service-account> dcos:mesos:master:reservation:role:dev create
dcos security org users grant <service-account> dcos:mesos:master:reservation:role:dev__kubernetes-cluster-role create

dcos security org users grant <service-account> dcos:mesos:master:reservation:role:slave_public/dev__kubernete-cluster-role create
dcos security org users grant <service-account> dcos:mesos:master:reservation:role:slave_public/dev create
```

## Deploy new Kubernetes cluster in a group with quota enabled

To create a Kubernetes cluster named `/dev/kubernetes-cluster` in group `dev` with quota consumed from role `dev`, create a group with `enforceRole` enabled:

```shell
cat > create-group.json <<EOF
{
    "id":"/dev",
    "enforceRole":true
}
EOF
```

Create Marathon group:

```shell
dcos marathon group add create-group.json
```

Populate the Kubernetes cluster options:

cat > kubernetes-cluster-dev-options.json <<EOF
{
    "service":{
        "name":"/dev/kubernetes-cluster"
    }
}
EOF
```

Create Kubernetes cluster.

```shell
dcos kubernetes cluster create --yes --options=kubernetes-cluster-dev-options.json
```

Ensure Kubernetes SDK scheduler and pods have been launched under the `dev` role via Mesos UI.

## Migrate an existing cluster to use Quota support

To upgrade an existing cluster to a new version with quota support, use the following procedure.

1. See [Upgrade](/mesosphere/dcos/services/kubernetes/2.4.7-1.15.10/operations/upgrade/) section to upgrade your Kubernetes cluster to most recent version before continuing.

1. Create a file with the current Kubernetes cluster name and the following additional options:

```shell
cat > kubernetes-cluster-dev-options.json <<EOF
{
    "service":{
        "name":"/dev/kubernetes-cluster",
        "role": "dev",
        "enable_role_migration": true
    }
}
EOF
```

* `role` specifies the quota enforced role we're migrating towards, which is `dev` in this example.
* `enable_role_migration` notifies the scheduler that its pods will be migrated between legacy and quota enforced roles. The scheduler
subscribes with both roles when this flag is set.

1. Update the scheduler to use the quota enforced role.

```shell
dcos kubernetes cluster update  --options=kubernetes-cluster-dev-options.json.json
```

At this point, the scheduler will be upgraded and will use quota from the `dev` role. The deployed pods will be unaffected and will use their previous roles.

1. Issue pod replace commands to migrate all the pods in the service to the quota enforced role.

```shell
dcos kubernetes cluster debug pod replace etcd-0
dcos kubernetes cluster debug pod replace kube-control-plane-0
dcos kubernetes cluster debug pod replace kube-node-0
```

The pods will be migrated to consume quota from `dev`.

1. Create a file with the current Kubernetes cluster name and the following options to signal the end of the migration:

```shell
cat > kubernetes-cluster-dev-disable-migration.json<<EOF
{
    "service":{
        "name":"/dev/kubernetes-cluster",
        "role": "dev",
        "enable_role_migration": false
    }
}
EOF
```

Update the scheduler to stop subscribing to the legacy role.

```shell
dcos kubernetes cluster update --yes --options=kubernetes-cluster-dev-disable-migration.json.json
```

At this point, the scheduler and all the previous running pods have been migrated to the quota enforced role. Ensure SDK scheduler and pods have been launched under the `dev` role via Mesos UI.
