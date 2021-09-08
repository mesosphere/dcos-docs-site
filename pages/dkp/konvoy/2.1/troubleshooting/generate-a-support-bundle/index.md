---
layout: layout.pug
navigationTitle: Generate a Support Bundle
title: Generate a Support Bundle
excerpt: Generate a Support Bundle
beta: false
enterprise: false
menuWeight: 10
---

Follow thse instructions to generate a support bundle with data collected for the last 48 hours of the life of the cluster.

## Prerequisites

Before generating a support bundle, verify that you have:

- An AMD64-based Linux or MacOS machine with a supported version of the operating system.
- A running Kubernetes cluster.
- `troubleshoot.sh` for [MacOS][troubleshoot-darwin] or [Linux][[troubleshoot-linux] for collecting the support bundle.

## Download troubleshoot.sh

1.  To download and extract the `troubleshoot.sh` binary for [MacOS][troubleshoot-darwin] or [Linux][[troubleshoot-linux]

    For Linux:

    ```sh
    mkdir support-bundle && curl -sL https://github.com/replicatedhq/troubleshoot/releases/download/v0.13.7/support-bundle_linux_amd64.tar.gz | tar -xz -C ./support-bundle/
    ```

    For MacOS:

    ```sh
    mkdir support-bundle && curl -sL https://github.com/replicatedhq/troubleshoot/releases/download/v0.13.7/support-bundle_darwin_amd64.tar.gz | tar -xz -C ./support-bundle/
    ```

1.  Add the binary to your PATH:

    ```sh
    export PATH=./support-bundle/:$PATH
    ```

1.  Verify the binary works:

    ```sh
    support-bundle version
    ```

## Create a SupportBundle manifest

`Troubleshoot.sh` supports [multiple support bundle collectors][troubleshoot-collectors] and
can be configured as a `SupportBundle` Kubernetes resource in a yaml file.

The following list is the minimum set of resources that is required to debug a cluster, but can be further customized.

The bundle uses the following collectors:

- [clusterInfo][clusterInfo-collector] collects basic information about the cluster
- [clusterResources][clusterResources-collector] collects a subset of available resources in the cluster
- [configMap][configMap-collector] collects the values of Kubernetes ConfigMaps
- [logs][logs-collector] collects logs (stdout and stderr) from pods in specified namespaces
- [copyFromHost][copyFromHost-collector] collects certain files and directories from the cluster hosts
- [exec][exec-collector] used to collect etcd status from running the etcd pods in the cluster

### Collect information from a bootstrap cluster

If you have not yet created a Kubernetes cluster and are trying to collect information from the bootstrap cluster,
run the following command to generate `bundle.yaml` that defines the resources to collect.

```sh
cat > bundle.yaml <<EOF
apiVersion: troubleshoot.sh/v1beta2
kind: SupportBundle
metadata:
  name: dkp-bootstrap-bundle
spec:
  collectors:
    - clusterInfo: {}
    - clusterResources: {}
    #====================CONFIGMAPS====================#
    - configMap:
        namespace: default
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: kube-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: capi-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: capi-kubeadm-bootstrap-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: capi-kubeadm-control-plane-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: capa-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: cappp-system
        selector: [""]
        includeAllData: true
    - configMap:
        namespace: cert-manager
        selector: [""]
        includeAllData: true
    #====================PODS LOGS====================#
    - logs:
        namespace: default
        name: pod-logs/default
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: kube-system
        name: pod-logs/kube-system
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: capi-system
        name: pod-logs/cap*
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: capi-kubeadm-bootstrap-system
        name: pod-logs/cap*
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: capi-kubeadm-control-plane-system
        name: pod-logs/cap*
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: capa-system
        name: pod-logs/cap*
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: cappp-system
        name: pod-logs/cap*
        limits:
          maxAge: 48h
          maxLines: 100000
    - logs:
        namespace: cert-manager
        name: pod-logs/cert-manager
        limits:
          maxAge: 48h
          maxLines: 100000
EOF
```

### Collect information from a workload cluster

If you have created a Kubernetes cluster and have access to its Kuberntes API Server,
run the following command to generate `bundle.yaml` that defines the resources to collect.

```sh
cat > bundle.yaml <<EOF
apiVersion: troubleshoot.sh/v1beta2
kind: SupportBundle
metadata:
  name: dkp-workload-bundle
spec:
  collectors:
    - clusterInfo: {}
    - clusterResources: {}
    #====================CONFIGMAPS====================#
    - configMap:
        namespace: ""
        selector: [""]
        includeAllData: true
    #====================PODS LOGS====================#
    - logs:
        selector: []
        namespace: ""
        name: pod-logs
        limits:
          maxAge: 48h
          maxLines: 100000
    #====================HOST FILES====================#
    - copyFromHost:
        collectorName: "copy os-release"
        name: host-files/etc_os-release
        image: busybox:1
        hostPath: "/etc/os-release"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy resolv.conf"
        name: host-files/etc_resolv.conf
        image: busybox:1
        hostPath: "/etc/resolv.conf"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy /var/log/messages"
        name: host-files/var_log_messages
        image: busybox:1
        hostPath: "/var/log/messages"
        extractArchive: false
    - copyFromHost:
        collectorName: "copy dmesg"
        name: host-files/var_log_dmesg
        image: busybox:1
        hostPath: "/var/log/dmesg"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy pci devices"
        name: host-files/proc_bus_pci_devices
        image: busybox:1
        hostPath: "/proc/bus/pci/devices"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy containerd config"
        name: host-files/etc_containerd_config.toml
        image: busybox:1
        hostPath: "/etc/containerd/config.toml"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy nvidia container runtime config"
        name: host-files/etc_nvidia-container-runtime_config.toml
        image: busybox:1
        hostPath: "/etc/nvidia-container-runtime/config.toml"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy containerd systemd dropin"
        name: host-files/etc_systemd_system_containerd.service.d
        image: busybox:1
        hostPath: "/etc/systemd/system/containerd.service.d/"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy kubelet systemd dropin"
        name: host-files/etc_systemd_system_containerd.service.d
        image: busybox:1
        hostPath: "/etc/systemd/system/kubelet.service.d/"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy kube-apiserver audit logs"
        name: host-files/var_log_audit_kube-apiserver-audit.log
        image: busybox:1
        hostPath: "/var/log/audit/kube-apiserver-audit.log"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy /var/lib/kubelet/config.yaml"
        name: host-files/var_lib_kubelet_config.yaml
        image: busybox:1
        hostPath: "/var/lib/kubelet/config.yaml"
        extractArchive: true
    - copyFromHost:
        collectorName: "copy /var/lib/kubelet/kubeadm-flags.env"
        name: host-files/var_lib_kubelet_kubeadm-flags.env
        image: busybox:1
        hostPath: "/var/lib/kubelet/kubeadm-flags.env"
        extractArchive: true
    #====================ETCD DATA====================#
    - exec:
        # collect etcd member list
        name: etcd
        collectorName: member-list
        selector:
        - component=etcd
        namespace: kube-system
        command: ["etcdctl"]
        args: ["--cert=/etc/kubernetes/pki/etcd/server.crt", "--key=/etc/kubernetes/pki/etcd/server.key", "--cacert=/etc/kubernetes/pki/etcd/ca.crt", "--endpoints=https://127.0.0.1:2379", "member", "list", "-w", "json"]
    - exec:
        # collect etcd endpoint status
        name: etcd
        collectorName: endpoint-status
        selector:
        - component=etcd
        namespace: kube-system
        command: ["etcdctl"]
        args: ["--cert=/etc/kubernetes/pki/etcd/server.crt", "--key=/etc/kubernetes/pki/etcd/server.key", "--cacert=/etc/kubernetes/pki/etcd/ca.crt", "--endpoints=https://127.0.0.1:2379", "endpoint", "status", "--cluster", "-w", "json"]
    - exec:
        # collect etcd endpoint health
        name: etcd
        collectorName: endpoint-health
        selector:
        - component=etcd
        namespace: kube-system
        command: ["etcdctl"]
        args: ["--cert=/etc/kubernetes/pki/etcd/server.crt", "--key=/etc/kubernetes/pki/etcd/server.key", "--cacert=/etc/kubernetes/pki/etcd/ca.crt", "--endpoints=https://127.0.0.1:2379", "endpoint", "health", "--cluster", "-w", "json"]
    - exec:
        # collect etcd alarm list
        name: etcd
        collectorName: alarm-list
        selector:
        - component=etcd
        namespace: kube-system
        command: ["etcdctl"]
        args: ["--cert=/etc/kubernetes/pki/etcd/server.crt", "--key=/etc/kubernetes/pki/etcd/server.key", "--cacert=/etc/kubernetes/pki/etcd/ca.crt", "--endpoints=https://127.0.0.1:2379", "alarm", "list"]
EOF
```

## Generate a Support Bundle

To generate the support bundle:

1.  Run the `support-bundle` command with the `SupportBundle` spec file from the previous step.

    ```sh
    support-bundle bundle.yaml
    ```

    ```sh
    Collecting support bundle ...

    support-bundle-2021-08-13T14_44_23.tar.gz --redact=false
    ```

1.  To view its contents extract the bundle (replacing `support-bundle-2021-08-13T14_44_23.tar.gz` with the location from the previous step):

    ```sh
    tar -xzvf support-bundle-2021-08-13T14_44_23.tar.gz
    ```

1.  You will see a new directory support-bundle-... that contains the files as specified in `bundle.yaml`:

    ```sh
    ls support-bundle-2021-08-13T14_44_23
    ```

    ```txt
    cluster-info      cluster-resources configmaps        etcd              host-files        pod-logs          version.yaml
    ```

## Collect information about custom resources

`troubleshoot.sh` does not support collection of custom resources. To collect these, run the following command
(depending on the cluster size and the running workloads, this operation may take up to 5 minutes):

```sh
echo $(#!/usr/bin/env bash
set -euo pipefail

OUTDIR="CRDs"
mkdir -p "${OUTDIR}"

clusterkinds=($(kubectl get customresourcedefinitions -o=jsonpath='{range .items[?(@.spec.scope=="Cluster")]}{.spec.names.kind}{"."}{.spec.group}{" "}{end}'))
namespacedkinds=($(kubectl get customresourcedefinitions -o=jsonpath='{range .items[?(@.spec.scope=="Namespaced")]}{.spec.names.kind}{"."}{.spec.group}{" "}{end}'))

IFS=','
echo "Saving ${#clusterkinds[@]} kinds of cluster resources"
kubectl get "${clusterkinds[*]}" --output=jsonpath='{range .items[*]}{.kind}{"\t"}{@}{"\n"}{end}' | while read -r i; do
  kind=$(cut -f1 <<< "$i")
  > "${OUTDIR}/${kind}.json" cut -f2 <<< "$i"
done

echo "Saving ${#namespacedkinds[@]} kinds of namespaced resources"
kubectl get "${namespacedkinds[*]}" --all-namespaces --output=jsonpath='{range .items[*]}{.metadata.namespace}{"/"}{.kind}{"\t"}{@}{"\n"}{end}' | while read -r i; do
  nskind=$(cut -f1 <<< "$i")
  mkdir -p "${OUTDIR}/${nskind%/*}"
  > "${OUTDIR}/${nskind}.json" cut -f2 <<< "$i"
done
)
```

[troubleshoot-darwin]: https://github.com/replicatedhq/troubleshoot/releases/download/v0.13.7/support-bundle_darwin_amd64.tar.gz
[troubleshoot-linux]: https://github.com/replicatedhq/troubleshoot/releases/download/v0.13.7/support-bundle_linux_amd64.tar.gz
[troubleshoot-collectors]: https://troubleshoot.sh/docs/collect/all/
[clusterInfo-collector]: https://troubleshoot.sh/docs/collect/cluster-info/
[clusterResources-collector]: https://troubleshoot.sh/docs/collect/cluster-resources/
[configMap-collector]: https://troubleshoot.sh/docs/collect/configmap/
[logs-collector]: https://troubleshoot.sh/docs/collect/logs/
[copyFromHost-collector]: https://troubleshoot.sh/docs/collect/copy-from-host/
[exec-collector]: https://troubleshoot.sh/docs/collect/exec/
