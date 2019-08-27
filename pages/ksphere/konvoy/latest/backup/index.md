---
layout: layout.pug
navigationTitle: Back up and restore
title: Back up and restore
menuWeight: 12
excerpt: Back up and restore the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For production clusters, regular maintenance should include routine backup operations on a regular basis to ensure data integrity and reduce the risk of data loss due to unexpected events.
Back up operations should include the cluster state, application state, and the running configuration of both stateless and stateful applications in the cluster.

As a production-ready solution, Konvoy provides the Velero add-on by default, to support backup and restore operations for your Kubernetes cluster and persistent volumes.

For on-premise deployments, Konvoy deploys Velero integrated with [Minio][minio], operating inside the same cluster.
For production use-cases, it's advisable to provide an *external* storage volume for Minio to use.

**NOTE** If you intend to use the cluster *without* an external storage volume for Minio, you should [fetch the latest backup](#fetching-a-backup-archive) and store it in a known, secured location at a regular interval.
For example, if you aren't using an external storage volume, you should back up and archive the cluster on a weekly basis.

## Install the Velero command-line interface

Although installing the Velero command-line interface is optional and independent of deploying a Konvoy cluster, having access to the command-line interface provides several benefits.
For example, you can use the Velero command-line interface to back up or restore a cluster on-demand or to modify certain settings without changing the Velero platform service configuration.

By default, Konvoy sets up Velero to use Minio over TLS using a self-signed certificate.
Currently, the Velero command-line interface does not handle self-signed certificates.
Until an upstream fix is released, please use [our patched 1.0.0 version of Velero](https://github.com/mesosphere/velero/releases/tag/v1.0.0-patch), which adds a `--insecureskipverify` flag.

## Regular backup operations

For production clusters, you should be familiar with the following basic administrative functions Velero provides:

- [Set a backup schedules](#set-a-backup-schedule)
- [Fetch backup archives](#fetching-a-backup-archive)
- [Run on-demand backups](#back-up-on-demand)
- [Restore from a backup archive](#restore-a-cluster)

### Set a backup schedule

By default, Konvoy configures a regular, automatic backup of the cluster's state in Velero.
The default settings do the following:

- create backups on a daily basis
- save the data from all namespaces

These default settings take effect after the cluster is created.
If you install Konvoy with the default platform services deployed, the initial backup starts after the cluster is successfully provisioned and ready for use.

The Velero CLI provides an easy way to create alternate backup schedules.
For example:

```bash
velero create schedule thrice-daily --schedule="@every 8h"
```

To change the default backup service settings:

1. Check the backup schedules currently configured for the cluster by running the following command:

    ```bash
    velero get schedules
    ```

1. Delete the `velero-kubeaddons-default` schedule by running the following command:

    ```bash
    velero delete schedule velero-kubeaddons-default
    ```

1. Replace the default schedule with your custom settings by running the following command:

    ```bash
    velero create schedule velero-kubeaddons-default --schedule="@every 24h"
    ```

You can also create backup schedules for specific namespaces.
Creating a backup for a specific namespace can be useful for clusters running multiple apps operated by multiple teams.
For example:

```bash
velero create schedule system-critical --include-namespaces=kube-system,kube-public,kubeaddons --schedule="@every 24h"
```

The Velero command-line interface provides many more options worth exploring. You can also find tutorials for [disaster recovery][velero-dr] and [cluster migration][velero-cm] on the Velero community site.

### Fetching a backup archive

To list the available backup archives in your cluster, run the following command:

```shell
velero backup get
```

To download a selected archive to your current working directory on your local workstation, run a command similar to the following:

```shell
velero backup download BACKUP_NAME --insecureskipverify
```

### Back up on demand

In some cases, you might find it necessary create a backup outside of the regularly-scheduled interval.
For example, if you are preparing to upgrade any components or modify your cluster configuration, you should perform a backup immediately before taking that action.

You can then create a backup by running a command similar to the following:

```shell
velero backup create BACKUP_NAME
```

### Restore a cluster

Before attempting to restore the cluster state using the Velero command-line interface, you should verify the following requirements:

- The backend storage, Minio, is still operational.
- The Velero platform service in the cluster is still operational.
- The Velero platform service must be set to a `restore-only-mode` to avoid having backups run while restoring.

To list the available backup archives for your cluster, run the following command:

```shell
velero backup get
```

To set Velero to a `restore-only-mode`, modify the Velero addon in the `ClusterConfiguration` of the `cluster.yaml` file:

```yaml
addons:
...
- name: velero
  enabled: true
  values: |-
    configuration:
      restoreOnlyMode: true
...
```

Then you may apply the configuration change by running:

```shell
konvoy deploy addons -y
```

Finally, check your deployment to verify that the configuration change was applied correctly:

```shell
helm get values velero-kubeaddons
```

To restore cluster data on-demand from a selected backup snapshot available in the cluster, run a command similar to the following:

```shell
velero restore create --from-backup BACKUP_NAME
```

## Enable or disable the backup addon

You can enable or disable the Velero platform service add-on in the `ClusterConfiguration` section of the `cluster.yaml` file.
For example, you can enable the `Velero` add-on using the following settings in the `ClusterConfiguration` section of the `cluster.yaml` file:

```yaml
addons:
- name: velero
  enabled: true
...
```

If you want to replace the Velero add-on with a different backup add-on service, you can disable the `velero` add-on by modifying the `ClusterConfiguration` section of the `cluster.yaml` file as follows:

```yaml
addons:
- name: velero
  enabled: false
...
```

Before disabling the Velero platform service add-on, however, be sure you have a recent backup that you can use to restore the cluster in the event that there is a problem converting to the new backup service.

After making changes to your `cluster.yaml`, you must run `konvoy up` to apply them to the running cluster.

# Backup service diagnostics

You can check whether the Velero service is currently running on your cluster through the operations portal, or by running the following `kubectl` command:

```bash
kubectl get all -n velero
```

If the Velero platform service add-on is currently running, you can generate diagnostic information about Velero backup and restore operations.
For example, you can run the following commands retrieve backup and restore information that you can use to assess the overall health of Velero in your cluster:

```bash
velero get schedules
velero get backups
velero get restores
velero get backup-locations
velero get snapshot-locations
```

[velero-dr]: https://heptio.github.io/velero/v0.11.0/disaster-case
[velero-cm]: https://heptio.github.io/velero/v0.11.0/migration-case
[velero-troubleshooting]: https://heptio.github.io/velero/v0.11.0/debugging-install
[kubeaddons]:https://github.com/mesosphere/kubeaddons-configs
[releases]:https://github.com/heptio/velero/releases
[minio]:https://velero.io/docs/v1.0.0/get-started/
[velero-get-started]: https://heptio.github.io/velero/v0.11.0/get-started
[homebrew]: https://brew.sh/
