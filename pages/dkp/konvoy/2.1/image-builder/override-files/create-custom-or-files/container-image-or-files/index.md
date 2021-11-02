---
layout: layout.pug
navigationTitle: Container image override files
title: Container image override files
excerpt: Container image override files
beta: true
enterprise: false
menuWeight: 95
---

Your AMI uses a container image. The Ansible playbooks pull a minimal set of [container images](https://github.com/mesosphere/konvoy-image-builder/blob/main/ansible/roles/images/defaults/main.yaml) for use. You can add or delete additional images by specifying an `override` file for the `extra_images` variable. Konvoy requires several additional images be present. Create a new override file and specify the following `extra_images`:

```yaml
# Example override-images.yaml
---
extra_images:
  - docker.io/mesosphere/cluster-api-preprovisioned-controller:v0.2.1
  - gcr.io/kubebuilder/kube-rbac-proxy:v0.8.0
  - k8s.gcr.io/cluster-api-aws/cluster-api-aws-controller:v0.7.0
  - k8s.gcr.io/cluster-api/cluster-api-controller:v0.4.4
  - k8s.gcr.io/cluster-api/kubeadm-bootstrap-controller:v0.4.4
  - k8s.gcr.io/cluster-api/kubeadm-control-plane-controller:v0.4.4
  - mcr.microsoft.com/oss/azure/aad-pod-identity/nmi:v1.8.0
  - quay.io/jetstack/cert-manager-cainjector:v1.5.3
  - quay.io/jetstack/cert-manager-controller:v1.5.3
  - quay.io/jetstack/cert-manager-webhook:v1.5.3
  - us.gcr.io/k8s-artifacts-prod/cluster-api-azure/cluster-api-azure-controller:v0.5.3
  - k8s.gcr.io/provider-aws/aws-ebs-csi-driver:v1.4.0
  - k8s.gcr.io/sig-storage/csi-attacher:v3.1.0
  - k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.1.0
  - k8s.gcr.io/sig-storage/csi-provisioner:v2.1.1
  - k8s.gcr.io/sig-storage/csi-resizer:v1.1.0
  - k8s.gcr.io/sig-storage/csi-snapshotter:v3.0.3
  - k8s.gcr.io/sig-storage/livenessprobe:v2.2.0
  - k8s.gcr.io/sig-storage/snapshot-controller:v4.2.0
  - quay.io/external_storage/local-volume-provisioner:v2.4.0
  - calico/cni:v3.20.2
  - calico/kube-controllers:v3.20.2
  - calico/node:v3.20.2
  - calico/pod2daemon-flexvol:v3.20.2
  - calico/typha:v3.20.2
  - quay.io/tigera/operator:v1.20.4
  - bitnami/kubectl:1.21.3
  - us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.21.0
  - k8s.gcr.io/nfd/node-feature-discovery:v0.8.2
  - nvcr.io/nvidia/gpu-feature-discovery:v0.4.1
  - busybox:1
  - mesosphere/pause-alpine:3.2
  - mesosphere/dkp-diagnostics-node-collector:v0.3.2
```
