---
layout: layout.pug
beta: false
navigationTitle: Back up and restore
title: Back up and restore
excerpt: Back up and restore Kommander data and your Konvoy cluster
menuWeight: 60
---

For production clusters, regular maintenance should include routine backup operations to ensure data integrity and reduce the risk of data loss due to unexpected events.
Backup operations should include the cluster state, application state, and the running configuration of both stateless and stateful applications in the cluster.

Kommander stores all data as CRDs in the Kubernetes API and you can back up and restore it using the following procedure.


## Velero

DKP provides Velero by default, to support backup and restore operations for your Kubernetes clusters and persistent volumes.

For on-premises deployments, DKP deploys Velero integrated with [MinIO][minio], operating inside the same cluster.

For production use-cases, D2iQ advises to provide an *external* storage class to use with [MinIO][minio].
To specify an external storageClass for the Minio instances, create a file called  velero-overrides.yaml with the following contents, and then `kubectl apply -f` after the cluster is configured.  You can also add the values below to the Kommander configuration file when installing Kommander.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: velero-overrides
  namespace: kommander
data:
  values.yaml: |
     minio:
      persistence:
         storageClass: <external storage class name>
         ```

You can also store your backups in Amazon S3 by configuring Velero in `cluster.yaml`  as follows:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: velero-overrides
  namespace: kommander
data:
  values.yaml: |
    minioBackend: false
    configuration:
      backupStorageLocation:
        # `name:` must be empty
        bucket: <BUCKET_NAME>
        config:
          region: <AWS_REGION> # such as us-west-2
          s3ForcePathStyle: "false"
          insecureSkipTLSVerify: "false"
          s3Url: ""
          # profile should be set to the AWS profile name mentioned in the secretContents below
          profile: default
    credentials:
      # With the proper IAM permissions with access to the S3 bucket,
      # you can attach the EC2 instances using the IAM Role, OR fill in `existingSecret` OR `secretContents` below.
      #
      # Name of a pre-existing secret (if any) in the Velero namespace
      # that should be used to get IAM account credentials.
      existingSecret:
      # The key must be named `cloud`, and the value corresponds to the entire content of your IAM credentials file.
      # For more information, consult the documentation for the velero plugin for AWS at:
      # [AWS] https://github.com/vmware-tanzu/velero-plugin-for-aws/blob/main/README.md
      secretContents: 
        # cloud: |
        #   [default]
        #   aws_access_key_id=<REDACTED>
        #   aws_secret_access_key=<REDACTED>
        ```
        
## Install the Velero command-line interface

Although installing the Velero command-line interface is optional and independent of deploying a DKP cluster, having access to the command-line interface provides several benefits.
For example, you can use the Velero command-line interface to back up or restore a cluster on demand, or to modify certain settings without changing the Velero configuration.

- By default, Konvoy sets up Velero to use MinIO over TLS using a self-signed certificate.
- As a result, when using certain commands, you may be asked to use the `--insecure-skip-tls-verify` flag.

Again, the default setup is not suitable for production use-cases.

See the instructions to [install the Velero command-line interface][velero-cli-install] for more information.

In DKP, the Velero platform application is installed in the `kommander` namespace, instead of `velero`.  Thus, after installing the CLI, we recommend that you set the Velero CLI `namespace` config option so that subsequent Velero CLI invocations will use the correct namespace:

```sh
velero client config set namespace=kommander


## Regular backup operations

For backing up production clusters, you should be familiar with the following basic administrative functions Velero provides:

- [Set a backup schedule][set-schedule]
- [Run on-demand backups][backup-on-demand]
- [Restore from a backup archive][restore-a-cluster]

### Set a backup schedule

By default, DKP configures a regular, automatic backup of the cluster's state in Velero.
The default settings do the following:

- Create daily backups
- Save the data from all namespaces

These default settings take effect after the cluster is created.
If you install Konvoy with the default platform services deployed, the initial backup starts after the cluster is successfully provisioned and ready for use.

#### Alternate backup schedules

The Velero CLI provides an easy way to create alternate backup schedules.
For example, you can use a command similar to:

```bash
velero create schedule thrice-daily --schedule="@every 8h"
```

To change the default backup service settings:

1.  Check the backup schedules currently configured for the cluster by running the following command:

    ```bash
    velero get schedules
    ```

1.  Delete the `velero-kubeaddons-default` schedule by running the following command:

    ```bash
    velero delete schedule velero-kubeaddons-default
    ```

1.  Replace the default schedule with your custom settings by running the following command:

    ```bash
    velero create schedule velero-kubeaddons-default --schedule="@every 24h"
    ```

You can also create backup schedules for specific namespaces.
Creating a backup for a specific namespace can be useful for clusters running multiple apps operated by multiple teams.
For example:

```bash
velero create schedule system-critical --include-namespaces=kube-system,kube-public,kubeaddons --schedule="@every 24h"
```

The Velero command line interface provides many more options worth exploring. You can also find tutorials for [disaster recovery][velero-dr] and [cluster migration][velero-cm] on the Velero community site.

### Back up on demand

In some cases, you might find it necessary create a backup outside of the regularly-scheduled interval.
For example, if you are preparing to upgrade any components or modify your cluster configuration, you should perform a backup immediately before taking that action.

Create a backup by running the following command:

```bash
velero backup create BACKUP_NAME
```

### Restore a cluster

Before attempting to restore the cluster state using the Velero command-line interface, you should verify the following requirements:

<!-- vale Microsoft.Avoid = NO -->
- The backend storage, MinIO, is still operational.
<!-- vale Microsoft.Avoid = YES -->
- The Velero platform service in the cluster is still operational.
- The Velero platform service is set to a `restore-only-mode` to avoid having backups run while restoring.

To list the available backup archives for your cluster, run the following command:

```bash
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

Then you can apply the configuration change by running:

```shell
konvoy deploy addons -y
```

Finally, check your deployment to verify that the configuration change was applied correctly:

```shell
helm get values -n kommander velero
```

To restore cluster data on demand from a selected backup snapshot available in the cluster, run a command similar to the following:

```shell
velero restore create --from-backup BACKUP_NAME
```

## Backup service diagnostics

You can check whether the Velero service is currently running on your cluster through the operations portal, or by running the following `kubectl` command:

```bash
kubectl get all -n velero
```

If the Velero platform service addon is currently running, you can generate diagnostic information about Velero backup and restore operations.
For example, you can run the following commands to retrieve, back up, and restore information that you can use to assess the overall health of Velero in your cluster:

```bash
velero get schedules
velero get backups
velero get restores
velero get backup-locations
velero get snapshot-locations
```

[backup-on-demand]: #back-up-on-demand
[kubeaddons]: https://github.com/mesosphere/kubernetes-base-addons
[minio]: https://velero.io/docs/v1.0.0/get-started/
[releases]: https://github.com/heptio/velero/releases
[restore-a-cluster]: #restore-a-cluster
[set-schedule]: #set-a-backup-schedule
[velero-cli-install]: https://velero.io/docs/v1.5/basic-install/#install-the-cli
[velero-cm]: https://velero.io/docs/v0.11.0/migration-case
[velero-dr]: https://velero.io/docs/v0.11.0/disaster-case
[velero-get-started]: https://velero.io/docs/v0.11.0/get-started
[velero-troubleshooting]: https://velero.io/docs/v0.11.0/debugging-install
[konvoy-backup]: /dkp/konvoy/latest/backup/
