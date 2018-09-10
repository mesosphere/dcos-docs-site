---
layout: layout.pug
navigationTitle: Disaster Recovery
title: Disaster Recovery
menuWeight: 80
excerpt: Backing up and restoring a Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Disaster Recovery

This feature allows you to back up and restore a Kubernetes cluster, in case of disaster.
The state of the cluster comprises the package service configuration and any existing
Kubernetes resources when the backup is performed.

You can use this feature by means of two `dcos beta-kubernetes` subcommands: `restore` and `backup`.

For the time being, the backup artifacts are stored in an AWS S3 bucket. Therefore, the AWS CLI
must be installed and some steps need to be fulfilled.

1. Create an IAM user:

  ```
  aws iam create-user --user-name heptio-ark
  ```

2. Attach a policy to give `heptio-ark` user the necessary permissions:

  ```
  aws iam attach-user-policy \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
    --user-name heptio-ark

  aws iam attach-user-policy \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess \
    --user-name heptio-ark
  ```

3. Create an access key for the user:
  ```
  aws iam create-access-key --user-name heptio-ark
  ```

## Back up the cluster
The subcommand `backup` saves the backup artifacts to a specified location. Here is the command list and flags. Note that the flags `--aws-region`, `--aws-bucket`, `--aws-access-key-id` and `--aws-secret-access-key` are mandatory.

  ```
  usage: dcos beta-kubernetes backup [<flags>]

  Flags:
    -h, --help                            Show context-sensitive help.
    -v, --verbose                         Enable extra logging of requests/responses
        --name="kubernetes"               Name of the service instance to query
        --aws-secret-access-key=""        AWS secret access key
        --aws-access-key-id=""            AWS access key id
        --aws-region=""                   AWS S3 region
        --aws-bucket=""                   AWS bucket name
        --backup-name="kubernetes-backup" The name of the backup
        --ttl=300s                        Maximum time (in seconds) to wait for the backup process completion
  ```

Example:

  ```
  $ dcos beta-kubernetes backup --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
   Backup creation: [COMPLETE]
  Backup has been successfully created!
  ```

**Warning:** This package does not manage S3 buckets, so its usage should be monitored by the user.

## Restore the cluster

The subcommand `restore` retrieves the backup artifacts from S3 and imports the saved state into a newly
provisioned cluster.

```
usage: dcos beta-kubernetes restore [<flags>]

Flags:
  -h, --help                            Show context-sensitive help.
  -v, --verbose                         Enable extra logging of requests/responses
      --name="kubernetes"               Name of the service instance to query
      --aws-secret-access-key=""        AWS secret access key
      --aws-access-key-id=""            AWS access key id
      --aws-region=""                   AWS S3 region
      --aws-bucket=""                   AWS bucket name
      --backup-name="kubernetes-backup" The name of the backup
      --timeout=1200s                   Maximum time to wait for the restore process completion
      --yes                             Disable interactive mode and assume "yes" is the answer to all prompts
```

The flags `--aws-region`, `--aws-bucket`, `--aws-access-key-id` and `--aws-secret-access-key` are mandatory.

```
$ dcos beta-kubernetes restore --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
 Backup restore: [COMPLETE]
Backup successfully restored!
```

## How to test it?

On a running Kubernetes cluster, deploy a couple pods:

```
$ kubectl create -f ./artifacts/nginx/nginx-deployment.yaml
```

```
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                READY     STATUS    RESTARTS   AGE
default       nginx-6c54bd5869-pt62l   1/1       Running   0          39s
default       nginx-6c54bd5869-xt82y   1/1       Running   0          39s
```

Then, proceed to create backup of the cluster:

```
$ dcos beta-kubernetes backup --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
```

Next, delete the deployment that was previously created:

```
$  kubectl delete -f ./artifacts/nginx/nginx-deployment.yaml
```

Finally, restore the backup and verify that the pods are running again:

```
$ dcos beta-kubernetes restore --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
```
