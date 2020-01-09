---
layout: layout.pug
navigationTitle: Quota Management
title: Quota Management
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: Using groups and quota management for multi-tenancy
---
Groups provide the foundation for supporting multi-tenant clusters using Mesosphere&reg; DC/OS&trade;. Groups enable you to create logical collections of services, permissions, secrets, and quotas. You can then use these logical collections to map a group to a specific team, project, or Line of Business.

The topics in this section discuss how you can use **groups** to manage resources by setting quota restrictions to support multi-tenancy.

# Quotas
You can define a **quota** to specify the maximum resources that the services in a group can use. After the limit is reached, no new services or scaling up of existing services is allowed.

Quota in DC/OS is built on top of the [Quota Limits](https://mesos.apache.org/documentation/latest/quota/) primitive in Apache&reg; Mesos&reg;.
Specifically, the quota set on a top-level DC/OS group (for example, "/dev") is translated to setting the quota limit on the corresponding resource role in Mesos (for example, "dev").
Additionally, services launched inside a given group are configured to use the resources allocated to the **group role** (for example, "dev"), so that their resource consumption can be limited by the quota defined.

# Prerequisites

* [DC/OS CLI installed and configured](/mesosphere/dcos/2.0/cli/).
* Sufficient [permissions](/mesosphere/dcos/2.0/security/ent/perms-reference) to manage quota (Enterprise DC/OS only).

    Quota management operations are typically done by the cluster administrator.

# Creating a group

To create a new group, dev, use the following command:

```bash
dcos marathon group add --id /dev. # If the group doesn't exist
```

# Setting quota

To set quota for the first time on a group, use the following command:

```bash
dcos quota create dev --cpu 10 --mem 1024
```

# Viewing quota
To view quota limits and consumption of a group, use the following command:

```bash
dcos quota get dev
```

You can also view quota information in the DC/OS UI by going to the Quota tab in the **Services** view.

# Updating quota
For updating existing quota on a group, use the following command:

```bash
dcos quota update dev --cpu 20 --mem 2048
```

# Deleting quota
To delete existing quota from a group, use the following command:

```bash
dcos quota delete dev
```

Note that deleting quota doesn't affect any running services inside the group. Services will keep running, but they won't be limited by quota anymore.

# Deploying services
After a quota is set on a group by an administrator, regular users can deploy their services in a group as usual. If the `enforceRole` property is set on the group, the service will be automatically configured to use the group role and hence limited by the quota. If the property is not set, but users want their service be limited by a quota, they can configure their service with the group role manually.

# Migrating services

For backwards compatibility, any existing top-level groups will have `enforceRole` property set to false. Consequently, existing and new services launched in such groups continue to use their legacy role instead of the group role. To modify this and cause new services to consume quota, run:

```bash
dcos marathon group update /dev enforeceRole=true # only needed for groups created before DC/OS 2.0
```

Existing services will continue to not consume quota and must be migrated. To migrate a stateless service that uses a legacy role to a group role, a user can update the role field of the service through an app or pod update:

```bash
dcos marathon app update /dev/my-app role=dev
```

To migrate a stateful service (for example, DC/OS service for Kafka&reg;, DC/OS service for Cassandra&reg;), a user has to update the role of the service and run a `pod replace` command for each of the corresponding pods. Note that the `pod replace` command causes local persistent data to be lost.

Before running the `pod replace` command:

1. Create a backup of the cluster state.
1. Ensure replication of underlying service can handle data loss of one node at a time.
1. Update the service role by running the following command:

    ```bash
    dcos kafka --name=/<group>/kafka update start --package-version="<version-supporting-group-role>"
    ```

After you complete the previous steps, run the following command for each pod:

```bash
dcos kafka --name=/<group>/kafka pod replace <pod-name>
```

# Limitations

* You can only set quota on top-level groups (for example, "/dev") but not on nested groups ("/dev/foo").
* Services running in the root group (for example, /app) are not enforced by quota.
* Not all of the Catalog services are enforced by quota. Refer to the specific service documentation for details.
* Jobs are not enforced by quota.
* Migrating stateful services cannot be done without incurring data loss.

# Additional resources
You can use the following additional resources to learn more about using quota limits:

- [Mesos API](https://mesos.apache.org/documentation/latest/quota/)
