---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/troubleshooting/index.md
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: -1
excerpt: Troubleshooting guides for common issues related to the dcos-storage service
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

<!-- TODO(bbannier): Adjust `menuWeight` to publish this doc. -->

This document summaries common issues related to operating the dcos-storage and
integrating it with other components.


# After an agent changes its Mesos ID, some pods are missing in my data service.

If the agent loses its metadata (e.g., due to the removal of its `/var/lib/mesos/slave/meta/slaves/latest` symlink) and
rejoins the cluster, Mesos will treat it as a new agent and assign a new Mesos ID. As a result, local volumes created on
the agent (with the old Mesos ID) would become **stale**:
```
$ dcos storage volume list
NODE                                     NAME   SIZE  STATUS
061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
061cf525-badd-4541-9fca-c97df5687480-S0  vol-3  10G   STALE
```

If this happens, here are the steps to bring the data service back online.
<p class="message--note"><strong>NOTE: </strong>We will use the <code>beta-cassandra</code> data service to illustrate
how to recover a data service that uses local volumes served by the DC/OS storage service in the following example.</p>
<p class="message--warning"><strong>WARNING: </strong>DC/OS storage service does not support preserving local volumes
when the agent changes its Mesos ID. The following steps will wipe data on the stale volume to prevent data leakage and
create a new volume for the data service to restore the data.</p>

  1. Recover the `devices` provider on the agent (with the old Mesos ID) that is in `RECOVERY` state:
     ```
     $ dcos storage provider list
     PLUGIN   NAME       NODE                                     STATE
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY

     $ dcos storage provider recover --name devices-1

     $ dcos storage provider list
     PLUGIN   NAME       NODE                                     STATE
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S0  RECOVERY
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     ```
     Note that the `devices-1` provider is now associated with the new Mesos ID after recovery.

  2. Recover all devices on the agent (with the new Mesos ID) that are in `RECOVERY` status:
     ```
     $ dcos storage device list
     NODE                                     NAME                                                                                      STATUS    ROTATIONAL  TYPE
     061cf525-badd-4541-9fca-c97df5687480-S2  xvdb                                                                                      ONLINE    false       disk
     061cf525-badd-4541-9fca-c97df5687480-S3  xvdb                                                                                      ONLINE    false       disk
     061cf525-badd-4541-9fca-c97df5687480-S4  g4frrJVnuWA34rnW8s9uOPY-g4frrJVnuWA34rnW8s9uOPY_ec6f9189--e1bd--48e2--8c41--a19d986bde8d  ONLINE    false       lvm
     061cf525-badd-4541-9fca-c97df5687480-S4  xvdb                                                                                      RECOVERY  false       disk

     $ dcos storage device recover --node 061cf525-badd-4541-9fca-c97df5687480-S4 --device xvdb

     $ dcos storage device list
     NODE                                     NAME                                                                                      STATUS  ROTATIONAL  TYPE
     061cf525-badd-4541-9fca-c97df5687480-S2  xvdb                                                                                      ONLINE  false       disk
     061cf525-badd-4541-9fca-c97df5687480-S3  xvdb                                                                                      ONLINE  false       disk
     061cf525-badd-4541-9fca-c97df5687480-S4  g4frrJVnuWA34rnW8s9uOPY-g4frrJVnuWA34rnW8s9uOPY_ec6f9189--e1bd--48e2--8c41--a19d986bde8d  ONLINE  false       lvm
     061cf525-badd-4541-9fca-c97df5687480-S4  xvdb                                                                                      ONLINE  false       disk
     ```

  3. Recover the `lvm` provider on the agent (with the old Mesos ID) that is in `RECOVERY` state:
     ```
     $ dcos storage provider recover --name lvm-1

     $ dcos storage provider list
     PLUGIN   NAME       NODE                                     STATE
     devices  devices-1  061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     devices  devices-3  061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     devices  devices-2  061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-3      061cf525-badd-4541-9fca-c97df5687480-S3  ONLINE
     lvm      lvm-2      061cf525-badd-4541-9fca-c97df5687480-S2  ONLINE
     lvm      lvm-1      061cf525-badd-4541-9fca-c97df5687480-S4  ONLINE
     ```
     The `lvm-1` provider is now associated with the new Mesos ID after recovery.

  4. Remove the stale volume to free up the disk space:
     ```
     $ dcos storage volume remove --stale --name vol-3

     $ dcos storage volume list
     NODE                                     NAME   SIZE  STATUS
     061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
     ```
     This step will deprovision the volume and clean up the data it stores to ensure no data leakage.

  5. Recreate a new volume for the data service:
     ```
     $ dcos storage volume create --name vol-3 --capacity 10G --profile fast

     $ dcos storage volume list
     NODE                                     NAME   SIZE  STATUS
     061cf525-badd-4541-9fca-c97df5687480-S2  vol-1  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S3  vol-2  10G   ONLINE
     061cf525-badd-4541-9fca-c97df5687480-S4  vol-3  10G   ONLINE
     ```

  6. Replace the missing pod so the data service will create a new pod instance to restore data back to the new volume:
     ```
     $ dcos beta-cassandra pod replace node-0
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

# I issued a `volume create` or `volume remove` with the CLI, but the command returned with an error

- Use error message to drill down
- defer to dedicated item below


# I created (removed) a volume but its stays stuck in `PENDING` (`REMOVING`) state

- workaround for `create`: remove and recreate the volume
- agent responsive?
- networking operational?
- do offers arrive?
- `create`: profile out of capacity? See item on profile capacity.
- `remove`:
    - volume in use/reserved in another role? -> jq queries against Mesos master API (`/mesos/state`, `/mesos/slaves`)
- scheduler failover if nothing else helps


# I created an `lvm` provider but it never comes `ONLINE`

- `devices` provider online?
- networking operational?
- config matches what `devices` provider exposes? -> `dcos storage provider list --json`, `/master/slaves`


# I cannot remove an `lvm` provider since it has volumes in use

- identify `volumes` -> `dcos storage volume list`
- identify volume users


# Detect remaining capacity in a profile

- summarize resources from `/mesos/slaves` (reserved & unreserved)


# I created a volume, but task using the volume always fail

- did the task fail with an error related to publishing the volume?
- how to get provider logs
- causes and mitigations for `lvm` provider publish failures from existing filesystem


# I suspect that network errors might affect dcos-storage

- Can the agent reach the storage service (test request, agent log messages)
- Can dss reach the agent (test request, dss log messages)
