---
layout: layout.pug
navigationTitle: Container image override files
title: Container image override files
excerpt: Container image override files
beta: false
enterprise: false
menuWeight: 95
---

Your AMI uses a container image. The Ansible playbooks pull a minimal set of [container images](https://github.com/mesosphere/konvoy-image-builder/blob/main/ansible/roles/images/defaults/main.yaml) for use. You can add or delete additional images by specifying an `override` file for the `extra_images` variable. Konvoy requires several additional images be present. Create a new override file and specify the following `extra_images`:

```yaml
# Example override-images.yaml
---
extra_images:
  - docker.io/mesosphere/cluster-api-aws-controller:v1.4.0-d2iq.0-rc1
  - docker.io/mesosphere/cluster-api-controller:v1.1.3-d2iq.3
  - docker.io/mesosphere/cluster-api-preprovisioned-controller:v0.6.2
  - docker.io/mesosphere/kubeadm-bootstrap-controller:v1.1.3-d2iq.3
  - docker.io/mesosphere/kubeadm-control-plane-controller:v1.1.3-d2iq.3
  - gcr.io/cluster-api-provider-vsphere/release/manager:v1.1.1
  - mcr.microsoft.com/oss/azure/aad-pod-identity/nmi:v1.8.8
  - quay.io/jetstack/cert-manager-cainjector:v1.5.3
  - quay.io/jetstack/cert-manager-controller:v1.5.3
  - quay.io/jetstack/cert-manager-webhook:v1.5.3
  - us.gcr.io/k8s-artifacts-prod/cluster-api-azure/cluster-api-azure-controller:v1.1.1
  - docker.io/mesosphere/konvoy-image-builder:v1.11.0
  - docker.io/plndr/kube-vip:v0.3.7
  - ghcr.io/kube-vip/kube-vip:v0.3.9
  - gcr.io/k8s-staging-sig-storage/snapshot-controller:v5.0.0
  - public.ecr.aws/ebs-csi-driver/aws-ebs-csi-driver:v1.5.1
  - public.ecr.aws/eks-distro/kubernetes-csi/external-attacher:v3.1.0-eks-1-18-13
  - public.ecr.aws/eks-distro/kubernetes-csi/external-provisioner:v2.1.1-eks-1-18-13
  - public.ecr.aws/eks-distro/kubernetes-csi/external-resizer:v1.1.0-eks-1-18-13
  - public.ecr.aws/eks-distro/kubernetes-csi/external-snapshotter/csi-snapshotter:v3.0.3-eks-1-18-13
  - public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe:v2.2.1-eks-1-18-13
  - public.ecr.aws/eks-distro/kubernetes-csi/node-driver-registrar:v2.1.0-eks-1-18-13
  - mcr.microsoft.com/k8s/csi/azuredisk-csi:v1.15.0
  - mcr.microsoft.com/oss/kubernetes-csi/csi-attacher:v3.4.0
  - mcr.microsoft.com/oss/kubernetes-csi/csi-node-driver-registrar:v2.4.0
  - mcr.microsoft.com/oss/kubernetes-csi/csi-provisioner:v3.1.0
  - mcr.microsoft.com/oss/kubernetes-csi/csi-resizer:v1.4.0
  - mcr.microsoft.com/oss/kubernetes-csi/csi-snapshotter:v5.0.1
  - mcr.microsoft.com/oss/kubernetes-csi/livenessprobe:v2.5.0
  - quay.io/external_storage/local-volume-provisioner:v2.4.0
  - gcr.io/cloud-provider-vsphere/csi/release/driver:v2.5.0
  - gcr.io/cloud-provider-vsphere/csi/release/syncer:v2.5.0
  - k8s.gcr.io/sig-storage/csi-attacher:v3.4.0
  - k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.5.0
  - k8s.gcr.io/sig-storage/csi-provisioner:v3.1.0
  - k8s.gcr.io/sig-storage/csi-resizer:v1.4.0
  - k8s.gcr.io/sig-storage/csi-snapshotter:v5.0.1
  - k8s.gcr.io/sig-storage/livenessprobe:v2.6.0
  - gcr.io/cloud-provider-vsphere/cpi/release/manager:v1.22.5
  - docker.io/calico/cni:v3.22.1
  - docker.io/calico/kube-controllers:v3.22.1
  - docker.io/calico/node:v3.22.1
  - docker.io/calico/pod2daemon-flexvol:v3.22.1
  - docker.io/calico/typha:v3.22.1
  - quay.io/tigera/operator:v1.25.3
  - docker.io/bitnami/kubectl:1.23.7
  - us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.23.0
  - k8s.gcr.io/nfd/node-feature-discovery:v0.10.1
  - nvcr.io/nvidia/gpu-feature-discovery:v0.4.1
  - docker.io/library/busybox:1
  - docker.io/mesosphere/pause-busybox:3.2
  - docker.io/mesosphere/dkp-diagnostics-node-collector:v0.4.1
  - docker.io/mesosphere/kfips:v0.2.0
  - k8s.gcr.io/sig-storage/snapshot-validation-webhook:v3.0.2
  - quay.io/metallb/controller:v0.12.1
  - quay.io/metallb/speaker:v0.12.1
  - k8s.gcr.io/kube-proxy:v1.23.7
  - docker.io/mesosphere/kube-proxy:v1.23.7_fips.0
  - k8s.gcr.io/coredns/coredns:v1.8.4
```
