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

1. Create an IAM user; we will use the name `heptio-ark`:

    ```shell
    aws iam create-user --user-name heptio-ark
    ```

1. Attach a policy to give `heptio-ark` user the necessary permissions:

    ```shell
    aws iam attach-user-policy \
      --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
      --user-name heptio-ark

    aws iam attach-user-policy \
      --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess \
      --user-name heptio-ark
    ```

1. Create an access key for the user `heptio-ark`:

    ```shell
    aws iam create-access-key --user-name heptio-ark
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
