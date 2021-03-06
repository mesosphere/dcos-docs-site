---
layout: layout.pug
navigationTitle: Configure Drivers
title: Configure Drivers
menuWeight: 30
excerpt: Configure drivers that integrate the Kubernetes cluster with its infrastructure
enterprise: false
---

Some cluster features, for example, dynamically provisioned, networked storage, must be configured to work properly. This guide explains how to configure these features.

Before you start, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

## Configure the AWS EBS CSI driver

Create a _StorageClass_ for the [AWS EBS CSI][aws_ebs_csi] driver:

```sh
cat <<EOF | kubectl --kubeconfig=${CLUSTER_NAME}.conf apply -f -
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  csi.storage.k8s.io/fstype: ext4
  type: gp3
EOF
```

```sh
storageclass.storage.k8s.io/ebs-sc created
```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-   Konvoy does not create a default StorageClass. In order to make a `StorageClass` as default, add [the following annotation][defaultstorageclass] to the StorageClass manifest:

     ```yaml
     annotations:
       storageclass.kubernetes.io/is-default-class: "true"
     ```

[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[createnewcluster]: ../new
[defaultstorageclass]: https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/
