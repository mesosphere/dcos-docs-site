---
layout: layout.pug
navigationTitle: Create AMI
title: Create AMI with Konvoy Image Builder
menuWeight: 10
excerpt: Review OS compatibilities and download the air-gapped bundles.
beta: false
enterprise: false
---
### Create AMI

Use Konvoy Image Builder to create an Amazon Machine Image (AMI) based on the desired OS included in the air-gapped bundle.

1.  Unpack the Konvoy Image Builder within the air-gapped bundle.

    ```bash
    curl -OL https://github.com/mesosphere/konvoy-image-builder/releases/download/v1.5.0-rc.3/konvoy-image-bundle-v1.5.0-rc.3_linux_amd64.tar.gz

    tar -xvf konvoy-image-bundle-v1.5.0-rc.3_linux_amd64.tar.gz
    ```

1.  Set the following overrides and AWS server regions.

    <p class="message--important"><strong>IMPORTANT: </strong>The following usernames and IDs are samples, enter your identification into the appropriate fields where applicable.</p>

    ```bash
    cat <EOF> overrides/custom.yaml
    packer:
      ssh_username: "maintuser"
      volume_size: "250"
      # Optional VPC ID
      # vpc_id: vpc-058da8b5f1fcb1369
      #Optional Subnet ID
      # subnet_id: subnet-052653ab52e5773f0

    EOF
    ```

    ```bash
    cat <EOF> overrides/images.yaml
    ---
    extra_images:
      - docker.io/mesosphere/cluster-api-aws-controller:v0.7.1-d2iq.0
      - docker.io/mesosphere/cluster-api-preprovisioned-controller:v0.4.0
      - gcr.io/kubebuilder/kube-rbac-proxy:v0.8.0
      - k8s.gcr.io/cluster-api/cluster-api-controller:v0.4.4
      - k8s.gcr.io/cluster-api/kubeadm-bootstrap-controller:v0.4.4
      - k8s.gcr.io/cluster-api/kubeadm-control-plane-controller:v0.4.4
      - mcr.microsoft.com/oss/azure/aad-pod-identity/nmi:v1.8.5
      - quay.io/jetstack/cert-manager-cainjector:v1.5.3
      - quay.io/jetstack/cert-manager-controller:v1.5.3
      - quay.io/jetstack/cert-manager-webhook:v1.5.3
      - us.gcr.io/k8s-artifacts-prod/cluster-api-azure/cluster-api-azure-controller:v0.5.3
      - docker.io/mesosphere/konvoy-image-builder:v1.5.0-rc.2
      - docker.io/plndr/kube-vip:v0.3.7
      - k8s.gcr.io/provider-aws/aws-ebs-csi-driver:v1.4.0
      - k8s.gcr.io/sig-storage/csi-attacher:v3.1.0
      - k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.1.0
      - k8s.gcr.io/sig-storage/csi-provisioner:v2.1.1
      - k8s.gcr.io/sig-storage/csi-resizer:v1.1.0
      - k8s.gcr.io/sig-storage/csi-snapshotter:v3.0.3
      - k8s.gcr.io/sig-storage/livenessprobe:v2.2.0
      - k8s.gcr.io/sig-storage/snapshot-controller:v4.2.0
      - mcr.microsoft.com/k8s/csi/azuredisk-csi:v1.8.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-attacher:v3.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-node-driver-registrar:v2.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-provisioner:v2.2.2
      - mcr.microsoft.com/oss/kubernetes-csi/csi-resizer:v1.3.0
      - mcr.microsoft.com/oss/kubernetes-csi/csi-snapshotter:v3.0.3
      - mcr.microsoft.com/oss/kubernetes-csi/livenessprobe:v2.4.0
      - quay.io/external_storage/local-volume-provisioner:v2.4.0
      - docker.io/calico/cni:v3.20.2
      - docker.io/calico/kube-controllers:v3.20.2
      - docker.io/calico/node:v3.20.2
      - docker.io/calico/pod2daemon-flexvol:v3.20.2
      - docker.io/calico/typha:v3.20.2
      - quay.io/tigera/operator:v1.20.4
      - docker.io/bitnami/kubectl:1.21.6
      - us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.21.0
      - k8s.gcr.io/nfd/node-feature-discovery:v0.8.2
      - nvcr.io/nvidia/gpu-feature-discovery:v0.4.1
      - docker.io/library/busybox:1
      - docker.io/mesosphere/pause-alpine:3.2
      - docker.io/mesosphere/dkp-diagnostics-node-collector:v0.3.3
    ```

    ```bash
     konvoy-image build --ami-regions us-west-1,us-east-1 --region us-east-1 --source-ami ami-092e75227e47facfc --overrides overrides/custom.yaml --overrides overrides/images.yaml images/ami/centos-7.yaml

    ```

Then, create your bootstrap cluster.
