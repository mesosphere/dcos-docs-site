---
layout: layout.pug
navigationTitle: Managing quotas
title: Managing quotas
menuWeight: 10
render: mustache
model: /1.14/data.yml
excerpt: Working with quotas for multi-tenancy
---
The topics in this section discuss how you can view and manage quotas to support multi-tenancy.

# Viewing quota
To view quota limits and consumption of a group, use the following command:

```bash
dcos quota get dev
```

You can also view quota information in the DC/OS UI by going to the Quota tab in the **Services** view.

# Updating quota
For updating existing quota on a group, use the following command:

```bash
dcos quota update dev --cpu 20 --me, 2048
```

# Deleting quota
To delete existing quota from a group, use the following command:

```bash
dcos quota delete dev
```

Note that deleting quota doesn't affect any running services inside the group. Services will keep running, but they won't be limited by quota anymore.

# Deploying services
Once quota is set on a group by an administrator, regular users can simply deploy their services in a group as usual. If the `enforceRole` property is set on the group, the service will be automatically configured to use the group role and hence limited by the quota. If the property is not set, but users want their service be limited by a quota, they can configure their service with the group role manually.

# Migrating services
For backwards compatibility, any existing and new groups will have `enforceRole` property set to false. Consequently, existing or new services launched in such groups continue to use their legacy role (actual role depends on the service) instead of the group role.

To migrate a stateless service that uses a legacy role to a group role, a user can simply reconfigure the role of the service to group role and do an update.

For example:

```bash
dcos marathon app update my-app role=dev
```

To migrate a stateful service (for example, DC/OS Kafka, DC/OS Cassandra), a user has to update the role of the service and run a `pod replace` command for each of the corresponding pods. Note that the `pod replace` command causes local persistent data to be lost.

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