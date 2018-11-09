---
layout: layout.pug
navigationTitle: Disaster Recovery
title: Disaster Recovery
menuWeight: 80
excerpt: Backing up and restoring a Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# 灾难恢复

此功能允许您进行备份，如果发生灾难，可以还原 Kubernetes 群集。在创建备份时，群集的状态包括包服务配置和任何现有 Kubernetes 资源。您可以通过两个`dcos kubernetes` 子命令来使用此功能： `restore` 和 `backup`。

现在，备份工件存储在 AWS S3 bucket 中。因此，必须安装 AWS CLI 并且需要执行一些步骤。

1. 创建 IAM 用户：

  ```
  aws iam create-user --user-name heptio-ark.
  ```

2. 附上政策以为 `heptio-ark` 用户提供必需的权限：

  ```
  aws iam attach-user-policy \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
    --user-name heptio-ark

  aws iam attach-user-policy \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess \
    --user-name heptio-ark
  ```

3. 为用户创建访问密钥：
  ```
  aws iam create-access-key --user-name heptio-ark
  ```

## 备份群集

要备份您的群集，请使用 `dcos kubernetes backup` 命令：

```
usage: dcos kubernetes backup [<flags>]

Flags:
  -h, --help                            Show context-sensitive help.
  -v, --verbose                         Enable extra logging of requests/responses
      --name="kubernetes"               Name of the service instance to query
      --aws-secret-access-key=""        AWS secret access key
      --aws-access-key-id=""            AWS access key id
      --aws-region=""                   AWS S3 region
      --aws-bucket=""                   AWS bucket name
      --backup-ttl=720h                 How long before backup can be garbage collected
      --timeout=1200s                   Maximum time to wait for the backup process to complete
```

标签 `--aws-region`、`--aws-bucket`、`--aws-access-key-id` 和 `--aws-secret-access-key` 为必须。

```
$ dcos kubernetes backup --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
 Backup creation: [COMPLETE]
Backup has been successfully created!
```

**重要信息：** 此包不管理 S3 bucket，因此您应监控其使用情况。

## 恢复群集

子命令 `restore` 从 S3 检索备份工件，并将保存的状态导入到
新配置的群集。

```
usage: dcos kubernetes restore [<flags>]

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

标签 `--aws-region`、`--aws-bucket`、`--aws-access-key-id` 和 `--aws-secret-access-key` 为必须。

```
$ dcos kubernetes restore --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
 Backup restore: [COMPLETE]
Backup successfully restored!
```

## 如何进行测试？

1. 在运行中的 Kubernetes 群集上，部署几个 pod：

```shell
$ kubectl create -f ./artifacts/nginx/nginx-deployment.yaml
```

```shell
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                READY     STATUS    RESTARTS   AGE
default       nginx-6c54bd5869-pt62l              1/1       Running   0          39s
default       nginx-6c54bd5869-xt82y              1/1       Running   0          39s
```

2. 创建群集备份：

```shell
$ dcos kubernetes backup --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
```

3. 删除之前创建的部署：

```shell
$  kubectl delete -f ./artifacts/nginx/nginx-deployment.yaml
```

4. 恢复备份并验证 pod 是否再次运行：

```shell
$ dcos kubernetes restore --aws-region=us-east1-d --aws-bucket=my_bucket --aws-access-key-id=ABC --aws-secret-access-key=XYZ
```
