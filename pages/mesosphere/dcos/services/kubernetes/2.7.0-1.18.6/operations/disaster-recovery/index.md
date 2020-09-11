---
layout: layout.pug
navigationTitle: Disaster Recovery
title: Disaster Recovery
menuWeight: 80
excerpt: Backing up and restoring a Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

This section describes how to back up and restore a Kubernetes cluster in case of a disaster. The state of the cluster  comprises the package service configuration and any Kubernetes resources that exist when the backup is performed.

# Prerequisites

For the time being, the backup artifacts are stored in an AWS S3 bucket. Therefore, the AWS CLI must be installed and the following steps need to be completed before backing up the cluster:

1. Create an IAM user; we will use the name `velero`:

    ```shell
    aws iam create-user --user-name velero
    ```

1. Attach a policy to give `velero` user the necessary permissions:

    ```shell
    aws iam attach-user-policy \
      --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
      --user-name velero

    aws iam attach-user-policy \
      --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess \
      --user-name velero
    ```

1. Create an access key for the user `velero`:

    ```shell
    aws iam create-access-key --user-name velero
    ```

# Disaster Recovery

You will use the command `dcos kubernetes cluster` to create a backup of your deployment, and if necessary, to restore it. The command `dcos kubernetes cluster` has two subcommands: `backup` and `restore`.

## Back up the cluster

Using the credentials established in the previous step, use `dcos kubernetes cluster backup` to start the backup process. Note that the flags `--aws-region`, `--aws-bucket`, `--aws-access-key-id` and `--aws-secret-access-key` are mandatory.

```
usage: dcos kubernetes cluster backup --cluster-name=CLUSTER-NAME [<flags>]

Flags:
  -h, --help                  Show context-sensitive help.
  -v, --verbose               Enable extra logging of requests/responses
      --version               Show application version.
      --cluster-name=CLUSTER-NAME
                              Name of the Kubernetes cluster
      --aws-secret-access-key=""
                              AWS secret access key
      --aws-access-key-id=""  AWS access key id
      --aws-region=""         AWS S3 region
      --aws-bucket=""         AWS S3 bucket name
      --backup-name="kubernetes-backup"
                              Name for the backup
      --backup-ttl=720h       How long before backup can be garbage collected
      --timeout=1200s         Maximum time to wait for the backup process to complete
```


```shell
$ dcos kubernetes cluster backup --cluster-name=CLUSTER-NAME --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
 Backup creation: [COMPLETE]
Backup has been successfully created!
```

<p class="message--important"><strong>IMPORTANT: </strong> This command does not manage S3 buckets, so its usage should be monitored by you.</p>

## View backup log messages

To diagnose a failed MKE cluster backup, you can view the log files for the Kubernetes pod that was launched to perform the backup. Use these steps:

1. While the "dcos kubernetes cluster backup" command is running, get the pod id of the pod that is trying to do the ark backup.

```shell
$ kubectl get pods -n heptio-ark
```

2. Check the log file of the running `heptio-ark` pod that is attempting to do the backup. Use this command and replace `<pod-id>` with the pod id given by the previous command.

```shell
$ kubectl logs -f -n heptio-ark <pod-id>
```

The `-f` option will "follow" the log file thus you will see all the messages, including any error messages that help determine the cause of the backup failure.

## Remove backup entries

If you no longer need a backup entry, you can remove it of the Kubernetes cluster with the following steps.

1. Get a list of heptio-ark kubernetes cluster backups:

```shell
$ kubectl get backup.ark.heptio.com -n heptio-ark
```

2. Delete the heptio-ark backup entry, replace `<backup-id>` with one of the backup names listed with the previous command:

```shell
$ kubectl delete -n heptio-ark backup.ark.heptio.com <backup-id>
```

3. Use the AWS S3 console to remove the s3 bucket that stored the backup content:

```shell
$ aws s3 rm --recursive s3://<bucket-for-backups>/<backup-id>
```

## Restore the cluster

The subcommand `restore` retrieves the backup artifacts from S3 and imports the saved state into a newly provisioned cluster. The flags `--aws-region`, `--aws-bucket`, `--aws-access-key-id` and `--aws-secret-access-key` are mandatory.


```
usage: dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME [<flags>]

Flags:
  -h, --help                  Show context-sensitive help.
  -v, --verbose               Enable extra logging of requests/responses
      --version               Show application version.
      --cluster-name=CLUSTER-NAME
                              Name of the Kubernetes cluster
      --aws-secret-access-key=""
                              AWS secret access key
      --aws-access-key-id=""  AWS access key id
      --aws-region=""         AWS S3 region
      --aws-bucket=""         AWS S3 bucket name
      --backup-name="kubernetes-backup"
                              Name of the backup to restore
      --timeout=1200s         Maximum time to wait for the backup process to complete
      --yes                   Disable interactive mode and assume "yes" is the answer to all prompts
```


```shell
$ dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
 Backup restore: [COMPLETE]
Backup successfully restored!
```

# Verify

1. On a running Kubernetes cluster, deploy a couple of pods:
    ```shell
    kubectl create -f ./artifacts/nginx/nginx-deployment.yaml
    ```

    ```shell
    $ kubectl get pods --all-namespaces
    NAMESPACE     NAME                                READY     STATUS    RESTARTS   AGE
    (...)
    default       nginx-6c54bd5869-pt62l   1/1       Running   0          39s
    default       nginx-6c54bd5869-xt82y   1/1       Running   0          39s
    ```
1. Create a backup of the cluster:
    ```shell
    $ dcos kubernetes cluster backup --cluster-name=CLUSTER-NAME --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
    ```
1. Delete the deployment that was previously created:
    ```shell
    kubectl delete -f ./artifacts/nginx/nginx-deployment.yaml
    ```
1. Restore the backup and verify that the pods are running again:
    ```shell
    $ dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
    ```
