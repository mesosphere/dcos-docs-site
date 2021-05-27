---
layout: layout.pug
navigationTitle: Configure Driver
title: Configure Driver
menuWeight: 30
excerpt: Configure the AWS EBS CSI driver
beta: true
enterprise: false
---

## Configure the AWS EBS CSI driver

1.  Create a `StorageClass` for the EBS CSI driver:

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
