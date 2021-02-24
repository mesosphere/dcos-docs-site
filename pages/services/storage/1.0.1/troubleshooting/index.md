---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/troubleshooting/index.md
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 30
excerpt: Troubleshooting guides for common issues related to the DC/OS Storage Service
enterprise: true
---

This document provides troubleshooting tips and solutions to common issues related to operating the DC/OS Storage Service and integrating it with other components.


# How to monitor the DC/OS Storage Service

Grafana dashboards can provide additional insight into the DC/OS Storage Service, and sample dashboards are built into
the DC/OS monitoring service (`dcos-monitoring`) that you can install from the DC/OS catalog. You can download the latest
dashboards from the [dashboard repository](https://github.com/dcos/grafana-dashboards). The dashboards related to the
DC/OS Storage Service are prefixed with `Storage-`.

Additionally, the DC/OS Storage Service generates metrics which can be used to create additional dashboards. All metrics
related to the DC/OS Storage Service have a prefix of `csidevices_`, `csilvm_`, or `dss_`.


# How to get the logs of an 'lvm' volume provider

The logs of an `lvm` volume provider consist of two parts:

* The last `N` lines of the `csilvm` volume plugin log can be obtained through the following CLI command (assuming the
  `lvm` provider is on node `a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40`):
  ```bash
  dcos node log --mesos-id=a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40 --filter=CSI_PLUGIN:csilvm --lines=N
  ```
  Or, you can SSH to the node and use `journalctl` to see the full log:
  ```bash
  journalctl CSI_PLUGIN=csilvm
  ```

* The Storage Local Resource Provider (SLRP) log, which is part of the Mesos agent log, records the communications
  between the Mesos agent and the `csilvm` volume plugin. It can be retrieved through:
  ```bash
  dcos node log --mesos-id=a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40 --component=dcos-mesos-slave --lines=N |
      grep '\(provider\|volume_manager\|service_manager\)\.cpp:'
  ```
  Or alternatively, SSH to the node and run:
  ```
  journalctl -u dcos-mesos-slave | grep '\(provider\|volume_manager\|service_manager\)\.cpp:'
  ```

# I created a 'devices' volume provider but it never comes 'ONLINE'

If a `devices` volume provider stays stuck in `PENDING`, the following CLI command can provide more details:
```bash
dcos storage provider list --json
```
```json
{
    "providers": [
        {
            "name": "devices-5754-S0",
            "spec": {
                "plugin": {
                    "name": "devices",
                    "config-version": 1
                },
                "node": "95f58562-c03f-4e01-808e-9dc3dbf75754-S0",
                "plugin-configuration": {
                    "blacklist": "{usr,xvd[aefgh]*}",
                    "blacklist-exactly": false
                }
            },
            "status": {
                "state": "PENDING",
                "nodes": [
                    "95f58562-c03f-4e01-808e-9dc3dbf75754-S0"
                ],
                "last-changed": "2019-06-20T14:59:09.275567368-07:00",
                "last-updated": "2019-06-20T14:59:09.275567368-07:00",
                "asset-id": "4adw6CqlGcWZA7aZ0KoAPM",
                "report": {
                    "message": "Launching CSI plugin on agent",
                    "timestamp": "2019-06-20T21:42:21.024828689Z"
                }
            }
        }
    ]
}
```

If you see the `Launching CSI plugin on agent` message as shown above, check following items:

1. Check if the node of the provider (`95f58562-c03f-4e01-808e-9dc3dbf75754-S0` in this example) is reachable from the
   `storage` task:
   ```bash
   dcos task exec storage \
       curl -s -k -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
           https://master.mesos/agent/95f58562-c03f-4e01-808e-9dc3dbf75754-S0/version
   ```
   If it returns a JSON like the following one, the storage task can reach the node:
   ```
   {"build_date":"2019-06-07 07:19:12","build_time":1559891952.0,"build_user":"","git_sha":"1f13532060d2118e07567ec37cc2d60f63d1ce29","version":"1.8.1"}
   ```
   Otherwise, the cluster's network is not operational and needs to be resolved first.

2. Check if the service account has all required permissions. The list of required permissions can be found in the
   [install documentation](../install/#add-service-permissions).

3. Check the DC/OS Storage Service log for any error message and investigate what caused the error. The following CLI
   command shows the last `N` lines of the log:
   ```
   dcos service log storage stderr --lines=N
   ```
   For example, if the service account does not have sufficient permissions, you might see `Access Denied` in the log.


# I created an 'lvm' volume provider but it never comes 'ONLINE'

If an `lvm` volume provider fails to come online, it typically means that the provider cannot be created due to some
necessary condition not being met. DSS will continue trying to create the provider at regular intervals until it
succeeds or you remove the provider using `dcos storage provider remove --name=my-provider-1`. Check the following items:

1. Are the devices specified in the `spec.plugin-configuration.devices` list
   present in the list when you run `dcos storage device list`? Are they on the
   correct node?

2. Is the network operational? Refer to this
   [section](#i-created-a-devices-volume-provider-but-it-never-comes-online) to test if the node is reachable from the
   `storage` task.

3. Are the devices mounted or in use by another process on the node?

This troubleshooting example begins with the following provider configuration:

```json
{
  "name": "my-provider-1",
  "spec": {
    "plugin": {
      "name": "lvm",
      "config-version": 7
    },
    "node": "a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40",
    "plugin-configuration": {
      "devices": [
        "xvdx"
      ]
    }
  }
}
```

Suppose that creating the provider using the above JSON timed out and now it shows as `PENDING` when running `dcos storage provider list`.

```bash
dcos storage provider list --name my-provider-1
```
```
PLUGIN  NAME       NODE                                      STATE
lvm     gpaultest  a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S19  PENDING
```

First, check whether the device in question actually exists on the node.

```bash
dcos storage device list
```
```
NODE                                      NAME  STATUS  ROTATIONAL  TYPE
60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S1   xvdx  ONLINE  false       disk
60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S40  xvdy  ONLINE  false       disk
```

The problem is that the provider is configured to use `xvdx` on agent `...-S40`, but there is no such device on that node. Instead, it should use `xvdy` if it wants to run on node `...-S40`.

Next, remove the faulty provider.

```bash
dcos storage provider remove --name=my-provider-1
```

Then, fix the JSON and submit the following modified configuration to once more create the provider.

```bash
cat <<EOF | dcos storage provider create
{
  "name": "my-provider-1",
  "spec": {
    "plugin": {
      "name": "lvm",
      "config-version": 7
    },
    "node": "a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40",
    "plugin-configuration": {
      "devices": [
        "xvdy"
      ]
    }
  }
}
EOF
```
```
Error: The operation has timed out. Run the `list --json` command to check the operation status.
```

The command timed out again, even though the configuration is using the correct devices.

The next step is to rule out network connectivity problems in the cluster.

```bash
dcos node ssh --master-proxy --mesos-id=a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40 --user=centos
```

If the above command fails, the next step is to investigate whether the cluster's network is healthy.

If the attempt to SSH to the node succeeds, move to the next step..

DSS launches a provider by writing a Mesos "Resource Provider Configuration" to a file in `/var/lib/dcos/mesos/resource-providers` on the node.

Check whether any of the resource provider configurations in that directory relate to the problematic provider:

```bash
cd /var/lib/dcos/mesos/resource-providers/
grep my-provider-1 *.json
```

If none of the resource provider configurations match the provider, it means
that DSS did not succeed in instructing Mesos to create the resource provider
configuration. Network connectivity, IAM permissions (the DC/OS Service
Account that DSS is configured to run with has insufficient permissions) or
Mesos issues are all good avenues for further investigation.

However, if a resource provider configuration exists and matches the provider
then the Mesos agent will be attempting to launch a CSI plugin for our provider
and further investigation revolves around figuring out why it doesn't succeed.

To see the logs generated by the crashing `csilvm` plugin instance, refer
to this [section](#how-to-get-the-logs-of-an-lvm-volume-provider).


# How to determine the remaining capacity for each volume profile

The following command shows the capacity of each profile on every node:
```bash
curl -s -k -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/mesos/slaves |
  jq '[ .slaves[] | { node: .id} + (
          .reserved_resources_full["dcos-storage"][]? |
          select(.disk.source | has("id") | not) |
          { profile: .disk.source.profile, "capacity-mb": .scalar.value }
      ) ]'
```
```json
[
  {
    "node": "60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S4",
    "profile": "test-profile-data-services",
    "capacity-mb": 20476
  },
  {
    "node": "60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S1",
    "profile": "test-profile-data-services",
    "capacity-mb": 10236
  },
  {
    "node": "a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40",
    "profile": "test-profile-sdk",
    "capacity-mb": 3936
  },
  {
    "node": "a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40",
    "profile": "test-profile-data-services",
    "capacity-mb": 10236
  },
  {
    "node": "60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S2",
    "profile": "test-profile-data-services",
    "capacity-mb": 10236
  }
]
```


# I issued a 'volume create' but the command timed out and the volume stays stuck in 'PENDING'

You might see the following error message when issuing the `dcos storage volume create` command:
```
Error: The operation has timed out. Run the `list --json` command to check the operation status.
```

This means that the DC/OS Storage Service is still processing the request
but the CLI has timed out. You can reissue the same command. You can see
your operation and track it's progress using `dcos storage volume list`.

For example, when creating a volume with name `my-volume-1`, it will display as `PENDING` in the volume list until it has been fully created.

```bash
dcos storage volume list
```
```
NODE                                      NAME                    SIZE    STATUS
                                          my-volume-1             20480M  PENDING
60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S2   data-services-volume-1  10240M  ONLINE
a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40  data-services-volume-2  10240M  ONLINE
60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S1   data-services-volume-3  10240M  ONLINE
```

View the current status of the volume in the `status.report` field of the `volume list` command's JSON output:

```bash
dcos storage volume list --name my-volume-1 --json
```
```
{
    "volumes": [
        {
            "name": "my-volume-1",
            "capacity-mb": 1024000,
            "profile": "lvm-generic-xfs",
            "status": {
                "state": "PENDING",
                "node": "05eefb88-6449-4f34-bfb1-b3d754850f43-S0",
                "last-changed": "2019-06-20T15:54:34.893841309-07:00",
                "last-updated": "2019-06-20T15:54:34.893841309-07:00",
                "asset-id": "1lKtyoMTEES6Jtn8zF3kIf",
                "report": {
                    "message": "Allocated asset ID",
                    "timestamp": "2019-06-19T12:19:34.705826326Z"
                },
                "requires": [
                    {
                        "type": "PROVIDER",
                        "name": "test-volume-group-buxpfrr9nozc"
                    }
                ]
            }
        }
    ]
}
```


If the volume stays stuck in `PENDING` status, check the following steps:

1. Check if all `lvm` providers are `ONLINE`:

   ```bash
   dcos storage provider list --plugin=lvm
   ```
   ```
   PLUGIN  NAME                              NODE                                      STATUS
   lvm     lvm-data-services-1555629335-818  60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S2   ONLINE
   lvm     lvm-data-services-1555629679-584  60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S1   ONLINE
   lvm     lvm-data-services-1555629767-062  60c42ab7-eb1a-4cec-b03d-ea06bff00c3f-S4   ONLINE
   lvm     lvm-data-services-1555629831-579  a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40  ONLINE
   lvm     lvm-sdk-1555629813-960            a221eeb3-b9c0-4e92-ae20-1e1d4af25321-S40  ONLINE
   ```
   If an `lvm` provider is not online, it won't offer any storage pool to the DC/OS Storage Service. Refer to
   this [section](#i-created-an-lvm-volume-provider-but-it-never-comes-online) for troubleshooting `lvm` providers.

2. Check if there is sufficient capacity for the given profile:

   Refer to this [section](#how-to-find-out-the-remaining-capacity-for-each-volume-profile) to determine if
   there is a sufficiently large storage pool for the volume. When nodes are not specified at the time volumes are
   created, the DC/OS Storage Service can suboptimally allocate space among storage pools. As a result, one or more
   storage pools may become fragmented. To reduce fragmentation, consider specifying the `--node` flag when creating
   volumes. If a storage pool is not shown as expected, check the agent log for further details.

3. Examine the `Storage-Details` Grafana dashboard to look for anomalies in the DC/OS Storage Service.

   Refer to this [section](#how-to-monitor-the-dc-os-storage-service) for the Grafana dashboards.
   Specifically, the `Storage-Details` dashboard monitors how many offers are processed by the DC/OS Storage Service, as
   well as other health metrics. If there is anything abnormal, the DC/OS Storage Service log may provide more details:
   ```
   dcos service log storage stderr --lines=N
   ```

You can issue a `volume remove` command to cancel an ongoing volume creation if the DC/OS Storage Service has not
picked an appropriate storage pool yet:
```bash
dcos storage volume remove --name=my-volume-1
```


# How to find which task uses my volume

The following command shows the reservation of each volume:
```bash
(dcos storage volume list --json &&
 curl -s -k -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
     $(dcos config show core.dcos_url)/mesos/slaves) |
  jq -s '[ ([ .[0].volumes[] |
             { (.status.metadata["volume-id"]): { name: .name } }? ] | add) *
           ([ .[1].slaves[].used_resources_full[] | select(.disk.source.id) |
             { (.disk.source.id): { reservation: .reservation } } ] | add) |
           to_entries[].value | select(.reservation) ]'
```
```json
[
  {
    "name": "test-volume-1",
    "reservation": {
      "principal": "dcos_marathon",
      "labels": {
        "labels": [
          {
            "key": "marathon_framework_id",
            "value": "a221eeb3-b9c0-4e92-ae20-1e1d4af25321-0000"
          },
          {
            "key": "marathon_task_id",
            "value": "test-app.instance-61858c9d-92ec-11e9-83f4-06a15b440a77"
          }
        ]
      }
    }
  },
  {
    "name": "data-services-volume-1",
    "reservation": {
      "principal": "beta-hdfs",
      "labels": {
        "labels": [
          {
            "key": "resource_id",
            "value": "b4fd7e39-4b48-44c5-b2c2-588d68564053"
          }
        ]
      }
    }
  },
  {
    "name": "data-services-volume-2",
    "reservation": {
      "principal": "beta-elastic",
      "labels": {
        "labels": [
          {
            "key": "resource_id",
            "value": "a1526373-8d36-4624-8105-9c4a8cd9d100"
          }
        ]
      }
    }
  }
]
```
In the above example, `test-volume-1` is used by the `test-app` Marathon app, `data-service-volume-1` is used by the
`beta-hdfs` data service, and `data-service-volume-2` is used by the `beta-elastic` data service.


# My volume is 'ONLINE' but my service does not run

There are a couple possibilities if a service using the volume is not running:

* No task is ever launched for the service because the volume is not offered to the service. It is possible that the
  volume has been offered to, and taken by, another task. To determine if another task has taken control of the volume, refer
  to this [section](#how-to-find-which-task-uses-my-volume).

* If the volume has not been taken by any other task but the service still cannot launch the task, check if the task has any
  placement constraints, and if the volume resides on a node that meets those constraints. If not, recreate the volume on
  a proper node through the `--node` flag.

* The service launched a task but then the task failed with the following message:
  ```
  Failed to publish resources '...' for container ...: Received FAILED status
  ```
  This means that the `csilvm` volume plugin has a problem mounting the volume. To further investigate what leads to the
  mount failures, refer to this [section](#how-to-get-the-logs-of-an-lvm-volume-provider) to analyze the volume
  plugin log and the SLRP log.


# After an agent changes its Mesos ID, some pods are missing in my data service

If the agent loses its metadata (e.g., due to the removal of its `/var/lib/mesos/slave/meta/slaves/latest` symlink) and
rejoins the cluster, Mesos will treat it as a new agent and assign a new Mesos ID. As a result, local volumes created on
the agent (with the old Mesos ID) would become **stale**:
```bash
dcos storage volume list
```
```
NODE                                     NAME   SIZE  STATUS
061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
061cf525-badd-4541-9fca-c97df5687480-S0  vol-3  10G   STALE
```

If this happens, here are the steps to bring the data service back online.
<p class="message--note"><strong>NOTE: </strong>We will use the <code>cassandra</code> data service to illustrate
how to recover a data service that uses local volumes served by the DC/OS Storage Service in the following example.</p>
<p class="message--warning"><strong>WARNING: </strong>DC/OS Storage Service does not support preserving local volumes
when the agent changes its Mesos ID. The following steps will wipe data on the stale volume to prevent any unauthorized
access to the data, then create a new volume so the data service could replicate the data back.</p>

  1. Recover the `devices` volume provider on the agent (with the old Mesos ID) that is in `RECOVERY`:
     ```bash
     dcos storage provider list
     ```
     ```
     PLUGIN   NAME       NODE                                     STATUS
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY
     ```
     ```bash
     dcos storage provider recover --name devices-1

     dcos storage provider list
     ```
     ```
     PLUGIN   NAME       NODE                                     STATUS
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     ```
     Note that the `devices-1` provider is now associated with the new Mesos ID after recovery.

  2. Recover all devices on the agent (with the new Mesos ID) that are in `RECOVERY`:
     ```bash
     dcos storage device list
     ```
     ```
     NODE                                     NAME                STATUS    ROTATIONAL  TYPE
     061cf525-badd-4541-9fca-c97df5687480-S2  xvdb                ONLINE    false       disk
     061cf525-badd-4541-9fca-c97df5687480-S3  xvdb                ONLINE    false       disk
     061cf525-badd-4541-9fca-c97df5687480-S4  csilv2zja5v3hdkfr5  ONLINE    false       lvm
     061cf525-badd-4541-9fca-c97df5687480-S4  xvdb                RECOVERY  false       disk
     ```
     ```bash
     dcos storage device recover --node 061cf525-badd-4541-9fca-c97df5687480-S4 --device xvdb

     dcos storage device list
     ```
     ```
     NODE                                     NAME                STATUS  ROTATIONAL  TYPE
     061cf525-badd-4541-9fca-c97df5687480-S2  xvdb                ONLINE  false       disk
     061cf525-badd-4541-9fca-c97df5687480-S3  xvdb                ONLINE  false       disk
     061cf525-badd-4541-9fca-c97df5687480-S4  csilv2zja5v3hdkfr5  ONLINE  false       lvm
     061cf525-badd-4541-9fca-c97df5687480-S4  xvdb                ONLINE  false       disk
     ```

  3. Recover the `lvm` volume provider on the agent (with the old Mesos ID) that is in `RECOVERY`:
     ```bash
     dcos storage provider recover --name lvm-1

     dcos storage provider list
     ```
     ```
     PLUGIN   NAME       NODE                                     STATUS
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     ```
     The `lvm-1` provider is now associated with the new Mesos ID after recovery.

  4. Remove the stale volume to free up the disk space:
     ```bash
     dcos storage volume remove --stale --name vol-3

     dcos storage volume list
     ```
     ```
     NODE                                     NAME   SIZE  STATUS
     061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
     ```
     This step will deprovision the volume and clean up the data it stores to ensure no data leakage.

  5. Recreate a new volume for the data service:
     ```bash
     dcos storage volume create --name vol-3 --capacity 10G --profile fast

     dcos storage volume list
     ```
     ```
     NODE                                     NAME   SIZE  STATUS
     061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S4  vol-3  10G   ONLINE
     ```

  6. Replace the missing pod so the data service will create a new pod instance to restore data back to the new volume:
     ```bash
     dcos cassandra pod replace node-0
     ```
     ```
     {
       "pod": "node-0",
       "tasks": [
         "node-0-backup-schema",
         "node-0-cleanup",
         "node-0-cleanup-snapshot",
         "node-0-fetch-azure",
         "node-0-fetch-s3",
         "node-0-init_system_keyspaces",
         "node-0-repair",
         "node-0-restore-schema",
         "node-0-restore-snapshot",
         "node-0-server",
         "node-0-snapshot",
         "node-0-upload-azure",
         "node-0-upload-s3"
       ]
     }
     ```


# I issued a 'volume remove' but the command timed out and the volume stays stuck in 'REMOVING'

You might see the following error message when issuing the `dcos storage volume remove` command:
```
Error: The operation has timed out. Run the `list --json` command to check the operation status.
```

This means that the DC/OS Storage Service is still processing your request but the CLI has timed out. You can see your
operation and track its progress using `dcos storage volume list`.

If the volume stays stuck in `REMOVING`, it is possible that the volume is being used by another service.
Refer to this [section](#how-to-find-which-task-uses-my-volume) to find out which service is using the volume.
Normally, once the service is removed, the volume should be unreserved, and the DC/OS Storage Service will resume the
volume removal once it receives the unreserved volume.

If the volume is not in use and unreserved, but still stuck in `REMOVING`, examine the `Storage-Details` Grafana
dashboard to look for anomalies in the DC/OS Storage Service. If there is anything abnormal, the DC/OS Storage Service
log may provide more details:
```
dcos service log storage stderr --lines=N
```


# I cannot remove an 'lvm' volume provider

The DC/OS Storage Service cannot remove an `lvm` volume provider unless all of its volumes have been removed.
Before removing an `lvm` volume provider, you must remove all if its volumes.
