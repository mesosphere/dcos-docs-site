---
layout: layout.pug
navigationTitle: konvoy diagnose
title: konvoy diagnose
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
excerpt: Creates a diagnostics bundle of the cluster
---

## konvoy diagnose

Creates a diagnostics bundle of the cluster

### Synopsis

Creates a diagnostics bundle of the cluster in the form of a gzipped tar archive. The bundle contains information about the current state of the cluster, for example, log files, networking parameters, and pod status, to assist in diagnosing issues.

```
konvoy diagnose [flags]
```

### Options

```
      --cluster-name string       name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                      help for diagnose
      --include-pod-log-dirs      include the directories with the pod logs allocated in the node
      --include-secrets           include the values of secrets, WARNING the secrets will be plaintext in the bundle
      --logs-all-namespaces       include logs from pods in all namespaces
      --logs-namespaces strings   include logs from pods in the given namespaces (default [cert-manager,dispatch,istio-system,kommander,kommander-system,konvoy,kube-node-lease,kube-public,kube-system,kubeaddons,kubeaddons-flagger,kubecost,kudo-system,tekton-pipelines,velero])
  -o, --output string             file name to use for storing the diagnostics bundle in (default "/src/github.com/mesosphere/konvoy/20200324T181518.tar.gz")
  -s, --since d                   Log files will be queried up to <since> in the past. Supports d and `h` for days and hours respectively (default "2d")
  -y, --yes                       run command without prompting
```

The Istio functionality is [experimental]in[/experimental] status.

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters
